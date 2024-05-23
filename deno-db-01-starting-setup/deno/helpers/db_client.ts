import { MongoClient, Database } from "https://deno.land/x/mongo@v0.8.0/mod.ts";

const MONGO_USER = Deno.env.get("MONGO_USER");
const MONGO_PASSWORD = Deno.env.get("MONGO_PASSWORD");
// const MONGO_DEFAULT_DATABASE = Deno.env.get("MONGO_DEFAULT_DATABASE");

const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.7pba9hx.mongodb.net?retryWrites=true&w=majority`;

let db: Database;

export async function connect() {
  const client = new MongoClient();
  await client.connectWithUri(uri);

  db = client.database("todo-app"); // specify the database name
}

export function getDb() {
  return db;
}
