const authUser = require('../api/auth/application/user');

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
};
