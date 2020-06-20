module.exports.TOKEN_TYPE = {
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
};

module.exports.ERROR_CODE = {
  AUTHORIZE_FAIL: 'AUTHORIZE_FAIL',
  QUERY_FAIL: 'QUERY_FAIL',
  MISSING_FIELD: 'MISSING_FIELD',
  ACCESS_DENIED: 'ACCESS_DENIED',
};

module.exports.ERROR_MESSAGE = {
  EXPIRED_TOKEN: 'Token is expired.',
  INVALID_TOKEN: 'Token is invalid or not permitted.',
  FAILED_QUERY: 'Query is failed.',
  MISSING_FIELD: 'Some required fields are missing.',
  ACCESS_DENIED: 'No permission to access to this information'
};
