require('dotenv/config');

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('FATAL: JWT_SECRET must be set and at least 32 characters long.');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error('FATAL: DATABASE_URL must be set.');
  process.exit(1);
}
if (!process.env.REDIS_URL) {
  console.error('FATAL: REDIS_URL must be set.');
  process.exit(1);
}

const app = require('./src/app');
const prisma = require('./src/config/db');
const redis = require('./src/config/cache');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Database connected');
    await redis.connect();
    console.log('Redis connected');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Startup failed:', err.message);
    await prisma.$disconnect();
    redis.disconnect();
    process.exit(1);
  }
}

startServer();
