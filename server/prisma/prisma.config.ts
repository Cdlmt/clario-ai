import path from 'node:path';
import dotenv from 'dotenv';

// Load .env from server directory
dotenv.config({ path: path.join(__dirname, '../', '.env') });

export default {
  schema: path.join(__dirname, 'schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
};
