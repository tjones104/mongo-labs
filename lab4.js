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

    // 3. Add a key called achievements in any two documents. One document should have ‘Super hit’ and other should have ‘Super Duper Hit’ as value to key achievements..
    console.log("\nAdd a key called achievements in any two documents:");
    await movies.updateOne(
      { title: "Parasite" },
      { $set: { achievements: "Super hit" } }
    );
    cursor = await movies.find({ title: "Parasite" }).toArray();
    await output(cursor);

    await movies.updateOne(
      { title: "Spider-Man: No Way Home" },
      { $set: { achievements: "Super Duper hit" } }
    );
    cursor = await movies.find({ title: "Spider-Man: No Way Home" }).toArray();
    await output(cursor);

    // 5. Write a query that returns all the movies that have both the ‘Super hit’ and the ‘Super Duper hit’’ achievements.
    console.log(
      "\nReturns all the movies that have both the ‘Super hit’ and the ‘Super Duper hit’ achievements:"
    );
    cursor = await movies
      .find({ achievements: { $in: ["Super Duper hit", "Super hit"] } })
      .toArray();
    await output(cursor);

    // 5. Write a query that returns only those movies that have achievement.
    console.log("\nReturns only those movies that have achievement:");
    cursor = await movies.find({ achievements: { $regex: "" } }).toArray();
    await output(cursor);

    // 6. List the movies grouped by year.
    console.log("\nList the movies grouped by year:");
    // cursor = await movies
    //   .find({ year: { $lt: 2021 } }, { $sort: { year: -1 } })
    //   .toArray();
    cursor = await movies
      .aggregate([
        { $match: { year: { $lte: 2021 } } },
        { $sort: { year: -1 } },
      ])
      .toArray();
    await output(cursor);

    //7. Count number of movies produced in this year.
    console.log("\nCount number of movies produced in this year:");
    cursor = await movies.aggregate([{ $match: { year: 2021 } }]).toArray();
    await output(cursor);

    //7.Group list of movies collection by actors..
    console.log("\nGroup list of movies collection by actors:");
    cursor = await movies
      .aggregate([
        { $match: { actor: { $regex: "" } } },
        { $sort: { actor: 1 } },
      ])
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
