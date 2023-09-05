// This is the schema and model for password reset tokens.
// A token has the email address for the user that requested a password reset, 
// it has the resetToken itself, and it has a timestamp of when the token was created.
// The timestamp is an object with three properties, the timestamp of when
// the token was created, the default timestamp of now (current date/time),
// and the number of seconds after which the token expires.

const mongoose = require('mongoose');

const ResetTokenSchema = new mongoose.Schema({
  _userEmail: { type: String, required: true, ref: 'User' },
  resetToken: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 3600 },
});

module.exports = mongoose.model('PasswordResetToken', ResetTokenSchema);