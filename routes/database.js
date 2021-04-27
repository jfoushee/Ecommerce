const config = {
  user: 'test',
  password: 'test',
  database: 'ecommerce_dev',
  driver: 'msnodesqlv8',
  server: 'DESKTOP-MMOFKDF\\SQLEXPRESS', // You can use 'localhost\\instance' to connect to named instance,
  options: {
    trustedConnection: true
  }
}


module.exports = config;
