'use strict';
const co = require('co');
const querystring = require('querystring');
const mailProxy = require('../proxy/mail');
const errors = require('../common/errors');
const config = require('../config');
const random = require('../helper/random');
const countryData = require('../data/country.json');
const addressData = require('../data/address.json');
const lastNameData = require('../data/lastName.json');
const firstNameData = require('../data/firstName.json');
// const countryArrLen = 1;
const cityArrLen = 30;
const addressArrLen = 370;
const lastNameArrLen = 196;
const firstNameArrLen = 516;
// 数据库添加待注册邮箱
exports.create = function(req, res) {
  let body = req.body;
  let mail = body.mail;
  let pass = random.string() + random.number();
  // let countryArr = countryData['Country'];
  // let homecountryname = countryArr[random.rangeNum(0, countryArrLen)];
  let homecountryname = 'CN'; // 中国地址
  let homecity = countryData[homecountryname][random.rangeNum(0, cityArrLen)];
  let homeaddress1 = addressData[homecountryname][random.rangeNum(0, addressArrLen)];
  let lastName = lastNameData[homecountryname][random.rangeNum(0, lastNameArrLen)];
  let firstName = firstNameData[homecountryname][random.rangeNum(0, firstNameArrLen)];
  let newMail = mailProxy.newAndSave(mail, pass, firstName, lastName, homeaddress1, homecity, homecountryname);
  newMail.then(function(mail) {
    res.flyer.send(200, {
      message: 'OK',
      mail: mail
    })
    // return res.redirect('/mail/' + mail._id);
  }).catch(function(err) {
    res.flyer.send('error', {
      error: err
    })
  });
};

exports.showCreateMail = function(req, res) {
  // let user = req.session.user;
  // let templateOrStatusCode = user && user._id ? 'newMail' : 302;
  let templateOrStatusCode = 'newMail';
  res.flyer.send(templateOrStatusCode, {
   message: 200,
  //  user: req.session.user,
  })
};

exports.showMails = function(req, res) {
  let page = +req.query.page || 0;
  let per_page = +req.query.per_page || 10;
  let query = {};
  co(function* () {
    let mails = yield mailProxy.getMails(page, per_page, query);
    return mails;
  }).then(function(mails) {
    res.flyer.send('index', {
      message: 200,
      mails: mails
    })
  }).catch(function(err) {
    res.repair.send('error', {
      error: err
    })
  });
};

// 随机发送注册邮箱
exports.showMail = function(req, res) {
  let clientID = req.query.clientID;
  
  co(function*() {
    if (clientID !== config.clientID) {
      yield Promise.reject(new errors.ForbiddenError('你没有权限进行这样的操作'))
    }
    let mail = yield mailProxy.getMailUnused();
    return mail;
  }).then(function(mail) {
    res.flyer.send('mail', {
      message: 200,
      mail: mail
    })
  }).catch(function(err) {
    res.flyer.send('error', {
      error: err
    })
  });
};


exports.update = function(req, res) {
  let newBody = req.body;
  let mailName = newBody.mail;
  let clientID = newBody.clientID;
  // let user = req.session.user;
  co(function* () {
    if (clientID !== config.clientID) {
      yield Promise.reject(new errors.ForbiddenError('你没有权限进行这样的操作'))
    }
    // let curMail = yield mailProxy.getMailbyMailName(mailName);
    // if (!user || user.githubId !== curMail.user) {
    //   yield Promise.reject(new errors.ForbiddenError('你没有权限进行这样的操作'))
    // }
    let newMail = yield mailProxy.updateMailBodyByMailName(mailName, newBody);
    return newMail;
  }).then(
    function(newMail) {
      res.flyer.send('mail', {
        message: 200,
        mail: newMail,
        // user: req.session.user,
      })
    }
  )
  .catch(function(err) {
    res.flyer.send('error', {
      error: err
    });
  });
};

exports.delete = function(req, res) {
  let body = req.body;
  let mailName = body.mail;
  let clientID = body.clientID;
  co(function* () {
    if (clientID !== config.clientID) {
      yield Promise.reject(new errors.ForbiddenError('你没有权限进行这样的操作'))
    }

    let newMail = yield mailProxy.deleteMailByMailName(mailName);
    return newMail;
  }).then(
    function(newMail) {
      res.flyer.send('mail', {
        message: 200,
        mail: newMail
      })
    }
  )
  .catch(function(err) {
    res.flyer.send('error', {
      error: err
    });
  });
}
