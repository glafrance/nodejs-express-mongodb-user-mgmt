# nodejs-express-mongodb-user-mgmt
The backend infrastructure for typical user management operations:
- signup (registration) via email/password
- signin (login)
- forgot password (send user email with link to reset password)
- update profile page information (name, address, email, password, profile photo, etc)
- NodeJS, Express, MongoDB, Mongoose
- JWT delivered vis httpOnly, secure cookie
- https and mkcert ssl certificate

The goal of this repository is to provide an example of a user management backend. You clone this repository and drop its files into a frontend of your choice. An example can be found in [this repository](https://github.com/glafrance/angular-user-mgmt)
### The code in this repository is example code, and is not production ready. Use it at your own risk. Enhance this code and perform all necessary tests to ensure it is secure and bug free if you use it in your projects.

## This backend uses these technologies:
- [Node.js](https://nodejs.org)
- [express](https://expressjs.com)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [mongoose](https://mongoosejs.com)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [nodemailer](https://www.npmjs.com/package/nodemailer)
- and other technologies :-)

## Running the Backend
- clone this repository if you have not already done so
- open a shell window and CD to the repository directory
- execute "npm install" to install the required npm packages
- create a private/public key pair and place them in the root of where this repository is cloned (user_management_public.key, user_management.key)
- create a file "config.js" in the root of where this repository is cloned, with these properties:
  
module.exports = {
DB_NAME: "NAME_OF_MONGODB_DATABASE_YOUR_APP_SHOULD_USE",
SENDER_EMAIL_ADDRESS: "EMAIL_ADDRESS_TO_SEND_RESET_PASSWORD_EMAILS",
SENDER_APP_PASSWORD: "GMAIL_APP_PASSWORD_FOR_GOOGLE_ACCOUNT_TO_SEND_RESET_PASSWORD_EMAILS",
BCRYPT_SALT: 8
};
  
- create a public folder and within it an images folder so public/images folder exists in the root of where this repository is cloned
- execute "nodemon app" to start the server

## RESTful API Endpoints:
- POST /user/signup - signup a user with their email address and a password
- POST /user/signin - signin a user with their email address and password
- GET /user/profile/:userId - get user profile information, such as email, address, phone numbers, bio blurb, etc.
- POST /user/profile/:userId - set user profile information
- GET /user/profile-image/:userId - get user profile image user uploaded
- POST /user/profile-image/:userId - upload user profile image
- POST /user/request-reset-password - generate an email with password reset link, sent to provided user email address
- POST /user/response-reset-password - reset a user password
- POST /user/validate-reset-token - validate a user password reset token is valid

