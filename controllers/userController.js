// Currently the one controller for the backend. 
// Router file referencees the methods in this
// file for the various API calls.

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const config = require("../config");
const constants = require("../constants/constants");
const PasswordResetToken = require("../models/password-reset-token");
const User = require("../models/user");
const utils = require("../utils/utils");

// Signup the user, with the supplied email and password.
exports.signupUser = (req, res) => {
  if (
    utils.isNotNullOrUndefined(req) &&
    utils.isNotNullOrUndefined(req.body) &&
    utils.isNotNullOrUndefined(req.body.email) &&
    utils.isNotNullOrUndefined(req.body.password)
  ) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
      .then((user) => {
        if (user) {
          // Can't signup the user as a user was found with the
          // supplied email address.
          return res.status(401).json({ 
            result: constants.FAILURE,
            error: constants.USER_EXISTS_ERROR 
          });
        } else {
          // Encrypt the supplied password as we never want
          // to store plain-text passwords in the database.

          // The config file is not in the repository for this code,
          // you need to create it at the root of this server code.
          // You need to add a property BCRYPT_SALT, can be a number,
          // such as perhaps 18, it increases the security of the token.

          //     server/config.js

          // Here is the structure of the config file:
          /*
              module.exports = {
                SENDER_EMAIL_ADDRESS: "GMAIL_EMAIL_ADDRESS_OF_RESET_PASSWORD_EMAIL_SENDER",
                SENDER_APP_PASSWORD: "GOOGLE_ACCOUNT_APP_PASSWORD_OF_RESET_PASSWORD_EMAIL_SENDER",
                BCRYPT_SALT: NUMBER SUCH AS 18 TO MAKE ENCRYPTING MORE SECURE
              };
          */          
          return bcrypt.hash(password, config.BCRYPT_SALT, (err, hash) => {
            if (err) {
              return res.status(401).json({ message: 'Error hashing password' });
            }
            const body = {
              email,
              password: hash
            };

            // Create the new user signing up using the supplied 
            // email address and the encrypted password, saving it
            // in the database.
            User.create(body)
              .then(user => {
                res.status(200).json({ result: constants.SUCCESS });
              })
              .catch((err) => {
                console.log("Error signing up user - one", err);
                res.status(401).json({ 
                  result: constants.FAILURE,
                  error: `${constants.INTERNAL_SERVER_ERROR}: ${constants.USER_COULD_NOT_BE_CREATED_ERROR}` 
                });
              });
          });
        }
      })
      .catch((err) => {
        console.log("Error signing up user - two", err);
        res.status(500).json({ 
          result: constants.FAILURE,
          error: `${constants.INTERNAL_SERVER_ERROR}: ${constants.USER_COULD_NOT_BE_CREATED_ERROR}` 
        });
      });
  } else {
    console.log("Error signing up user - three");
    res.status(500).json({ 
      result: constants.FAILURE,
      error: `${constants.INTERNAL_SERVER_ERROR}: ${constants.USER_COULD_NOT_BE_CREATED_ERROR}` 
    });
  }
};

// Signin the user with the supplied email address and password.
exports.signinUser = (req, res) => {
  if (
    utils.isNotNullOrUndefined(req) &&
    utils.isNotNullOrUndefined(req.body) &&
    utils.isNotNullOrUndefined(req.body.email) &&
    utils.isNotNullOrUndefined(req.body.password)
  ) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
      .then((user) => {
        if (user) {
          // If we found the user email address in the database,
          // then we need to encrypt the password supplied to
          // this function and compare it with the encrypted 
          // password we stored in the database when the user 
          // signed up.
          const hashStoredInDB = user.password;

          // bcrypt.compare encrypts the supplied password and compares it
          // with the encrypted password we stored in the database on signup.
          bcrypt.compare(password, hashStoredInDB).then((checkPasswordResult) => {
            if (checkPasswordResult) {
              // Passwords matched so create a JWT (JSON Web Token) and send it back
              // to the Angular application in a secure cookie. After the user's 
              // brower receives this cookie, it will be automatically sent to the
              // server on every subsequent API call. Because we use the secure
              // and httpOnly flags, the cookie (and thus the JWT) cannot be accessed
              // by frontend JavaScript code, which makes this authorization token more secure.
              const jwt = utils.createJWT(user._id.toString());
              const sessionId = utils.generateSessionId();

              res.cookie(sessionId, jwt, { httpOnly: true, secure: true });

              return res.status(200).json({ 
                userId: user._id,
                result: constants.SUCCESS
              });    
            } else {
              console.log("Error signing in user - one");
              return res.status(401).json({ 
                result: constants.FAILURE,
                error: constants.SIGNIN_FAILURE 
              });
            }
          });
        } else {
          console.log("Error signing in user - two");
          return res.status(401).json({ 
            result: constants.FAILURE,
            error: constants.SIGNIN_FAILURE 
          });
        }
      })
      .catch((err) => {
        console.log("Error signing in user - three", err);
        res.status(401).json({ 
          result: constants.FAILURE,
          error: constants.SIGNIN_FAILURE 
        });
      });
  } else {
    console.log("Error signing in user - four");
    return res.status(401).json({ 
      result: constants.FAILURE,
      error: constants.SIGNIN_FAILURE 
    });
  }
};

