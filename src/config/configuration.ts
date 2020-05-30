export default () => ({
  host: {
    url: process.env.HOST_URL,
    port: parseInt(process.env.HOST_PORT, 10) || parseInt(process.env.PORT, 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: parseInt(process.env.JWT_EXPIRATION),
  },

  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  
  vat: {
    url: process.env.VAT_URL,
    key: process.env.VAT_KEY
  }

});
