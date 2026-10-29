import dns from 'dns';
import { MongoClient } from 'mongodb';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (_) {
  // Ignore in restricted serverless environments where custom DNS servers are locked
}

let cachedClient = null;
let cachedDb = null;
let cachedUri = null;

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.trim().length === 0) {
    throw new Error('MONGODB_URI environment variable is not configured');
  }

  if (cachedClient && cachedDb && cachedUri === uri) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000
  });

  await client.connect();
  const dbName = process.env.MONGODB_DB_NAME || 'portfolio_db';
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;
  cachedUri = uri;

  return { client, db };
}
