const async = require('async');
let Parser = require('rss-parser');
const dbInfo = require('../../../config/database');

const conn = dbInfo.init();

module.exports = {
  getBannerImageLink: () => new Promise((resolve) => {
    const query = `
      SELECT jb_image_url FROM jxh_banner WHERE jb_is_use = 1`;
    conn.query(query, [], (error, result) => {
      if (error) resolve({ result: false });
      else resolve({ result: true, data: result });
    })
  }),
  getLatestWHONews: () => new Promise((resolve) => {
    let parser = new Parser();
    let arr = [];
    parser.parseURL('https://www.who.int/rss-feeds/news-english.xml', function(err, feed) {
      feed.items.forEach(function(entry) {
        arr.push({
          author: 'WHO',
          title: entry.title,
          link: entry.link,
          linkText: `@ WHO News Room`
        });
      })
      resolve(arr);
    })
  })
};
