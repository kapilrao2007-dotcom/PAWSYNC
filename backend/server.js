require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🐾 PAWSYNC API running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
  });
})();

process.on('unhandledRejection', (err) => {
  console.error(`[PAWSYNC] Unhandled Rejection: ${err.message}`);
});
