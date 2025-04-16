import { APIGatewayEvent, Context, Handler } from 'aws-lambda';
import { getDbConnection } from './database';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { DataSource, EntityTarget, Repository } from 'typeorm';
import {
  batchImport,
  createOrUpdateCollection,
  entityCollections,
  getSchemaForEntity,
  prepareDataForIndexing,
  typesenseHealthCheck,
} from './typesense';

// Initialize Sentry
Sentry.init({
  dsn:
    process.env.SENTRY_DSN ||
    'https://1c7c97c048b9955370ddaaa94e71ac01@o1357614.ingest.us.sentry.io/4509157719670784',
  integrations: [Sentry.httpIntegration(), nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  enabled: true,
});

async function getDBData(dataSource: DataSource, entity: EntityTarget<any>) {
  const repository: Repository<any> = dataSource.getRepository(entity);

  // Special case for Event entity - include calendar relation
  if (entity.toString().includes('Event')) {
    return repository.find({
      relations: ['calendar'],
    });
  }

  return repository.find();
}

function throwImportResultError(name: string, error: any) {
  if ('importResults' in error) {
    const importResults: { success: boolean; error?: string }[] = error.importResults;
    const failedDocuments = importResults.filter(result => !result.success);
    console.error(`Error importing batch for "${name}":`);
    console.error(failedDocuments);
    Sentry.captureException(JSON.stringify(failedDocuments), {
      extra: { message: `Error importing batch for "${name}"`, originalError: error.toString() },
      level: 'fatal',
    });
  } else {
    console.error(`Error importing batch for "${name}":`);
    console.error(error);
    Sentry.captureException(error, {
      extra: { message: `Error importing batch for "${name}"` },
      level: 'fatal',
    });
  }
}
export const handler: Handler = async (event: APIGatewayEvent, context: Context) => {
  // Create a transaction for performance monitoring
  // Using a more direct approach to avoid type issues
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await typesenseHealthCheck();
    const dataSource = await getDbConnection();
    // Process each entity collection
    for (const { entity, name } of entityCollections) {
      try {
        console.log(`Processing ${name}...`);

        const data = await getDBData(dataSource, entity);

        if (data.length === 0) {
          continue;
        }

        // Create or update collection schema
        const schema = getSchemaForEntity(name);
        await createOrUpdateCollection(name, schema);

        // Prepare data for indexing
        const preparedData = prepareDataForIndexing(data, name);

        // Import data into Typesense
        if (preparedData.length > 0) {
          console.log(`Importing ${preparedData.length} documents for ${name}`);
          // Import documents in batches to prevent overloading
          const batchSize = 50; // Reduced batch size for better reliability
          for (let i = 0; i < preparedData.length; i += batchSize) {
            try {
              const batch = preparedData.slice(i, i + batchSize);
              await batchImport(name, batch);
            } catch (error: any) {
              throwImportResultError(name, error);
            }
          }
          console.log(`Successfully indexed ${name}`);
        }
      } catch (error) {
        console.log(error);
        Sentry.captureException(error, { extra: { message: `Error  for ${name}` } });
      }
    }
  } catch (error) {
    console.error('Error in handler:', error);
    Sentry.captureException(error);
    throw error;
  } finally {
    // Make sure to flush Sentry events before Lambda terminates
    await Sentry.close();
  }
};