// Get the user profile info using the supplied user id.
// The user id was provided by the backend API call 
// signing in the user, so the frontend can send it back
// when it tries to get the user profile info.
exports.getUserProfile = (req, res) => {
  if (
    req && 
    req.params && 
    utils.isNotNullOrUndefined(req.params.userId)
  ) {    
    const _id = req.params.userId;

    User.findOne({ _id: new mongoose.Types.ObjectId(_id) })
      .then((user) => {
        if (user) {
          // A user with the supplied user id was found, so return
          // the user profile info, after stripping out the 
          // password, __v, and _id fields.
          let userData = {...user._doc};
          delete userData.password;
          delete userData.__v;
          delete userData._id;

          return res.status(200).json({ 
            result: constants.SUCCESS,
            data: userData
          });
        } else {
          console.log("Error getting user profile - one");
          return res.status(401).json({ 
            result: constants.FAILURE,
            error: constants.USER_PROFILE_COULD_NOT_BE_FOUND 
          });
        }
      })
      .catch((err) => {
        console.log("Error getting user profile - two", err);
        res.status(401).json({ 
          result: constants.FAILURE,
          error: `${constants.INTERNAL_SERVER_ERROR}: ${constants.USER_PROFILE_COULD_NOT_BE_FOUND}` 
        });
      });
  } else {
    console.log("Error getting user profile - three");
    return res.status(401).json({ 
      result: constants.FAILURE,
      error: constants.USER_PROFILE_COULD_NOT_BE_FOUND 
    });
  }
};

// Save user profile info changes, because user when to the Angular
// application profile page, made changes and submitted changes
// to this backend API.
exports.setUserProfile = async (req, res) => {
  if (
    req && 
    req.params && 
    utils.isNotNullOrUndefined(req.params.userId) &&
    req.body &&
    req.body.data
  ) {    
    const _id = req.params.userId;
    const data = req.body.data;

    // Because we update the user profile data with replaceOne(),
    // we need to get the user profile image url and add that to
    // the data passed to replaceOne().
    await User.findOne({ _id: new mongoose.Types.ObjectId(_id) })
      .then((user) => {
        if (user) {
          let userData = {...user._doc};

          // We don't send the users password to the UI with the profile data 
          // so in order to not wipe out their password we need to set it
          // in the data for the profile update.
          data.password = userData.password;

          if (userData && userData.profileImageUrl) {
            data.profileImageUrl = userData.profileImageUrl;
          }

        }
      })

    // Find the user with the supplied user id and update
    // that user's profile info.
    const updatedDoc = await User.replaceOne(
      { _id: new mongoose.Types.ObjectId(_id) }, 
      data, 
      {
        new: true
      }
    );

    // We find the user whose profile info was just changed
    // and return the updated data to the Angualar application,
    // after stripping out the password, __v, and _id fields.
    User.findOne({ _id: new mongoose.Types.ObjectId(_id) })
      .then((user) => {
        if (user) {
          let userData = {...user._doc};
          delete userData.password;
          delete userData.__v;
          delete userData._id;

          return res.status(200).json({ 
            result: constants.SUCCESS,
            data: userData
          });
        } else {
          console.log("Error setting user profile - one");
          return res.status(401).json({ 
            result: constants.FAILURE,
            error: constants.USER_PROFILE_COULD_NOT_BE_SAVED_ERROR 
          });
        }
      })
      .catch((err) => {
        console.log("Error setting user profile - two", err);
        res.status(401).json({ 
          result: constants.FAILURE,
          error: `${constants.INTERNAL_SERVER_ERROR}: ${constants.USER_PROFILE_COULD_NOT_BE_SAVED_ERROR}` 
        });
      });
  } else {
    console.log("Error setting user profile - three");
    return res.status(401).json({ 
      result: constants.FAILURE,
      error: constants.USER_PROFILE_COULD_NOT_BE_SAVED_ERROR 
    });
  }
};

