const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "examination_portal";

let client;
let db;

async function connectToDatabase() {
  if (db) return db;

  if (!uri) {
    throw new Error("MONGODB_URI is missing. Add it to .env before starting the server.");
  }

  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  db = client.db(dbName);
  await db.command({ ping: 1 });
  return db;
}

async function getDatabase() {
  return connectToDatabase();
}

async function closeDatabase() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

module.exports = {
  closeDatabase,
  connectToDatabase,
  getDatabase,
};
