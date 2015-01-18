//user account model
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


var userSchema = mongoose.Schema({
  username: {type: String, required: true, index: { unique: true }},
  password: {type: String, required: true}

});
userSchema.methods.validPassword =
function (password){
  passwordgiven = password;
  return function () {bcrypt.compare(passwordgiven,this.password, function (err,res) {
    if(res == true){ console.log('password  match');   return true;}
    if(res == false) {console.log('password didnt match');   return false;}
  });}

}


var User = mongoose.model('toyUser', userSchema);

module.exports = User;
