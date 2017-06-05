'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const MailSchema = new Schema({
  mail: { type: String },
  pass: { type: String },
  status: { type: Number, default: 0 }, // 0：未注册 1: 已注册
  activeTime: { type: Date, default: Date.now }, // 创建时间
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
