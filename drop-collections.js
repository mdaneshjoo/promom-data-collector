// Script to drop all collections in Typesense
const Typesense = require('typesense');
require('dotenv').config();

// Set API key 
const apiKey = process.env.TYPESENSE_API_KEY || '890803306';
const host = process.env.TYPESENSE_HOST || 'localhost';
const port = parseInt(process.env.TYPESENSE_PORT || '8108');
const protocol = process.env.TYPESENSE_PROTOCOL || 'http';

// Configure Typesense client
const typesenseClient = new Typesense.Client({
  nodes: [{ host, port, protocol }],
  apiKey: apiKey,
  connectionTimeoutSeconds: 5,
});

async function dropAllCollections() {
  try {
    console.log('Getting all collections...');
    const collections = await typesenseClient.collections().retrieve();
    
    if (collections.length === 0) {
      console.log('No collections found to drop.');
      return;
    }
    
    console.log(`Found ${collections.length} collections to drop.`);
    
    for (const collection of collections) {
      try {
        console.log(`Dropping collection: ${collection.name}...`);
        await typesenseClient.collections(collection.name).delete();
        console.log(`✅ Successfully dropped collection: ${collection.name}`);
      } catch (error) {
        console.error(`❌ Failed to drop collection ${collection.name}:`, error.message);
      }
    }
    
    console.log('\n✅ All collections have been processed.');
    
    // Verify collections are dropped
    const remainingCollections = await typesenseClient.collections().retrieve();
    if (remainingCollections.length === 0) {
      console.log('✅ All collections have been successfully dropped!');
    } else {
      console.log(`⚠️ There are still ${remainingCollections.length} collections remaining.`);
      console.log('Remaining collections:', remainingCollections.map(c => c.name).join(', '));
    }
    
  } catch (error) {
    console.error('❌ Error dropping collections:', error);
  }
}

// Run the function
dropAllCollections().catch(console.error); 