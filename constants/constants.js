// Constants for strings that might appear in
// more than one place in code, to avoid typos
// that can result in hard to fix bugs. More
// important in a larger app, but here to 
// provide the base for a well-architected app.

// Route constants used by express router for API calls.
exports.PROFILE_IMAGE = "profile-image";
exports.PROFILE = "profile";
exports.SIGNIN = "signin";
exports.SIGNUP = "signup";
exports.USER = "user";
exports.REQUEST_RESET_PASSWORD = "request-reset-password";
exports.RESPONSE_RESET_PASSWORD = "response-reset-password";
exports.VALIDATE_RESET_TOKEN = "validate-reset-token";

// Success messages
exports.SIGNUP_SUCCESSFUL = "Signup succeeded!"

// Error messages
exports.INTERNAL_SERVER_ERROR = "Internal Server Error";
exports.USER_COULD_NOT_BE_CREATED_ERROR = "Signup failed, please try again.";
exports.USER_EXISTS_ERROR = "A user with the provided email already exists. Signin or click 'forgot password'.";
exports.SIGNIN_FAILURE = "Signin failed, please check your email and password and try again.";
exports.USER_PROFILE_COULD_NOT_BE_SAVED_ERROR = "Updating your profile failed, please try again.";
exports.USER_PROFILE_IMAGE_COULD_NOT_BE_UPLOADED_ERROR = "Uploading your profile image failed, please try again.";
exports.USER_PROFILE_IMAGE_COULD_NOT_BE_RETRIEVED_ERROR = "Profile image could not be retrieved.";
exports.USER_PROFILE_IMAGE_COULD_NOT_BE_FOUND = "Profile image could not be found.";
exports.USER_PROFILE_COULD_NOT_BE_FOUND = "user_profile_could_not_be_found";
exports.EMAIL_IS_REQUIRED = "Email is required.";
exports.TOKEN_IS_REQUIRED = "Token is required.";
exports.TOKEN_HAS_EXPIRED = "Token has expired.";
exports.RESET_PASSWORD_FAILED = "Reset password failed.";

// Response flags
exports.SUCCESS = "success";
exports.FAILURE = "failure";