const buildingRepository = require('../infrastructure/buildingRepository');

module.exports = {
  calculateSafetyLevel: (buildingIdx) => {
    buildingRepository.getSpecificBuildingReviewInformation(buildingIdx)
      .then((reviewInformation) => {
        console.log(reviewInformation);
      })
  }
};
