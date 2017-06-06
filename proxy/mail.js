'use strict';
const models = require('../models');
const Mail = models.Mail;

const selectMailFileds = 'mail pass firstName lastName homeaddress1 homecity homecountryname status baNumber mrNumber activeTime';

exports.newAndSave = function(mail, pass, firstName, lastName, homeaddress1, homecity, homecountryname) {
  let newMail = new Mail();
  newMail.mail = mail
  newMail.pass = pass
  newMail.firstName = firstName
  newMail.lastName = lastName
  newMail.homeaddress1 = homeaddress1
  newMail.homecity = homecity
  newMail.homecountryname = homecountryname
  return newMail.save();
};

exports.getMailbyMailName = function(mail) {
  return Mail
    .findOne({ mail: mail })
    .select(selectMailFileds)
    .exec();
};

// 获取一个没使用过的邮箱
exports.getMailUnused = function() {
  return Mail.findOne({ status: 0 })
    .select(selectMailFileds)
    .exec();
};

// 航空注册完成更新帐号信息
exports.updateMailBodyByMailName = function(mail, body) {
  if (body.mrNumber) {
    body = Object.assign({}, body, {
      status: 2,
      activeTime: Date.now()
    });
  } else if(body.baNumber) {
    body = Object.assign({}, body, {
      status: 1
    });
  }
  
  return Mail.findOneAndUpdate({ mail: mail },
    {
      // $set: {
      //   status: 1,
      //   baNumber: body.baNumber,
      //   activeTime: Date.now() }
      $set: body
    }, {
      new: true,
      overwrite: true,
      select: selectMailFileds
    })
    .exec()
};


/**
 *  getMails 根据更新时间排序，
 *  然后从第 skip 开始取 limit 个 mail
 *  @param { Number }  page 第几页
 *  @param { Number }  limit 每页的数量
 *  @param { Object }  查询条件，如 status
 *  @param { Function } 回调函数
 *  - err
 *  - commodities { Array }
 */
let getMails = exports.getMails = function getMails(page, per_page, query={}) {
  let skip = per_page * page;
  return Mail.find(query)
    .sort({
      activeTime: -1
    })
    .skip(skip)
    .limit(per_page)
    .select(selectMailFileds)
    .exec();
};


// // 酒店注册完 更新帐号信息
// exports.updateMailFiledByMailName = function(mail, filedObj) {
//   return Mail.findOneAndUpdate({ mail: mail },
//     {
//       $set: filedObj,
//     }, {
//       new: true,
//       select: selectMailFileds
//     })
//     .exec()
// };
