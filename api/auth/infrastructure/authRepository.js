const async = require('async');
const dbInfo = require('../../../config/database');

const conn = dbInfo.init();

module.exports = {
  checkUserRefreshTokenIsRegistered: (requestedUserName) => new Promise((resolve) => {
    async.waterfall([
      (callback) => {
        const query = `
          SELECT
            ju_refresh_token AS refreshToken
          FROM
            jxh_user
          WHERE ju_username = '${requestedUserName}'`;
        conn.query(query, [], (error, result) => {
          if (error) callback(error);
          else if (result[0].refreshToken.length > 10) callback(null, result[0].refreshToken);
          else callback(null, false);
        });
      }
    ],
    (error, result) => {
      resolve({ result: (!error), token: !result ? null : result });
    });
  }),
  registerNewRefreshToken: (requestParams) => new Promise((resolve) => {
    async.waterfall([
      (callback) => {
        const query = `
          UPDATE jxh_user SET ju_refresh_token = '${requestParams.refreshToken}' WHERE ju_username = '${requestParams.userName}'`;
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
};
