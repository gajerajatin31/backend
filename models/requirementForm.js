const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
profile:{
  type:String,
},
  date: {
    type: Date,
    default: Date.now
  }
});

const Requirement = mongoose.model('Requirement', UserSchema);

module.exports = Requirement;
