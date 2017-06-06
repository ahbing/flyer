'use strict';
const express = require('express');
const router = express.Router();
const mail = require('../controllers/mail');

router.get('/', mail.showCreateMail);
router.get('/mails', mail.showMails);

router.get('/randomMail', mail.showMail);  // 航空获取
router.get('/randomMail2', mail.showMail2);  // 酒店获取

// 写入数据库
router.post('/create', mail.create);

router.post('/update', mail.update);

router.post('/delete', mail.delete);

module.exports = router;
