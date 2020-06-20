const authUser = require('../api/auth/application/user');
const home = require('../api/home/application/home');

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
  })
};
