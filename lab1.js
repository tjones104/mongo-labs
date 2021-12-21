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

    // 1. Return all movies
    let cursor = movies.find();
    console.log("\nMovie List:");
    empty(cursor);
    await cursor.forEach((movie) => console.log(movie));

    // 2. Find all movies produced in 2020.
    console.log("\nAll movies produced in 2020;");
    cursor = movies.find({ year: 2020 });
    empty(cursor);
    await cursor.forEach((movie) => console.log(movie));

    // 3. Find a film whose _id is 9260b70c21141bb2f38d6178.
    console.log("\nFilm whose _id is 9260b70c21141bb2f38d6178.:");
    cursor = movies.find({ _id: ObjectId("9260b70c21141bb2f38d6178") });
    empty(cursor);
    await cursor.forEach((movie) => console.log(movie));

    // 4. Find only one English movie produced in 2020
    await console.log("\nEnglish movie produced in 2020:");
    console.log(await movies.findOne({ language: "English", year: 2020 }));

    // 5. Find the title and rating of movies that are rated 9 or above.
    console.log("\nTitle and rating of movies that are rated 9 or above:");
    cursor = movies.find(
      { rating: { $gte: 9 } },
      { projection: { _id: 0, title: 1, rating: 1 } }
    );
    empty(cursor);
    await cursor.forEach((movie) => console.log(movie));

    // 6. Find the list of movies that are rated between 7 and 9 (Include Lower & Upper limits) and sort results in increasing order.
    console.log("\nList of movies that are rated between 7 and 9:");
    cursor = movies.find(
      { rating: { $gte: 7, $lt: 10 } },
      { sort: { rating: -1 } }
    );
    empty(cursor);
    await cursor.forEach((movie) => console.log(movie));

    // 7. Returns the three highest-rated movies.
    console.log("\nReturns the three highest-rated movies:");
    cursor = movies
      .find({ rating: { $lt: 10 } }, { sort: { rating: -1 } })
      .limit(3);
    empty(cursor);
    await cursor.forEach((movie) => console.log(movie));

    // 8. Find the list of movies produced in the years 2018, 2019, 2020, and 2021.
    console.log(
      "\nList of movies produced in the years 2018, 2019, 2020, and 2021:"
    );
    cursor = movies.find({ year: { $gte: 2018, $lte: 2021 } });
    empty(cursor);
    await cursor.forEach((movie) => console.log(movie));

    // 9. Find movies that have "Bliss" somewhere in the title.
    console.log("\nFind movies that have 'Bliss' somewhere in the title:");
    cursor = movies.find({ title: { $regex: "Bliss" } });
    empty(cursor);
    await cursor.forEach((movie) => console.log(movie));
    // Error catch and close
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
