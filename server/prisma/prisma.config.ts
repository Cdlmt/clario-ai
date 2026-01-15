import path from 'node:path';

export default {
  schema: path.join(__dirname, 'schema.prisma'),
  migrate: {
    async development() {
      return {
        url: process.env.DATABASE_URL!,
      };
    },
  },
};
