const jwt = require('jsonwebtoken')
const UserModel = require('../models/userModel')
const RandomUserModel = require('../models/randomUserModel')

const maxAge = 7 * 24 * 60 * 60 * 1000;

const randomToken = () => {
  return Math.random().toString(36).substr(2);
}

const createNcToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN, {
    expiresIn: maxAge
  })
}

module.exports.fetchJwt = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, process.env.TOKEN, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null
        res.status(555).json({ $error: 'invalid_token' })
      } else {
        let user = await UserModel.findById(decodedToken.id).select('-password')
        res.locals.user = user
        next()
      }
    })
  } else {
    res.locals.user = null
    next()
  }
  
}

module.exports.fetchUlc = async (req, res, next) => {
  const ulcToken = req.cookies.ulc
  if (ulcToken) {
    jwt.verify(ulcToken, process.env.TOKEN, async (err, decodedToken) => {
      if (err) {
        res.locals.ulc = null
        res.status(557).json({ $error: 'invalid_ulc_token' })
      } else {
        let ulcUser = await RandomUserModel.findOne({ tokenId: decodedToken.id })
        res.locals.ulc = ulcUser
        next()
      }
    })
  } else {
    const tokenId = randomToken()
    const token = createNcToken(tokenId)
    const user = await RandomUserModel.create({ tokenId })
    res.cookie('ulc', token, { httpOnly: true, maxAge })
    res.status(200).json(user)
  }
}