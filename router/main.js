const authUser = require('../api/auth/application/user');
const home = require('../api/home/application/home');
const building = require('../api/building/application/building');

const authMiddleware = require('../api/auth/middleware/authMiddleware');

module.exports = (app) => {
  app.post('/auth/username', (request, response) => {
    authUser.checkUserNameIsExist(request, response);
  });
  app.post('/auth/user', (request, response) => {
    authUser.signUpAccount(request, response);
  });
  app.post('/auth', (request, response) => {
    authUser.signInAccount(request, response);
  });
  app.get('/home', (request, response) => {
    home.getHome(request, response);
  });
  app.get('/buildings', (request, response) => {
    building.getBuildingListNearAround(request, response);
  });
  app.post('/buildings/:buildingId', (request, response) => {
    building.getBuildingInformation(request, response);
  });
  app.post('/buildings', (request, response) => {
    building.submitReview(request, response);
  });
};
