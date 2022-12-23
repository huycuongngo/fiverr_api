const jwt = require('jsonwebtoken');
const sequelize = require('../model/modelConnectDb');
const initModel = require('../model/init-models')

const model = initModel(sequelize)

const encodeToken = (data) => {
  return jwt.sign({ data }, "KEY", { expiresIn: '10d' });
}

const checkToken = (token) => {
  const verifyToken = jwt.verify(token, "KEY")
  if (verifyToken) {
    return true
  } else {
    return false
  }
}

const decodeToken = (token) => {
  return jwt.decode(token)
}

const checkTokenInAPI = (req, res, next) => {
  try {
    let bearerToken = req.headers.authorization;
    let auth = bearerToken.replace("Bearer ", "");
    if (checkToken(auth))
      next()
  } catch (error) {
    res.status(500).send('Token khong hop le')
  }
}

module.exports = {
  encodeToken,
  checkToken,
  decodeToken,
  checkTokenInAPI,
}
