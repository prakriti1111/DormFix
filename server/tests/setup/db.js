/**
 * Test database lifecycle.
 *  - Default: in-memory MongoDB via mongodb-memory-server (needs internet once,
 *    to download the mongod binary; it is cached afterwards).
 *  - Override: set MONGO_URI_TEST to use any existing MongoDB instance.
 *    (Use a throwaway database - collections are wiped between tests!)
 */
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

let memoryServer = null;

const connect = async () => {
  let uri = process.env.MONGO_URI_TEST;
  if (!uri) {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri();
  }
  await mongoose.connect(uri, { dbName: `dormfix_test_${process.pid}` });
  // Make sure unique indexes exist before tests rely on them (409 checks).
  await Promise.all(Object.values(mongoose.models).map((m) => m.init()));
};

const clear = async () => {
  await Promise.all(
    Object.values(mongoose.models).map((m) => m.deleteMany({}))
  );
};

const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase().catch(() => {});
    await mongoose.disconnect();
  }
  if (memoryServer) await memoryServer.stop();
  const dir = path.join(__dirname, "..", "..", process.env.UPLOAD_DIR);
  fs.rmSync(dir, { recursive: true, force: true });
};

module.exports = { connect, clear, disconnect };
