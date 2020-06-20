const authService = require('../service/authService');
const authConstants = require('../domain/authConstants');
const responseService = require('../../../core/response/response.service');

module.exports = (request, response, next) => {
  try {
    const authKey = request.header['x-api-key'];
    const authState = authService.verifyToken(authConstants.TOKEN_TYPE.ACCESS_TOKEN, authKey);
    if (!authState.result) {
      if (authService.isTokenExpiredMessage(authState)) {
        throw new Error();
      } else {
        throw new Error();
      }
    } else {
      next();
    }
  } catch (error) {
    responseService.responseErrorBody(response, {
      httpCode: 401,
      errorCode: authConstants.ERROR_CODE.AUTHORIZE_FAIL,
      errorMessage: authConstants.ERROR_MESSAGE.INVALID_TOKEN
    });
  }
};
