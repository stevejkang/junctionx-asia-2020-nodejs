const buildingRepository = require('../infrastructure/buildingRepository');
const buildingCalculate = require('../domain/calculateSafetyLevel');
const responseService = require('../../../core/response/response.service');

module.exports = {
  getBuildingListNearAround: (request, response) => {
    // const currentLatitude = request.body.latitude;
    // const currentLongitude = request.body.longitude;
    buildingRepository.getBuildingList()
      .then((listData) => {
        responseService.responseBody(response, { httpCode: 200 }, {
          buildingList: listData.data,
        });
      })
  },
  getBuildingInformation: (request, response) => {
    const buildingIdx = request.params.buildingId;
    const userName = request.body.username;
    buildingRepository.getSpecificBuildingReviewInformation(buildingIdx)
      .then((reviewInformation) => {
        if (reviewInformation.result) {
          const informationLength = reviewInformation.data.length;
          const totalParent = 6 * informationLength;
          const total = reviewInformation.data.reduce((acc, review) => acc + Object.values(review).reduce((x, y) => x + y, 0), 0);
          let finalValue = (total / totalParent).toFixed(1);
          if (isNaN(finalValue)) finalValue = "UNKNOWN";
          buildingRepository.getSpecificBuildingInformation(buildingIdx)
            .then((buildingInformation) => {
              if (buildingInformation.result) {
                const buildingName = buildingInformation.data.buildingName;
                buildingRepository.checkUserIsReviewed(buildingIdx, userName)
                  .then((reviewedInformation) => {
                    let isReviewed = reviewedInformation.result;
                    buildingRepository.checkItem(buildingIdx)
                      .then((itemInformation) => {
                        if (itemInformation.result) {
                          let checkItems = itemInformation.data[0];
                          responseService.responseBody(response, { httpCode: 200 }, {
                            buildingName: buildingName,
                            safetyLevel: finalValue,
                            isReviewed: isReviewed,
                            checkItems: checkItems
                          });
                        }
                      })
                  })
              }
            })
        }
      })
  },
  submitReview: (request, response) => {
    const requestedUserName = request.body.username;
    const requestedBuildingIdx = request.body.buildingIdx;
    const {
      field1, field2, field3, field4, field5, field6
    } = request.body;
    const requestParams = {
      username: requestedUserName,
      buildingIdx: requestedBuildingIdx,
      field1: field1,
      field2: field2,
      field3: field3,
      field4: field4,
      field5: field5,
      field6: field6
    }
    buildingRepository.submitReview(requestParams)
      .then((insertResult) => {
        if (insertResult.result) {
          responseService.responseBody(response, { httpCode: 200 }, {
            success: Number(insertResult.result)
          });
        }
      })
  }
};
