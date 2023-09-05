# angular-user-mgmt
A simple Angular 15 application with UI, and backend infrastructure for typical user management operations:
- signup (registration) via email/password
- signin (login)
- forgot password (send user email with link to reset password)
- update profile page information (name, address, email, password, profile photo, etc)
- NodeJS, Express, MongoDB, Mongoose
- JWT delivered vis httpOnly, secure cookie
- https and mkcert ssl certificate

The goal of this repository is to provide an example of user management in a modern web application. 
### The code in this repository is example code, and is not production ready. Use it at your own risk. Enhance this code and perform all necessary tests to ensure it is secure and bug free if you use it in your projects.

## Frontend
The frontend uses these technologies:
- [Angular 15.2](https://angular.io)
- [Angular Material](https://material.angular.io)
- [ngx-toastr](https://www.npmjs.com/package/ngx-toastr)
- [SASS (for styling, supercharged CSS)](https://sass-lang.com)
- [TypeScript](https://www.typescriptlang.org)
- [rxjs BehaviorSubject, Observable](https://rxjs.dev/guide/overview)

The application includes these architectural features:
- [Angular routing](https://angular.io/guide/routing-overview)
- Guard (for routes requiring login)
- [Constants files](https://github.com/glafrance/angular-user-mgmt/blob/main/client/user-mgmt/src/app/constants/constants.ts)
- [Utility files](https://github.com/glafrance/angular-user-mgmt/tree/main/client/user-mgmt/src/app/utils)
- [Services (auth service, http service, local storage service, user service, etc.)](https://github.com/glafrance/angular-user-mgmt/tree/main/client/user-mgmt/src/app/services)
- [Components (common components, page components, page template components, sub-components, etc.)](https://github.com/glafrance/angular-user-mgmt/tree/main/client/user-mgmt/src/app/components)
- Responsive web design (media queries)

## Backend
The backend uses these technologies:
- [Node.js] (https://nodejs.org)
- [express] (https://expressjs.com)
- [jsonwebtoken] (https://www.npmjs.com/package/jsonwebtoken)
- [mongoose] (https://mongoosejs.com)
- [bcrypt] (https://www.npmjs.com/package/bcrypt)
- [nodemailer] (https://www.npmjs.com/package/nodemailer)
- and other technologies :-)

## Running the Angular Application
- clone this repository
- open a shell window and CD to the "client/user-mgmt" directory
- execute "npm install" to install the required npm packages
- follow [this blog post] (https://blog.bitsrc.io/using-https-for-local-development-for-react-angular-and-node-fdfaf69693cd) to create a localhost certificate and place them in the root of where this repository is cloned
- execute "npm start" to start the application ("ng serve --ssl true --ssl-key ../../localhost-key.pem --ssl-cert ../../localhost.pem")
- View the application via this browser url: https://localhost:4200 (you might need to do this in a Chrome incognito window)

You'll get errors if you try to use the Angular app as you have not yet started the backend.

## Running the Backend
- clone this repository if you have not already done so
- open another shell window and CD to the "server" directory
- execute "npm install" to install the required npm packages
- create a private/public key pair and place them in the root of where this repository is cloned (user_management_public.key, user_management.key)
- execute "nodemon app" to start the server

## Overview of the Application
### Here is the application home page:

<img width="987" alt="angular-user-mgmt-home" src="https://github.com/glafrance/angular-user-mgmt/assets/376137/ee547895-7a6a-4aee-b66d-2a16653f664d">

### Here is the signin popup:

<img width="512" alt="signup-signin" src="https://github.com/glafrance/angular-user-mgmt/assets/376137/6d2b2479-d2e3-40fb-883c-bb46da4a1a6c">

### You can toggle between signin/signup in that one popup:

<img width="509" alt="signup" src="https://github.com/glafrance/angular-user-mgmt/assets/376137/f8b53900-843c-41aa-a56a-25be627baa44">

#### If you click forgot password, you'll be prompted for your email address, and then you will receive an email auto-sent by the server with a link. When clicked the Angular app automatically launches and displays the reset password screen where you can enter a new password. The reset password link expires in one hour.

#### After logging in you will be directed to the user profile page, where you can enter additional, optional information, change your email, password, upload a profile photo:

<img width="562" alt="profile-page" src="https://github.com/glafrance/angular-user-mgmt/assets/376137/39394ef1-fea6-4845-bcde-dd33369df7fc">

#### If you reduce the browser width the profile page will display fields in a single column (responsive design with media queries)





