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

    // 1. Retrieve _id, genre, and rating of all movies.
    console.log("\nRetrieve _id, genre, and rating of all movies:");
    cursor = await movies
      .find({}, { projection: { _id: 1, genre: 1, rating: 1 } })
      .toArray();
    await output(cursor);

    // 2. Find the list of movies that has genre Drama or Crime.
    console.log("\nFind the list of movies that has genre Drama or Crime:");
    cursor = await movies
      .find({ genre: { $in: ["Drama", "Crime"] } })
      .toArray();
    await output(cursor);
    // 3. Find the list of movies that has genre Drama, Crime of both genres in one document and nested genres.
    console.log(
      "\nFind the list of movies that has genre Drama, Crime of both genres in one document and nested genre:"
    );
    cursor = await movies
      .find({ $and: [{ genre: "Drama" }, { genre: "Crime" }] })
      .toArray();
    await output(cursor);
    // 4. Find the list of movies that doesn’t include Fantasy genre.
    console.log(
      "\nFind the list of movies that doesn’t include Fantasy genre:"
    );
    cursor = await movies
      .find({ genre: { $not: { $eq: "Fantasy" } } })
      .toArray();
    await output(cursor);
    // 5. Find movies that has ‘Action’ as first element in Genre array.
    console.log(
      "\nFind movies that has ‘Action’ as first element in Genre array:"
    );
    cursor = await movies.find({ "genre.0": "Action" }).toArray();
    await output(cursor);
    // 6. Find the list of movies with budget above 10 USD.
    console.log("\nFind the list of movies with budget above 10 USD:");
    cursor = await movies.find({ budget: { $gt: 10 } }).toArray();
    await output(cursor);
    // 7. Find the list of movies commented by the ‘King Kochhar’.
    console.log("\nFind the list of movies commented by the ‘King Kochhar’");
    cursor = await movies
      .find({ "commentedBy.King Kochhar": { $exists: true } })
      .toArray();
    await output(cursor);
    // 8. Find the list of movies comment by ‘King Kochhar’.
    console.log(
      "\nFind the list of movies commented by the ‘King Kochhar’ with rating less than 10"
    );
    cursor = await movies
      .find(
        { "commentedBy.King Kochhar": { $exists: true } },
        { projection: { _id: 0, title: 1, commentedBy: 1 } }
      )
      .toArray();
    await output(cursor);
    // 9. Find the list of movies commented by the ‘King Kochhar’ with rating less than 10.
    console.log(
      "\nFind the list of movies commented by the ‘King Kochhar’ with rating less than 10"
    );
    cursor = await movies
      .find({ "commentedBy.King Kochhar": { $lt: 10 } })
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
