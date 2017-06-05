'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
  email: { type: String },
  pass: { type: String  },
  location: { type: String  },
  createTime: { type: Date, default: Date.now }
});

// mails: []

UserSchema.index({email: 1}, {unique: true});


const User = mongoose.model('User', UserSchema);
module.exports = User;
