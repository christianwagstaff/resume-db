const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

async function MongoMSStart() {
  return await MongoMemoryServer.create();
}

const mongoServer = MongoMSStart();

exports.initializeMongoServer = async () => {
  const mongoUri = mongoServer.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  mongoose.connect(mongoUri, mongooseOpts);
};

exports.dbDisconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.close();
};
