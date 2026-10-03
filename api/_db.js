import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://mdkaiumhasan2005_db_user:" + encodeURIComponent("225387@Km") + "@careguide.sx7qdrf.mongodb.net/portfolio_db?retryWrites=true&w=majority&appName=CareGuide";

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000
  });

  await client.connect();
  const db = client.db('portfolio_db');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
