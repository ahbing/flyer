'use strict';
const express = require('express');
const router = express.Router();

module.exports = function(app) {
  // const auth = require('./auth');
  const mail = require('./mail');

  const routes = [
    // { path: '', router: mail, api: true },
    { path: 'mail', router: mail, api: true },
    // { path: 'auth', router: auth, api: true }
  ];

  routes.forEach(function(route) {
    app.use('/' + route.path, route.router);
    if (route.api) {
      app.use('/api/' + route.path, route.router);
    }
  });
};