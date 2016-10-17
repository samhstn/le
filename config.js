const env = process.env;

module.exports = {
  redis: {
    host: '127.0.0.1',
    port: 6379,
    db: env.NODE_ENV === 'test' ? 1 : 0
  },
  pg: {
    user: env.DATABASE_USER,
    database: env.NODE_ENV === 'test' ? env.TEST_DATABASE_NAME : env.DATABASE_NAME,
    password: '',
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    max: '10',
    idleTimeoutMillis: 10000,
    ssl: env.HEROKU
  }
};