// Get the user profile image.
exports.getUserProfileImage = (req, res) => {
  if (
    req && 
    req.params && 
    utils.isNotNullOrUndefined(req.params.userId)
  ) {    
    const _id = req.params.userId;

    User.findOne({ _id: new mongoose.Types.ObjectId(_id) })
      .then((user) => {
        if (user) {
          // If we found a user with the supplied user id then
          // we return the profile image url for the user. 
          // Note the url will be the profile image url 
          // for where the image is stored on this server.
          // TODO it might be possible for someone to get all
          // users' profile images, so might need some rework.
          let userData = {...user._doc};

          if (userData && utils.isNotNullOrUndefined(userData.profileImageUrl)) {
            return res.status(200).json({ 
              result: constants.SUCCESS,
              data: userData.profileImageUrl
            });  
          } else {
            console.log("User profile image not found - one");
            return res.status(200).json({ 
              result: constants.SUCCESS,
              message: constants.USER_PROFILE_IMAGE_COULD_NOT_BE_FOUND 
            });  
          }
        } else {
          console.log("Error getting user profile image - two");
          return res.status(401).json({ 
            result: constants.FAILURE,
            error: constants.USER_PROFILE_IMAGE_COULD_NOT_BE_RETRIEVED_ERROR 
          });
        }
      })
      .catch((err) => {
        console.log("Error getting user profile image - three", err);
        res.status(401).json({ 
          result: constants.FAILURE,
          error: `${constants.INTERNAL_SERVER_ERROR}: ${constants.USER_PROFILE_IMAGE_COULD_NOT_BE_RETRIEVED_ERROR}` 
        });
      });
  } else {
    console.log("Error getting user profile image - four");
    return res.status(401).json({ 
      result: constants.FAILURE,
      error: constants.USER_PROFILE_IMAGE_COULD_NOT_BE_RETRIEVED_ERROR 
    });
  }
};

// Upload a user's profile image to the server.
exports.uploadUserProfileImage = async (req, res) => {
  if (
    req && 
    req.params && 
    utils.isNotNullOrUndefined(req.params.userId)
  ) {    
    const _id = req.params.userId;

    if(!req.file) {
      console.log("Error uploading user profile image - one");
      return res.status(401).json({ 
        result: constants.FAILURE,
        error: constants.USER_PROFILE_COULD_NOT_BE_UPLOADED_ERROR 
      });
    } else {
      // Here is the profile image for the user's profile image.
      // Note that the filename might not be unique, for example 
      // two users might upload a file named "mypic.jpg", so it
      // might happen that one user's profile image gets wiped out.
      // So this is a TODO to investigate.
      const userProfileImageUrl = `https://localhost:4002/images/${req.file.filename}`;

      await User.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(_id) }, 
        {
          profileImageUrl: userProfileImageUrl
        }, 
        {
          new: true
        }
      );
  
      User.findOne({ _id: new mongoose.Types.ObjectId(_id) })
        .then((user) => {
          if (user) {
            let userData = {...user._doc};

            // We verify the uploaded profile image url is now 
            // in the user data, to determine the upload was a success.
            if (userData.profileImageUrl === userProfileImageUrl) {
              return res.status(200).json({ 
                result: constants.SUCCESS,
                userProfileImageUrl
              });        
            } else {
              console.log("Error uploading user profile image - two");
              return res.status(401).json({ 
                result: constants.FAILURE,
                error: constants.USER_PROFILE_IMAGE_COULD_NOT_BE_UPLOADED_ERROR 
              });              
            }
          } else {
            console.log("Error uploading user profile image - three");
            return res.status(401).json({ 
              result: constants.FAILURE,
              error: constants.USER_PROFILE_IMAGE_COULD_NOT_BE_UPLOADED_ERROR 
            });
          }
        })
        .catch((err) => {
          console.log("Error uploading user profile image - four", err);
          res.status(401).json({ 
            result: constants.FAILURE,
            error: `${constants.INTERNAL_SERVER_ERROR}: ${constants.USER_PROFILE_IMAGE_COULD_NOT_BE_UPLOADED_ERROR}` 
          });
        });;
    }    
  } else {
    console.log("Error uploading user profile image - five");
    return res.status(401).json({ 
      result: constants.FAILURE,
      error: constants.USER_PROFILE_IMAGE_COULD_NOT_BE_UPLOADED_ERROR 
    });
  }
};

// API call user makes to request an email be sent to
// their email address, and that email will contain a
// link that when clicked opens the Angular app on
// the reset password page.
exports.resetPassword = async (req, res) => {
  if (
    req && 
    req.body &&
    utils.isNotNullOrUndefined(req.body.email)
  ) {    
    const email = req.body.email;
    const user = await User.findOne({ email })

    if (!user) {
      console.log("Error creating reset password email and link - one");
      return res.status(401).json({ 
        result: constants.FAILURE,
        error: constants.RESET_PASSWORD_FAILED 
      });
    }

    // If we foung a user with the supplied email address,
    // then delete all password reset tokens that might already
    // exist for this user. This ensures that there will only
    // be a single password reset token for the user.
    PasswordResetToken.deleteMany({ _userEmail: user.email})
      .then(() => {
        // Create a new password reset token for the user.

        // The config file is not in the repository for this code,
        // you need to create it at the root of this server code.
        // You need to add a property BCRYPT_SALT, can be a number,
        // such as perhaps 18, it increases the security of the token.

        // Here is the structure of the config file:
        /*
            module.exports = {
              SENDER_EMAIL_ADDRESS: "GMAIL_EMAIL_ADDRESS_OF_RESET_PASSWORD_EMAIL_SENDER",
              SENDER_APP_PASSWORD: "GOOGLE_ACCOUNT_APP_PASSWORD_OF_RESET_PASSWORD_EMAIL_SENDER",
              BCRYPT_SALT: NUMBER SUCH AS 18 TO MAKE ENCRYPTING MORE SECURE
            };
        */        
        let tokenBytes = crypto.randomBytes(16).toString('hex');

        return bcrypt.hash(tokenBytes, config.BCRYPT_SALT, (err, hashedResetToken) => {
          if (err) {
            console.log("Error hashing password", err);
            return res.status(401).json({ message: 'Error hashing password' });
          }

          PasswordResetToken.create({ _userEmail: user.email, resetToken: hashedResetToken})
            .then(resetToken => {          
              if (resetToken) {
                res.status(200).json({ 
                  result: constants.SUCCESS
                });  
        
                // user here is the email address that will send the reset password email with link
                // if gmail, pass should be the app password setup in the google account.
                // Note that the sender email and gmail app password should be in the config file
                // that is not in this repository. You should NEVER upload that config file to 
                // a git repository.
                //     server/config.js
                //
                // Here is the structure of the config file:
                /*
                    module.exports = {
                      SENDER_EMAIL_ADDRESS: "GMAIL_EMAIL_ADDRESS_OF_RESET_PASSWORD_EMAIL_SENDER",
                      SENDER_APP_PASSWORD: "GOOGLE_ACCOUNT_APP_PASSWORD_OF_RESET_PASSWORD_EMAIL_SENDER",
                      BCRYPT_SALT: NUMBER SUCH AS 18 TO MAKE ENCRYPTING MORE SECURE
                    };
                */          
                // If the sender of the reset password email is not Gmail then code changes 
                // will be necessary here.
                const transporter = nodemailer.createTransport({
                  service: 'Gmail',
                  port: 465,
                  auth: {
                    user: config.SENDER_EMAIL_ADDRESS,
                    pass: config.SENDER_APP_PASSWORD
                  }
                });
        
        
                // "from" here is the email address that will send the reset password email with link
                const mailOptions = {
                  to: user.email,
                  from: config.SENDER_EMAIL_ADDRESS,
                  subject: 'User Manager Password Reset',
                  text: 'You are receiving this because you have requested the reset of the password for your account.\n\n' +
                  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                  `https://localhost:4200/response-reset-password/${resetToken.resetToken}` + 
                  '\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n'
                }
        
                transporter.sendMail(mailOptions, (err, info) => {
                  if (err) {
                    console.log("sendMail err", err);
                  }
                  if (info) {
                    // console.log("sendMail info", info);
                  }
                });
              } else {
                console.log("resetToken null or undefined", result);
              }
            })
            .catch((err) => {
              console.log("Error creating reset password email and link - two", err);
              return res.status(401).json({ 
                result: constants.FAILURE,
                error: err.message 
              });
            });
        });
      })
      .catch((err) => {
        console.log("Error creating reset password email and link - three", err);
        return res.status(401).json({ 
          result: constants.FAILURE,
          error: constants.RESET_PASSWORD_FAILED 
        });  
      });
  } else {
    console.log("Error creating reset password email and link - three");
    return res.status(401).json({ 
      result: constants.FAILURE,
      error: constants.EMAIL_IS_REQUIRED 
    });
  }
};

// Angular app calls this function to validate the reset password token.
exports.validatePasswordToken = async (req, res) => {
  if (
    utils.isNotNullOrUndefined(req) &&
    utils.isNotNullOrUndefined(req.body) &&
    utils.isNotNullOrUndefined(req.body.resetToken)
  ) {
      const token = await PasswordResetToken.findOne({
        resetToken: req.body.resetToken
      });

      if (!token) {
        console.log("Error validating reset password token - one");
        return res.status(401).json({ 
          result: constants.FAILURE,
          error: constants.RESET_PASSWORD_FAILED 
        });
      }

      // If the supplied token was found for the user then return success.
      User.findOne({ _id: token._userId })
        .then(() => {
          return res.status(200).json({ 
            result: constants.SUCCESS
          });        
        }).catch((err) => {
          console.log("Error validating reset password token - two", err);
          return res.status(401).json({ 
            result: constants.FAILURE,
            error: constants.RESET_PASSWORD_FAILED 
          });
        });
  } else {
    console.log("Error validating reset password token - three");
    return res.status(401).json({ 
      result: constants.FAILURE,
      error: constants.TOKEN_IS_REQUIRED 
    });
  }
};

// Change the user's password using the supplied new
// password and the reset token supplied.
exports.newPassword = async (req, res) => {
  if (
    utils.isNotNullOrUndefined(req) &&
    utils.isNotNullOrUndefined(req.body) &&
    utils.isNotNullOrUndefined(req.body.resetToken) &&
    utils.isNotNullOrUndefined(req.body.newPassword)
  ) {
    const resetToken = req.body.resetToken;
    const newPassword = req.body.newPassword;

    PasswordResetToken.findOne({ 
      resetToken 
    }).then((userToken) => {
      if (userToken) {
        User.findOne({
          email: userToken._userEmail
        }).then((user) => {
          if (user) {
            // If the reset password token was found, and a user was
            // found for the email associated with that token, then
            // encrypt and save the new password.

            // The config file is not in the repository for this code,
            // you need to create it at the root of this server code.
            // You need to add a property BCRYPT_SALT, can be a number,
            // such as perhaps 18, it increases the security of the token.

            //     server/config.js

            // Here is the structure of the config file:
            /*
                module.exports = {
                  SENDER_EMAIL_ADDRESS: "GMAIL_EMAIL_ADDRESS_OF_RESET_PASSWORD_EMAIL_SENDER",
                  SENDER_APP_PASSWORD: "GOOGLE_ACCOUNT_APP_PASSWORD_OF_RESET_PASSWORD_EMAIL_SENDER",
                  BCRYPT_SALT: NUMBER SUCH AS 18 TO MAKE ENCRYPTING MORE SECURE
                };
            */
            return bcrypt.hash(newPassword, config.BCRYPT_SALT, (err, hash) => {
              if (err) {
                console.log("Error resetting password - one", err);
                return res.status(401).json({ 
                  result: constants.FAILURE,
                  error: constants.RESET_PASSWORD_FAILED 
                });    
              }
              user.password = hash;
              user.save().then((docs) => {
                // Delete the just used password reset token.
                PasswordResetToken.deleteOne({_userEmail: userToken._userEmail})
                  .then((docs) => {
                    console.log("token deleted", docs);
                  })
                  .catch((err) => {
                    console.log("error deleting token", err);
                  });
  
                return res.status(200).json({ 
                  result: constants.SUCCESS
                });        
              })
              .catch((err) => {
                console.log("Error resetting password - two", err);
                return res.status(401).json({ 
                  result: constants.FAILURE,
                  error: constants.RESET_PASSWORD_FAILED 
                });      
              });
            });              
          } else {
            return res.status(401).json({ 
              result: constants.FAILURE,
              error: constants.RESET_PASSWORD_FAILED 
            });    
          }
        })
        .catch((err) => {
          console.log("Error resetting password - three", err);
          return res.status(401).json({ 
            result: constants.FAILURE,
            error: constants.RESET_PASSWORD_FAILED 
          });  
        });
      } else {
        console.log("Error resetting password - four");
        return res.status(401).json({ 
          result: constants.FAILURE,
          error: constants.RESET_PASSWORD_FAILED 
        });  
      }   
      })
      .catch((err) => {
        console.log("Error resetting password - five", err);
        return res.status(401).json({ 
          result: constants.FAILURE,
          error: constants.RESET_PASSWORD_FAILED 
        });      
      });
  }
};
