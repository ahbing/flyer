'use strict';
const express = require('express');
const router = express.Router();
const mail = require('../controllers/mail');

router.get('/', mail.showCreateMail);
router.get('/mails', mail.showMails);
router.get('/randomMail', mail.showMail);

// 写入数据库
router.post('/create', mail.create);

router.post('/update', mail.update);

module.exports = router;
