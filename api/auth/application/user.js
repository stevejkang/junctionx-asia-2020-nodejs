const userRepository = require('../infrastructure/userRepository');
const responseService = require('../../../core/response/response.service');
const authConstants = require('../domain/authConstants');
const authService = require('../service/authService');
const authRepository = require('../infrastructure/authRepository');

module.exports = {
  checkUserNameIsExist: (request, response) => {
    const requestedUserName = request.body.username;
    userRepository.checkUserNameIsExist(requestedUserName)
      .then((checkData) => {
        responseService.responseBody(response, { httpCode: 200 }, {
          available: Number(checkData.result)
        });
      });
  },
  signUpAccount: (request, response) => {
    const userName = request.body.username;
    const password = request.body.password;
    const isHomeSet = parseInt(request.body.isHomeSet);
    const latitude = request.body.latitude || 0;
    const longitude = request.body.longitude || 0;
    const address = request.body.address || '';

    const requestParams = {
      userName: userName,
      password: password,
      isHomeSet: isHomeSet,
      latitude: latitude,
      longitude: longitude,
      address: address
    };
    userRepository.registerAccount(requestParams)
      .then((insertData) => {
        responseService.responseBody(response, { httpCode: 200 }, {
          success: Number(insertData.result)
        });
      });
  },
  signInAccount: (request, response) => {
    const userName = request.body.username;
    const password = request.body.password;

    const requestParams = {
      userName: userName,
      password: password
    };
    userRepository.accessAccount(requestParams)
      .then((checkData) => {
        if (!checkData.result) {
          responseService.responseErrorBody(response, {
            httpCode: 501,
            errorCode: authConstants.ERROR_CODE.QUERY_FAIL,
            errorMessage: authConstants.ERROR_MESSAGE.FAILED_QUERY
          });
        } else if (checkData.result && !checkData.success) {
          responseService.responseErrorBody(response, {
            httpCode: 401,
            errorCode: authConstants.ERROR_CODE.ACCESS_DENIED,
            errorMessage: authConstants.ERROR_MESSAGE.ACCESS_DENIED
          });
        } else {
          let accessTokenForResponse = '';
          let refreshTokenForResponse = '';
          authRepository.checkUserRefreshTokenIsRegistered(userName)
            .then((tokenIsRegistered) => {
              if (!tokenIsRegistered.result) {
                responseService.responseErrorBody(response, {
                  httpCode: 501,
                  errorCode: authConstants.ERROR_CODE.QUERY_FAIL,
                  errorMessage: authConstants.ERROR_MESSAGE.FAILED_QUERY
                });
              } else if (tokenIsRegistered.result && !tokenIsRegistered.token) {
                accessTokenForResponse = authService.generateToken(authConstants.TOKEN_TYPE.ACCESS_TOKEN, userName);
                refreshTokenForResponse = authService.generateToken(authConstants.TOKEN_TYPE.REFRESH_TOKEN, userName);
              } else {
                accessTokenForResponse = authService.generateToken(authConstants.TOKEN_TYPE.ACCESS_TOKEN, userName);
                refreshTokenForResponse = tokenIsRegistered.token;
                const authState = authService.verifyToken(authConstants.TOKEN_TYPE.REFRESH_TOKEN, tokenIsRegistered.token);
                if (!authState.result) {
                  if (authService.isTokenExpiredMessage(authState)) {
                    refreshTokenForResponse = authService.generateToken(authConstants.TOKEN_TYPE.REFRESH_TOKEN, userName);
                  }
                }
              }
              const requestParams = {
                userName: userName,
                refreshToken: refreshTokenForResponse
              };
              authRepository.registerNewRefreshToken(requestParams)
                .then((registered) => {
                  if (registered.result) {
                    userRepository.getUserInformation(userName)
                      .then((userData) => {
                        if (userData.result) {
                          const responseData = {
                            userName: userName,
                            accessToken: accessTokenForResponse,
                            refreshToken: refreshTokenForResponse,
                            extraInformation: userData.data
                          }
                          responseService.responseBody(response, { httpCode: 200 }, responseData);
                        }
                      })
                  }
                })
            })
        }
      })
  },
};
