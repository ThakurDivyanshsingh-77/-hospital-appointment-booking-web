const jwt = require("jsonwebtoken");

const getJwtConfig = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return {
    secret,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  };
};

const signAuthToken = (user) => {
  const { secret, expiresIn } = getJwtConfig();
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    secret,
    { expiresIn }
  );
};

const verifyAuthToken = (token) => {
  const { secret } = getJwtConfig();
  return jwt.verify(token, secret);
};

module.exports = {
  signAuthToken,
  verifyAuthToken,
};
