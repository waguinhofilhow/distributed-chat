const jwt = require("jsonwebtoken");

const SECRET = "segredo123";

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

module.exports = verifyToken;
