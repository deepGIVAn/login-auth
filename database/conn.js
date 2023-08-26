const mongoose = require("mongoose");

// const { MongoMemoryServer } = require("mongodb-memory-server");
const { ATLAS_URL } = require("../config");

async function connect() {
  //  we are creating a sample server in our system before going to atlas..
  // const mongod = await MongoMemoryServer.create();
  // const getUri = mongod.getUri();

  mongoose.set("strictQuery", true);

  // const db = await mongoose.connect(getUri);
  const db = await mongoose.connect(ATLAS_URL);
  console.log("Database Connected");
  return db;
}

module.exports = connect;
