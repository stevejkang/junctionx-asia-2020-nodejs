const async = require('async');
const dbInfo = require('../../../config/database');

const conn = dbInfo.init();

module.exports = {
  checkUserNameIsExist: (requestedUserName) => new Promise((resolve) => {
    async.waterfall([
      (callback) => {
        const query = `
          SELECT
            COUNT(*) AS count
          FROM
            jxh_user
          WHERE
            ju_username = '${requestedUserName}'`;
        conn.query(query, [], (error, result) => {
          if (error) callback(error);
          else if (result[0].count > 0) callback(null, false);
          else callback(null, true);
        });
      }
    ],
    (error, result) => {
      resolve({ result: (!error && result) });
    });
  }),
  registerAccount: (requestParams) => new Promise((resolve) => {
    async.waterfall([
      (callback) => {
        const query = `
          INSERT INTO
            jxh_user(ju_username, ju_password, ju_create_datetime, ju_latitude, ju_longitude, ju_is_set_home, ju_address)
            VALUE('${requestParams.userName}', PASSWORD('${requestParams.password}'), NOW(), '${requestParams.latitude}', '${requestParams.longitude}', ${requestParams.isHomeSet}, '${requestParams.address}')`;
        conn.query(query, [], (error, result) => {
          if (error) callback(error);
          else callback(null, true);
        });
      }
    ],
    (error, result) => {
      resolve({ result: (!error && result) });
    });
  }),
  accessAccount: (requestParams) => new Promise((resolve) => {
    async.waterfall([
      (callback) => {
        const query = `
          SELECT
            COUNT(*) AS count
          FROM
            jxh_user
          WHERE ju_username = '${requestParams.userName}' AND ju_password = PASSWORD('${requestParams.password}')`;
        conn.query(query, [], (error, result) => {
          if (error) {
            callback(error);
          }
          else if (parseInt(result[0].count) === 1) callback(null, true);
          else callback(null, false);
        });
      }
    ],
    (error, result) => {
      resolve({ result: !error, success: result });
    });
  }),
  getUserInformation: (requestedUserName) => new Promise((resolve) => {
    async.waterfall([
      (callback) => {
        const query = `
          SELECT
            ju_latitude AS latitude, ju_longitude AS longitude, ju_is_set_home AS isHomeSet, ju_address AS address
          FROM
            jxh_user
          WHERE ju_username = '${requestedUserName}'`;
        conn.query(query, [], (error, result) => {
          if (error) callback(error);
          else callback(null, result[0]);
        });
      }
    ],
    (error, result) => {
      if (error) {
        resolve({ result: false });
      } else {
        resolve({ result: true, data: result });
      }
    })
  })
}
