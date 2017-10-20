const pgp = require('pg-promise')();

// const config = {
//   connectDB() {
//     const connection = {
//       host: 'ec2-184-73-202-229.compute-1.amazonaws.com',
//       port: 5432,
//       database: 'd8uaa32fcj80a7',
//       user: 'tprnprooysdlcg',
//       password: 'pdTR6NAXEE36wuQ6ds3-xC_EZo',
//     };
//     return pgp(connection);
//   },
// };

const config = {
  connectDB() {
    const connection = {
      host: 'localhost',
      port: 5432,
      database: 'DB',
      user: 'postgres',
      password: '8235648',
    };
    return pgp(connection);
  },
};

module.exports = config;
