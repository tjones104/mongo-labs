var { MongoClient } = require("mongodb");
var { ObjectId } = require("mongodb");

async function output(cursor) {
  if ((await cursor.count()) === 0) {
    console.log("No documents found");
  } else {
    await cursor.forEach((band) => console.log(band));
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
    const bands = database.collection("bands");
    let cursor;
    // 1. City of Guns n' Roses to Los Angeles.
    console.log("\nCity of Guns n' Roses to Los Angeles.:");
    await bands.updateOne(
      { name: "Guns n' Roses" },
      { $set: { "formed.city": "Los Angeles" } }
    );
    cursor = bands.find({ name: "Guns n' Roses" });
    await output(cursor);

    // 2. Formed year of Metallica to 1981.
    console.log("\nFormed year of Metallica to 1981.:");
    await bands.updateOne(
      { name: "Metallica" },
      { $set: { "formed.year": 1981 } }
    );
    cursor = bands.find({ name: "Metallica" });
    await output(cursor);

    // 3. Update Black Sabbath’s formed year to 1969, country to United Kingdom and city to Birmingham.
    console.log(
      "\nUpdate Black Sabbath’s formed year to 1969, country to United Kingdom and city to Birmingham.:"
    );
    await bands.updateOne(
      { name: "Black Sabbath" },
      {
        $set: {
          "formed.year": 1969,
          "formed.country": "United Kingdom",
          "formed.city": "Birmingham",
        },
      }
    );
    cursor = bands.find({ name: "Black Sabbath" });
    await output(cursor);

    // 4. Update Led Zeppelin’s formed year to 1988, country to United Kingdom and city to Bristol.
    console.log(
      "\nUpdate Led Zeppelin’s formed year to 1988, country to United Kingdom and city to Bristol.:"
    );
    await bands.updateOne(
      { name: "Led Zeppelin" },
      {
        $set: {
          "formed.year": 1988,
          "formed.country": "United Kingdom",
          "formed.city": "Bristol",
        },
      }
    );
    cursor = bands.find({ name: "Led Zeppelin" });
    await output(cursor);

    // 5. Update Rolling Stones formed year to 1962, country to United Kingdom and city to London.
    console.log(
      "\nUpdate Rolling Stones formed year to 1962, country to United Kingdom and city to London.:"
    );
    await bands.updateOne(
      { name: "Rolling Stones" },
      {
        $set: {
          "formed.year": 1962,
          "formed.country": "United Kingdom",
          "formed.city": "London",
        },
      }
    );
    cursor = bands.find({ name: "Rolling Stones" });
    await output(cursor);

    //6. Update Led Zeppelin’s year and city to 1968 and London.
    console.log("\nUpdate Led Zeppelin’s year and city to 1968 and London.:");
    await bands.updateOne(
      { name: "Led Zeppelin" },
      {
        $set: {
          "formed.year": 1968,
          "formed.city": "London",
        },
      }
    );
    cursor = bands.find({ name: "Led Zeppelin" });
    await output(cursor);

    //7. Add Pink Floyd’s formed in the year 1965.
    console.log("\nAdd Pink Floyd’s formed in the year 1965.:");
    await bands.insertOne({ name: "Pink Floyd", formed: { year: 1965 } });
    cursor = bands.find({ name: "Pink Floyd" });
    await output(cursor);
    // Error catch and close
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
