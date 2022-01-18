const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const pathToKey = path.join(__dirname, "..", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");

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
