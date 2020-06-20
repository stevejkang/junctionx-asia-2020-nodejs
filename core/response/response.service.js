const IS_SUCCESS = 1;
const IS_ERROR = 0;

module.exports = {
  responseErrorBody: (response, responseObject) => {
    response.setHeader('Content-Type', 'application/json');
    response.status(responseObject.httpCode).json({
      result: IS_ERROR,
      errorCode: responseObject.errorCode,
      errorMessage: responseObject.errorMessage
    });
    response.end();
  },
  responseBody: (response, responseObject, responseData) => {
    response.setHeader('Content-Type', 'application/json');
    response.status(responseObject.httpCode).json({
      result: IS_SUCCESS,
      resultData: responseData,
    });
    response.end();
  }
};
