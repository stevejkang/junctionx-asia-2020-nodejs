const mysql = require('mysql');
require('dotenv').config();

const connInfo = {
  dev: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATA,
    multipleStatements: true,
    dateStrings: 'date',
  }
};

module.exports = {
  init: () => {
    const connection = mysql.createConnection(connInfo.dev);
    connection.config.queryFormat = function binding(query, values) {
      if (!values) return query;
      return query.replace(/:(\w+)/g, (txt, key) => {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
          return this.escape(values[key]);
        }
        return txt;
      });
    };
    return connection;
  },
  dbopen: (connection) => {
    connection.connect((error) => {
      if (error) {
        console.error(`mysql connection error : ${error}`);
      } else {
        console.info('mysql connection successfully');
      }
    });
  },
};
