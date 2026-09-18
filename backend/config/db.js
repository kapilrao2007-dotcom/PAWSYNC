const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Diagnostics for runtime connection changes (after a successful initial
// connect). These don't crash the process - Mongoose will keep trying to
// reconnect on its own - but logging them makes it obvious in the backend
// terminal WHY requests suddenly started failing with 503s.
mongoose.connection.on('disconnected', () => {
  console.error('[PAWSYNC] MongoDB disconnected - requests that touch the database will now fail with a clear 503 until it reconnects.');
});
mongoose.connection.on('reconnected', () => {
  console.log('[PAWSYNC] MongoDB reconnected.');
});
mongoose.connection.on('error', (err) => {
  console.error(`[PAWSYNC] MongoDB runtime error: ${err.message}`);
});

const DEFAULT_LOCAL_URI = 'mongodb://127.0.0.1:27017/pawsync';

// Looks like "nothing is listening on this Mongo port" rather than "wrong
// credentials" / "bad hostname" / a real Atlas problem.
function looksLikeNoLocalMongo(err) {
  return (
    err.name === 'MongoServerSelectionError' ||
    err.message?.includes('ECONNREFUSED') ||
    err.message?.includes('connect ECONNREFUSED')
  );
}

// If you never installed/started MongoDB locally, spin up a real MongoDB
// server that lives entirely inside this project - no separate install, no
// Atlas account needed. It downloads a genuine `mongod` binary once (a
// one-time ~70MB fetch, needs internet the first time only) and stores its
// data in backend/.local-mongo-data, so your data survives backend
// restarts just like a normal local MongoDB would.
async function startEmbeddedMongo() {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  const dbPath = path.join(__dirname, '..', '.local-mongo-data');

  console.log('[PAWSYNC] No local MongoDB found on 127.0.0.1:27017.');
  console.log('[PAWSYNC] Starting a built-in MongoDB instead (zero setup - this is a real MongoDB, just running inside this project).');
  console.log('[PAWSYNC] First run downloads the MongoDB binary (~70MB, needs internet) - this can take a minute. Later runs are instant.');

  // mongodb-memory-server expects this folder to already exist (it scans
  // it before starting) - it does NOT create it for you, which is exactly
  // what crashed with "ENOENT: no such file or directory, scandir ...
  // .local-mongo-data" on the very first run.
  fs.mkdirSync(dbPath, { recursive: true });

  const mongod = await MongoMemoryServer.create({
    instance: { dbPath, storageEngine: 'wiredTiger' },
  });

  return mongod.getUri('pawsync');
}

const connectDB = async () => {
  const configuredUri = process.env.MONGO_URI || DEFAULT_LOCAL_URI;

  try {
    const conn = await mongoose.connect(configuredUri, { serverSelectionTimeoutMS: 4000 });
    console.log(`[PAWSYNC] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return;
  } catch (err) {
    const usingDefaultLocalUri = configuredUri === DEFAULT_LOCAL_URI;

    if (usingDefaultLocalUri && looksLikeNoLocalMongo(err)) {
      try {
        const embeddedUri = await startEmbeddedMongo();
        const conn = await mongoose.connect(embeddedUri);
        console.log(`[PAWSYNC] Embedded MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
        console.log('[PAWSYNC] Run `npm run seed` in a new terminal (once) if you have not already, then use the app normally.');
        return;
      } catch (embeddedErr) {
        console.error(`[PAWSYNC] Could not start the built-in MongoDB fallback: ${embeddedErr.message}`);
        console.error('[PAWSYNC] This usually means no internet access to download the MongoDB binary, or it is blocked by a firewall/antivirus.');
        // fall through to the same clear failure message below
      }
    }

    console.error(`[PAWSYNC] MongoDB connection error: ${err.message}`);
    console.error(
      '[PAWSYNC] Fix MONGO_URI in backend/.env (a local mongod must be running, or your Atlas connection string/IP whitelist must be correct), then restart with npm run dev.'
    );
    process.exit(1);
  }
};

module.exports = connectDB;
