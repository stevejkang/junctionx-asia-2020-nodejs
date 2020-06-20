const homeRepository = require('../infrastructure/homeRepository');
const responseService = require('../../../core/response/response.service');

function imageArraySet(imageArray) {
  const data = imageArray.data;
  let returnData = [];
  data.forEach((v, i) => {
    returnData.push(v.jb_image_url);
  })
  return returnData;
}

module.exports = {
  getHome: async (request, response) => {
    const bannerImage = await homeRepository.getBannerImageLink();
    const latestNews = await homeRepository.getLatestWHONews();
    responseService.responseBody(response, { httpCode: 200 }, {
      banner: imageArraySet(bannerImage),
      latestNews: latestNews[0]
    });
  },
};