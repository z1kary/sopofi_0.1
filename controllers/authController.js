const UserModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const { signupErrors, signinErrors } = require('../utils/errorsUtils')

const maxAge = 7 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN, {
    expiresIn: maxAge
  })
}

module.exports.signup = async (req, res) => {
  const { username, email, password } = req.body
  try {
    const user = await UserModel.create({ username, email, password })
    const userN = await UserModel.findById(user._id).select('-password')
    res.status(200).json(userN)
  } catch (err) {
    const errors = signupErrors(err)
    res.status(205).send({ errors })
  }
}

module.exports.signin = async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await UserModel.login(username, password)
    console.log(user._id);
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge })
    res.status(200).json(user)
  } catch (err) {
    const errors = signinErrors(err)
    res.status(200).send({ errors })
  }
}

module.exports.signout = async (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 })
  res.redirect('/')
}