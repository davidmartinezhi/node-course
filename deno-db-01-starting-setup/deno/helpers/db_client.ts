import {
  Database,
  MongoClient,
} from "https://deno.land/x/mongo@v0.33.0/mod.ts";

// Import the config function from deno-dotenv
import { config } from 'https://deno.land/x/dotenv/mod.ts';

// Load environment variables
const env = config();


const MONGO_USER = env.MONGO_USER
const MONGO_PASSWORD = env.MONGO_PASSWORD
const MONGO_DEFAULT_DATABASE = env.MONGO_DEFAULT_DATABASE

// const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.7pba9hx.mongodb.net/${MONGO_DEFAULT_DATABASE}?retryWrites=true&authSource=admin`;
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.7pba9hx.mongodb.net/${MONGO_DEFAULT_DATABASE}?retryWrites=true&authSource=admin`;
console.log(uri);

let db: Database;

export async function connect() {
  const client = new MongoClient();
  /**
   *  REPLACE CONNECTION STRING IF USING ATLAS
   *  "mongodb+srv://<username>:<password>@<cluster-id>.mongodb.net/<dbName>?retryWrites=true&authSource=admin"
   *  ==================
   *  AWAIT connect TO DATABASEE
   */

  try {
    await client.connect(uri);
    
    db = client.database("todos-app");

    console.log("Connected to database!");
  }
  catch (error) {
    console.log(error);
  }
}

export function getDb(): Database {
  if (!db) {
    throw new Error("DB not initialized!");
  }
  return db;
}
