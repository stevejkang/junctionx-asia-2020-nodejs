const async = require('async');
const dbInfo = require('../../../config/database');

const conn = dbInfo.init();

module.exports = {
  getBuildingList: () => new Promise((resolve) => {
    async.waterfall([
      (callback) => {
        const query = `
          SELECT 
           jbd_idx AS buildingIdx,
           jbd_building_name AS buildingName,
           jbd_longitude AS longitude,
           jbd_latitude AS latitude
         FROM jxh_building;`;
        conn.query(query, [], (error, result) => {
          if (error) callback(error);
          else callback(null, result)
        })
      }
    ],
    (error, result) => {
      resolve({result: (!error), data: result});
    })
  }),
  checkItem: (buildingIdx) => new Promise((resolve) => {
    async.waterfall([
        (callback) => {
          const query = `
            SELECT
              IF(AVG(jbdr_field4) > 3, "Y", "N") AS "thermal",
              IF(AVG(jbdr_field6) > 3, "Y", "N") AS "mask",
              IF(AVG(jbdr_field3) > 3, "Y", "N") AS "disinfection"
            FROM jxh_building_review
            WHERE jbdr_jbd_idx = ${buildingIdx};`;
          conn.query(query, [], (error, result) => {
            if (error) callback(error);
            else callback(null, result)
          })
        }
      ],
      (error, result) => {
        resolve({result: (!error), data: result});
      })
  }),
  checkUserIsReviewed: (buildingIdx, userName) => new Promise((resolve) => {
    async.waterfall([
      (callback) => {
        const query = `
          SELECT
            COUNT(*) AS count
          FROM jxh_building_review
          WHERE jbdr_ju_username = '${userName}' AND jbdr_jbd_idx = ${buildingIdx};`;
        conn.query(query, [], (error, result) => {
          if (error) callback(error);
          else callback(null, result)
        })
      }
    ],
    (error, result) => {
      if (error || parseInt(result[0].count) === 0) {
        resolve({result: false});
      } else {
        resolve({result: true})
      }
    })
  }),
  getSpecificBuildingReviewInformation: (buildingIdx) => new Promise((resolve) => {
    async.waterfall([
      (callback) => {
        const query = `
          SELECT 
            jbdr_field1, jbdr_field2, jbdr_field3, jbdr_field4, jbdr_field5, jbdr_field6
          FROM jxh_building_review
          WHERE jbdr_jbd_idx = ${buildingIdx}`;
        conn.query(query, [], (error, result) => {
          if (error) callback(error);
          else callback(null, result)
        })
      }
    ],
    (error, result) => {
      resolve({result: (!error), data: result});
    })
  }),
  getSpecificBuildingInformation: (buildingIdx) => new Promise((resolve) => {
    async.waterfall([
      (callback) => {
        const query = `
          SELECT 
            jbd_building_name AS buildingName
          FROM jxh_building
          WHERE jbd_idx = ${buildingIdx}`;
        conn.query(query, [], (error, result) => {
          if (error) callback(error);
          else callback(null, result[0])
        })
      }
    ],
    (error, result) => {
      resolve({result: (!error), data: result});
    })
  }),
  submitReview: (requestParams) => new Promise((resolve) => {
    async.waterfall([
        (callback) => {
          const query = `
            INSERT INTO jxh_building_review(jbdr_field1, jbdr_field2, jbdr_field3, jbdr_field4, jbdr_field5, jbdr_field6, jbdr_jbd_idx, jbdr_ju_username)
              VALUES(${requestParams.field1}, ${requestParams.field2}, ${requestParams.field3}, ${requestParams.field4}, ${requestParams.field5}, ${requestParams.field6}, ${requestParams.buildingIdx}, '${requestParams.username}')`;
          conn.query(query, [], (error, result) => {
            if (error) callback(error);
            else callback(null, result[0])
          })
        }
      ],
      (error, result) => {
        resolve({result: (!error)});
      })
  })
}