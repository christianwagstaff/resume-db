const jsonwebtoken = require("jsonwebtoken");

const PRIV_KEY = process.env.PRIV_KEY;

exports.issueJWT = (user) => {
  const _id = user._id;

  const payload = {
    sub: _id,
    iat: Math.floor(Date.now() / 1000),
  };
  // console.log(Date.now());
  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: "19h",
    algorithm: "RS256",
  });
  return {
    token: `Bearer ${signedToken}`,
  };
};
