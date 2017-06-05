'use strict';
// github auth
const express = require('express');
const router = express.Router();
const passport = require('passport');
const co = require('co');
const userProxy = require('../proxy/user');
const userSelectFields = ['githubId', 'profileUrl', 'displayName', 'username', 'avatar_url', 'company', 'blog', 'location', 'email', 'bio'];

router.get('/github', passport.authenticate('github'))
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/error' }),
  function(req, res) {
    let user = req.user;
    let newUser = {
      githubId: user.id,
      accessToken: user.accessToken,
      profileUrl: user.profileUrl,
      displayName: user.displayName, // nickname
      username: user.username, // github unique
    };
    let _json = user._json;
    let _jsonKeys = ['avatar_url', 'company', 'blog', 'location', 'email', 'bio']; // github 返回 object 的部分字段
    for (let key of _jsonKeys) {
      newUser[key] = _json[key]
    }
    co(function*() {
      let user = yield userProxy.getUserByGithubId(newUser.githubId);
      if (!user || !user.githubId) {
        user = yield userProxy.newAndSave(newUser);
      }
      // @todo update database user info from github
      return  user;
    }).then(function(user) {
      let tmpUser = {};
      userSelectFields.forEach(function(f) {
        tmpUser[f] = user[f]
      });
      req.session.user = tmpUser;
      res.flyer.send(302, {
        message: 200,
        user: user
      }, '/');
    }).catch(function(err) {
      res.flyer.send('error', {
        error: err
      })
    })
  });

router.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) res.flyer.send('error', { error: err });
    return res.redirect('/');
  })
});

module.exports = router;
