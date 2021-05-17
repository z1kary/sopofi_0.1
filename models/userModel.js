const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    picture: {
      type: String,
      default: '/uploads/pp/random-user.png'
    },
    followers: {
      type: [String]
    },
    following: {
      type: [String]
    },
    susbscribers: {
      type: [String]
    },
    subscribing: {
      type: [String]
    }
  },
  {
    timestamps: true
  }
)

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username })
  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return await this.findById(user._id).select('-password')
    } else {
      return 'invalid_auth'
    }  
  } else {
    return 'invalid_user'
  }
}

const UserModel = mongoose.model('user', userSchema)

module.exports = UserModel