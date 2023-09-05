// This file is the schema and model for a user.
// Only the email and password are required to create a user.
// The other properties are optional and are set if the
// user visits the user profile info page in the Angular app.

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password:  { type: String, required: true },
  firstName: String,
  lastName: String,
  address: String,
  address2: String,
  city: String,
  state: String,
  postalCode: String,
  homePhone: String,
  mobilePhone: String,
  workPhone: String,
  bioBlurb: String,
  profileImageUrl: String 
});

UserSchema.statics.EncryptPassword = async (password) => {  
  const hash = await bcrypt.hash(password, 12);  
  return hash;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
