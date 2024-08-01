const JWT = require("jsonwebtoken");
const secret = "superman@123";

// create token:- send server to browser in cookies when successful login by user.
function createTokenForUser(user) {
  const payload = {
    
    fullname: user.fullname,
    _id: user._id,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };
  const token = JWT.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = { createTokenForUser, validateToken };
