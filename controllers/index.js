const express = require('express');
const router = express.Router();

module.exports = function (app) {

  router.use('/galleries', require('./galleries')(app));
  // router.use('/photos', require('./photos')(app));
  // router.use('/storage', require('./storage')(app));

  return router;  
};