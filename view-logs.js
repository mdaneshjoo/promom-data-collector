/**
 * Script to view Lambda logs from LocalStack
 * This provides more flexibility than the built-in logs command
 */
const { execSync, spawn } = require('child_process');

// Configuration
const functionName = 'collector';
const logGroupName = `/aws/lambda/${functionName}`;

// Parse command line arguments
const args = process.argv.slice(2);
const watch = args.includes('--watch');

if (watch) {
  // Stream logs continuously
  streamLogs();
} else {
  // Show logs once
  showLogs();
}

function streamLogs() {
  console.log(`\n👀 Watching logs for ${logGroupName}...`);
  console.log('Press Ctrl+C to exit\n');
  
  // Store the last timestamp we've seen to only show new logs
  let lastTimestamp = Date.now();
  console.log(`Starting log polling from ${new Date(lastTimestamp).toISOString()}`);
  
  // Set up polling interval (every 2 seconds)
  const intervalId = setInterval(() => {
    try {
      // Get logs newer than the last timestamp we've seen
      const cmd = `awslocal logs filter-log-events --log-group-name ${logGroupName} --start-time ${lastTimestamp}`;
      const result = execSync(cmd, { stdio: ['pipe', 'pipe', 'pipe'] }).toString();
      
      try {
        const logs = JSON.parse(result);
        if (logs.events && logs.events.length > 0) {
          // Sort events by timestamp
          logs.events.sort((a, b) => a.timestamp - b.timestamp);
          
          // Display and update lastTimestamp
          logs.events.forEach(event => {
            const timestamp = new Date(event.timestamp).toISOString();
            console.log(`[${timestamp}] [${event.logStreamName}] ${event.message}`);
            lastTimestamp = Math.max(lastTimestamp, event.timestamp + 1);
          });
        }
      } catch (parseError) {
        // If we can't parse the result, just continue polling
      }
    } catch (error) {
      // If there's an error, just continue polling
      if (error.stderr) {
        const errorMsg = error.stderr.toString();
        if (errorMsg.includes('ResourceNotFoundException')) {
          // Log group doesn't exist yet, which is fine
        }
      }
    }
  }, 1000);
  
  // Handle graceful exit
  process.on('SIGINT', () => {
    clearInterval(intervalId);
    console.log('\nStopping log polling...');
    process.exit(0);
  });
}

function showLogs() {
  console.log('\n🔍 Checking for log groups...');
  try {
    console.log('Running: awslocal logs describe-log-groups');
    const logGroupsOutput = execSync('awslocal logs describe-log-groups').toString();
    console.log('Available log groups:', logGroupsOutput);
  } catch (error) {
    console.error('Error listing log groups:', error.message);
  }

  // Instead of checking individual streams, use filter-log-events directly
  console.log('\n📋 Getting logs with filter-log-events...');
  try {
    const filterCmd = `awslocal logs filter-log-events --log-group-name ${logGroupName} --limit 100`;
    console.log(`Running: ${filterCmd}`);
    const logsOutput = execSync(filterCmd).toString();
    
    // Parse and display logs in a more readable format
    try {
      const logs = JSON.parse(logsOutput);
      if (logs.events && logs.events.length > 0) {
        console.log('\n📝 Log messages:');
        logs.events.forEach((event) => {
          const timestamp = new Date(event.timestamp).toISOString();
          console.log(`[${timestamp}] [${event.logStreamName}] ${event.message}`);
        });
      } else {
        console.log('No log events found.');
      }
    } catch (parseError) {
      console.log('Could not parse log events:', parseError.message);
      console.log('Raw output:', logsOutput);
    }
  } catch (error) {
    console.error('Error retrieving logs:', error.message);
  }
}

console.log('\n💡 Manual commands to try:');
console.log('1. List log groups:');
console.log('   awslocal logs describe-log-groups');
console.log('2. List log streams for your function:');
console.log(`   awslocal logs describe-log-streams --log-group-name ${logGroupName}`);
console.log('3. Filter logs directly (recommended):');
console.log(`   awslocal logs filter-log-events --log-group-name ${logGroupName}`);
console.log('4. View logs from a specific time range:');
console.log(`   awslocal logs filter-log-events --log-group-name ${logGroupName} --start-time TIMESTAMP --end-time TIMESTAMP`);
console.log('\nTip: Run this script with --watch flag to stream logs continuously:');
console.log('   node view-logs.js --watch'); 