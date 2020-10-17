// require('custom-env').env();

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: (process.env.DATABASE_LOGS == 'true') ? console.log : false
  }
};