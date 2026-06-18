const jwt = require('jsonwebtoken');

const generateToken = (admin) => {
  return jwt.sign(
    { 
      id: admin.id, 
      username: admin.username, 
      role: admin.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };