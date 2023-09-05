// This file is the express route file for user routes.

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const constants = require("../constants/constants");
const multer = require("multer");
const utils = require("../utils/utils");

// multer is used to store profile image file users upload.
// They are stored in a directory public/images at the
// root of this server. The .gitignore for this server
// prevents these user images from being uploaded to the 
// git repository for this server.
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/');
  },
  filename: (req, file, cb) => {
    if (
      req && 
      req.params && 
      utils.isNotNullOrUndefined(req.params.userId)
    ) {    
      const _id = req.params.userId;

      var filetype = '';
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      cb(null, `${_id}.${filetype}`);  
    }  
  }
});

var upload = multer({storage: storage});

router.post(`/${constants.SIGNUP}`, userController.signupUser);
router.post(`/${constants.SIGNIN}`, userController.signinUser);

router.get(`/${constants.PROFILE}/:userId`, userController.getUserProfile);
router.post(`/${constants.PROFILE}/:userId`, userController.setUserProfile);

router.get(`/${constants.PROFILE_IMAGE}/:userId`, userController.getUserProfileImage);
router.post(`/${constants.PROFILE_IMAGE}/:userId`, upload.single("file"), userController.uploadUserProfileImage);

router.post(`/${constants.REQUEST_RESET_PASSWORD}`, userController.resetPassword);
router.post(`/${constants.RESPONSE_RESET_PASSWORD}`, userController.newPassword);
router.post(`/${constants.VALIDATE_RESET_TOKEN}`, userController.validatePasswordToken);

module.exports = router;