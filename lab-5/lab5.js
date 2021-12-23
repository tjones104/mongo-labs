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

    // Create proper indexes to optimize queries below:
    await movies.createIndex(
      { genre: "text", comments: "text" },
      { default_language: "english", language_override: "idioma" }
    );

    await movies.createIndex({ budget: 1 });

    // 1.
    console.log("\n1:");
    cursor = await movies
      .find({ genre: { $in: ["Crime", "Drama"] } }, { genre: 1 })
      .toArray();
    await output(cursor);

    // 2.
    console.log("\n2:");
    cursor = await movies
      .find({ genre: { $all: ["Crime", "Drama"] } }, { genre: 1 })
      .toArray();
    await output(cursor);

    // 3.
    console.log("\n3:");
    cursor = await movies
      .find(
        { genre: { $all: ["Crime", "Drama"], $ne: "Fantasy" } },
        { genre: 1 }
      )
      .toArray();
    await output(cursor);

    // 4.
    console.log("\n4:");
    cursor = await movies
      .find({ genre: { $size: 2, $all: ["Crime", "Drama"] } }, { genre: 1 })
      .toArray();
    await output(cursor);

    // 5.
    console.log("\n5:");
    cursor = await movies
      .find({ "budget.amount": { $gte: 10000000 }, "budget.currency": "USD" })
      .toArray();
    await output(cursor);
    // 6.
    console.log("\n6:");
    cursor = await movies
      .find({ "budget.currency": "USD", "budget.amount": { $gte: 10000000 } })
      .toArray();
    await output(cursor);
    // 7.
    console.log("\n7:");
    cursor = await movies.find({ "comments.author": "wolf_wallace" }).toArray();
    await output(cursor);
    // 8.
    console.log("\n8:");
    cursor = await movies
      .find(
        { "comments.author": "wolf_wallace" },
        { title: 1, "comments.$": 1 }
      )
      .toArray();
    await output(cursor);
    // 9.
    console.log("\n9:");
    cursor = await movies
      .find(
        {
          comments: {
            $elemMatch: { author: "wolf_wallace", rating: { $lt: 10 } },
          },
        },
        { "comments.$": 1 }
      )
      .toArray();
    await output(cursor);

    await movies.dropIndex({ budget: 1 });
    await movies.dropIndex("genre_text_comments_text");
    //  Create proper queries and indexes to support it:

    // 1. Find all movies and sort the result as descending by year and ascending by title. Add proper index to support fast execution of this query.
    console.log(
      "\nFind all movies and sort the result as descending by year and ascending by title:"
    );
    cursor = await movies.find({}, { sort: { year: -1, title: 1 } }).toArray();
    await output(cursor);

    // 2. Find 10 newest movies. This query should use only the index.
    await movies.createIndex({ title: 1, year: -1 });
    console.log("\nFind 10 newest movies:");
    cursor = await movies
      .find({}, { sort: { year: -1 } })
      .limit(10)
      .toArray();
    await output(cursor);
    await movies.dropIndex({ title: 1, year: -1 });
    // 3. Make a constraint to the title, to accept only unique values.
    await movies.createIndex({ title: 1 }, { unique: true });
    await movies.dropIndex({ title: 1 });
    // 4. Create a logs collection that will be able to store exactly 50 MB of data or 10 thousand documents.
    database.createCollection("logs", {
      capped: true,
      size: 50000000,
      max: 10000,
    });

    // 5. Create full-text indexes for movies collection, and then search for movies with the phrase "love story".
    await movies.createIndex(
      { fullText: "text" },
      { default_language: "english", language_override: "idioma" }
    );
    console.log("\nsearch for movies with the phrase 'love story':");
    cursor = await movies
      .find({ fullText: { $regex: "love story" } })
      .limit(10)
      .toArray();
    await output(cursor);

    await movies.dropIndex("fullText_text");
    // 6. Get the list of action movies with Michael Caine.
    await movies.createIndex({ cast: 1 });
    console.log("\nGet the list of action movies with Michael Caine:");
    cursor = await movies.find({ cast: "Michael Caine" }).limit(10).toArray();
    await output(cursor);
    await movies.dropIndex({ cast: 1 });
    // Error catch and close
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
