const mongoose = require('mongoose')

const randomUserSchema = new mongoose.Schema(
  {
    sideBarIsOpen: {
      type: Boolean,
      default: true
    },
    tokenId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)


const RandomUserModel = mongoose.model('random_user', randomUserSchema)

module.exports = RandomUserModel