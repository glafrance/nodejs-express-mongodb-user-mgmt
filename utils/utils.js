// This file is for utility methods that could be used 
// in multiple areas in the code.

const fs = require("fs");
const jsonwebtoken = require("jsonwebtoken");
const uuid = require("uuid");

// Check that a value is not null or undefined.
exports.isNotNullOrUndefined = (value) => {
  const result = (value !== null && value !== undefined);
  return result;
};

// Similar to above, but also check for empty strings and arrays.
exports.isNotNullOrUndefinedOrEmpty = (value) => {
  const result = (value !== null && value !== undefined && value !== "");

  if (result && Array.isArray(value)) {
    result = value.length;
  }

  return result;
};

// Create a JWT (JSON Web Token). You should create a private/public key pair
// named user_management.key (private key) and user_management_public.key (public key),
// and place those key files at the root of this server.
exports.createJWT = (userId) => {
  const RSA_PRIVATE_KEY = fs.readFileSync('../user_management.key');

  const jwtBearerToken = jsonwebtoken.sign({}, RSA_PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: 3600,
    subject: userId
  });

  // console.log(jwtBearerToken);

  return jwtBearerToken;
};

// Generate a unique UUID identifier.
exports.generateSessionId = () => {
  const generatedUuid = uuid.v4(); 

  return generatedUuid;
}