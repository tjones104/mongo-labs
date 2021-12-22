var { MongoClient } = require("mongodb");
var { ObjectId } = require("mongodb");

async function output(cursor) {
  if ((await cursor.length) === 0) {
    console.log("No documents found");
  } else {
    console.log("Found documents: \n", cursor);
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
    let cursor;

    // 1. Write a query to find anyone movie name using findOne method.
    console.log(
      "\nWrite a query to find anyone movie name using findOne method:"
    );
    console.log(await movies.findOne({ title: { $regex: "" } }));

    // 2. Write a query that returns the three highest-rated movies.
    console.log("\nWrite a query that returns the three highest-rated movies:");
    cursor = await movies
      .find({ rating: { $lt: 10 } }, { sort: { rating: -1 } })
      .limit(3)
      .toArray();
    await output(cursor);

    // Error catch and close
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
