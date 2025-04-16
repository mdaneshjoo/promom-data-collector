const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');


// Deploy to LocalStack
const functionName = 'collector';
const handler = 'index.handler';
const role = 'arn:aws:iam::000000000000:role/lambda-role'; // Dummy role for LocalStack
const runtime = 'nodejs22.x';
const args = process.argv.slice(2);

// Create log group name based on function name
const logGroupName = `/aws/lambda/${functionName}`;



// Check if we just want to view logs
if (args.includes('--logs')) {
  console.log(`Fetching logs for ${functionName}...`);
  try {
    // Use get-log-events instead of tail
    execSync(`awslocal logs get-log-events --log-group-name ${logGroupName} --log-stream-name ${functionName}/\$LATEST`, { stdio: 'inherit' });
  } catch (error) {
    console.error('Error fetching logs:', error.message);
    // If the above command fails, try describing log streams first
    try {
      console.log('Trying to list log streams...');
      execSync(`awslocal logs describe-log-streams --log-group-name ${logGroupName}`, { stdio: 'inherit' });
    } catch (streamError) {
      console.error('Error listing log streams:', streamError.message);
    }
  }
  return;
}

if (args.includes('--invoke')) {
  console.log('Invoking function...');
  execSync(`awslocal lambda invoke --function-name ${functionName} --payload '{}' response.json`, { stdio: 'inherit' });
  console.log('Invocation complete. Check "response.json" for results.');
  
  // Automatically show logs after invocation if requested
  if (args.includes('--show-logs')) {
    console.log('Showing logs:');
    try {
      // Wait a moment for logs to be available
      console.log('Waiting for logs to be available...');
      execSync('sleep 2');
      
      // First get log streams to find the latest one
      console.log('Fetching log streams...');
      const logStreamsCmd = `awslocal logs describe-log-streams --log-group-name ${logGroupName} --order-by LastEventTime --descending --limit 1`;
      console.log(`Running: ${logStreamsCmd}`);
      const logStreamsOutput = execSync(logStreamsCmd).toString();
      console.log('Log streams:', logStreamsOutput);
      
      // Extract stream name if possible, otherwise use default pattern
      let streamName = `${functionName}/\$LATEST`;
      try {
        const logStreams = JSON.parse(logStreamsOutput);
        if (logStreams.logStreams && logStreams.logStreams.length > 0) {
          streamName = logStreams.logStreams[0].logStreamName;
        }
      } catch (parseError) {
        console.log('Could not parse log streams, using default stream name:', streamName);
      }
      
      // Get the log events
      const logsCmd = `awslocal logs get-log-events --log-group-name ${logGroupName} --log-stream-name "${streamName}" --limit 100`;
      console.log(`Running: ${logsCmd}`);
      execSync(logsCmd, { stdio: 'inherit' });
    } catch (error) {
      console.error('Error fetching logs after invocation:', error.message);
      console.log('Try running the following command manually:');
      console.log(`awslocal logs describe-log-groups`);
      console.log(`awslocal logs describe-log-streams --log-group-name ${logGroupName}`);
      console.log(`awslocal logs get-log-events --log-group-name ${logGroupName} --log-stream-name STREAM_NAME`);
    }
  }
  return;
}

try {
  console.log("Deleting function...", functionName);
  execSync(`awslocal lambda delete-function --function-name ${functionName}`);
} catch (error) {
  console.warn(error);
}

try {
  console.log("Creating CloudWatch Log Group...");
  execSync(`awslocal logs create-log-group --log-group-name ${logGroupName}`);
} catch (error) {
  console.warn("Log group might already exist or could not be created:", error.message);
}

console.log("Deploying Function");
// Ensure the dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Please run the build process first.');
  process.exit(1);
}

// Package the function
const zipFile = path.join(__dirname, 'function.zip');
// Modified to include node_modules in the function zip
console.log('Creating deployment package with dependencies...');
if (fs.existsSync(zipFile)) {
  fs.unlinkSync(zipFile);
}

// Create temporary directory for Lambda package
const tempDir = path.join(__dirname, 'temp-lambda');
if (fs.existsSync(tempDir)) {
  execSync(`rm -rf ${tempDir}`);
}
fs.mkdirSync(tempDir);

// Copy the compiled code
execSync(`cp -r ${distDir}/* ${tempDir}`);

// Install production dependencies in the temp directory
fs.copyFileSync(
  path.join(__dirname, 'package.json'),
  path.join(tempDir, 'package.json')
);
fs.copyFileSync(
  path.join(__dirname, 'package-lock.json'),
  path.join(tempDir, 'package-lock.json')
);
console.log('Installing production dependencies...');
execSync('npm ci --production', { cwd: tempDir });

// Optional: Remove unnecessary files to reduce package size
console.log('Optimizing package size...');
try {
  // Remove tests, docs, and other unnecessary files from node_modules
  execSync('find node_modules -type d -name "test" -o -name "tests" -o -name "docs" -o -name "examples" | xargs rm -rf', { cwd: tempDir });
  console.log('Removed test and documentation files from node_modules');
} catch (e) {
  console.warn('Warning: Could not optimize package size', e.message);
}

// Create zip with all contents
console.log('Creating deployment package...');
execSync(`cd ${tempDir} && zip -r ${zipFile} .`, {
  maxBuffer: 50 * 1024 * 1024 // Increase max buffer to 50MB
});
console.log(`Lambda package created at: ${zipFile}`);

// Clean up temp directory
execSync(`rm -rf ${tempDir}`);

// Create function with environment variables
console.log('Creating Lambda function...');
// Create function without environment variables since we're hardcoding them in the code
const createFunctionCmd = `awslocal lambda create-function \
  --function-name ${functionName} \
  --runtime ${runtime} \
  --role ${role} \
  --handler ${handler} \
  --zip-file fileb://${zipFile}`;

console.log(`Running: ${createFunctionCmd}`);
execSync(createFunctionCmd, { stdio: 'inherit' });

if (args.includes('--wait')) {
  console.log("wait until activate");
  execSync(`awslocal lambda wait function-active-v2 --function-name ${functionName}`);
  console.log('Function is active in LocalStack.');
}

console.log('Deployment to LocalStack completed successfully.');
console.log('To view logs run: npm run logs');
console.log('To invoke and see logs run: npm run invoke:logs');








