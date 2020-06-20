const jwt = require('jsonwebtoken');
const authConstants = require('../domain/authConstants');
require('dotenv').config();

const accessTokenEncryption = process.env.JWT_ENCRYPTION_ACCESS;
const accessTokenExpiration = parseInt(process.env.JWT_EXPIRATION_ACCESS);
const refreshTokenEncryption = process.env.JWT_ENCRYPTION_REFRESH;
const refreshTokenExpiration = parseInt(process.env.JWT_EXPIRATION_REFRESH);

module.exports = {
  verifyToken: (type, token) => jwt.verify(token, module.exports.setTokenEncryption(type), {}, (error, result) => ({
    result: (!error) ? true : false,
    data: (!error) ? result : error,
  })),
  decodeToken: (type, token) => jwt.verify(token, module.exports.setTokenEncryption(type), { ignoreExpiration: true }, (error, decoded) => decoded),
  generateToken: (type, id) => jwt.sign({ tokenId: id }, module.exports.setTokenEncryption(type), { expiresIn: module.exports.setTokenExpiration(type) }),
  isTokenExpiredMessage: (verifiedTokenData) => verifiedTokenData.data.name === 'TokenExpiredError',
  isTokenExpiredMessageTime: (verifiedTokenData) => verifiedTokenData.data.expiredAt,
  setTokenEncryption: (tokenType) => ((tokenType === authConstants.TOKEN_TYPE.ACCESS_TOKEN) ? accessTokenEncryption : refreshTokenEncryption),
  setTokenExpiration: (tokenType) => ((tokenType === authConstants.TOKEN_TYPE.ACCESS_TOKEN) ? accessTokenExpiration : refreshTokenExpiration),
};
