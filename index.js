const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const responseConstants = require('./core/response/constants');
const responseService = require('./core/response/response.service');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = require('./router/main')(app);

app.listen(2000, '0.0.0.0', () => {
  console.log('Express server has started on port 2000');
});

app.use((request, response) => {
  responseService.responseErrorBody(response, {
    httpCode: 404,
    errorCode: responseConstants.ERROR_RESPONSE_CODE.NOT_FOUND,
    errorMessage: responseConstants.ERROR_RESPONSE_MESSAGE.NOT_FOUND,
  });
});
