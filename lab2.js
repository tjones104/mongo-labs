var { MongoClient } = require("mongodb");
var { ObjectId } = require("mongodb");

async function empty(cursor) {
  if ((await cursor.count()) === 0) {
    console.log("No documents found!");
  }
}

async function main() {
  const uri =
    "mongodb+srv://tjones104:4356@labs.nl69h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Store path to collection
    const database = client.db("Labs");
    const movies = database.collection("movies");

    // 1.
    // let cursor = movies.find();
    // console.log("\nMovie List:");
    // empty(cursor);
    // await cursor.forEach((movie) => console.log(movie));

    // Error catch and close
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
