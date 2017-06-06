'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const MailSchema = new Schema({
  mail: { type: String },
  pass: { type: String },  // 字母和数字 >6
  status: { type: Number, default: 0 }, // 0：未注册 1: ba注册 2: mr注册
  activeTime: { type: Date }, // mr number 创建时间
  firstName: { type: String },
  lastName: { type: String },
  homeaddress1: { type: String }, // 6个账户一样
  homecity: { type: String },
  homecountryname: { type: String },
  baNumber: { type: String, default: '' },
  mrNumber: { type: String, default: '' }, // Marriott Rewards membership number
  user: { type: String }
}, { autoIndex: false });

MailSchema.index({ mail: 1 }, { unique: true })
MailSchema.index({ status: 1 })

const Mail = mongoose.model('Mail', MailSchema);

module.exports = Mail;
