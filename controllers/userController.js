const UserModel = require('../models/userModel')
const RandomUserModel = require('../models/randomUserModel')
const ObjectID = require('mongoose').Types.ObjectId

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select('-password')
  res.status(200).json(users)
}

module.exports.getRu = async (req, res) => {
  try {
    const users = await UserModel.find().select('-password')
    res.status(200).json(users)
  } catch(err) {
    res.status(999).json(err)
  }
}

module.exports.getUserById = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send('Invalid id : ' + req.params.id)
  } else {
    UserModel.findById(req.params.id, function (err, docs) {
      if (!err) res.send(docs);
      else console.log('User not found : ' + req.params.id)
    }).select('-password')
  }
}

module.exports.updateUser = async (req, res) => {

}

module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('Unknown id : ' + req.params.id)

  try {
    await UserModel.remove({ _id: req.params.id }).exec()
    res.status(200).json({ message: "Succesfully deleted" })
  } catch (err) {
    return res.status(500).json({ message: err })
  }
}

module.exports.getUserByToken = async (req, res) => {
  try {
    RandomUserModel.findOne({ tokenId: req.params.token }, function (err, docs) {
      if (!err) res.send(docs)
      else console.log('Unknown token : ' + req.params.token);
    })
  } catch (err) {
    console.log(err);
  }
}

module.exports.getUserChannel = async (req, res) => {
  try {
    UserModel.findOne({ username: req.params.username }, function (err, docs) {
      if (!err) res.send(docs)
      else console.log('Unknown username : ' + req.params.username)
    }).select("-password")
  } catch (err) {
    console.log(err)
  }
}

module.exports.follow = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(401).send('Unknown user id : ' + req.params.id)
  } else if (!ObjectID.isValid(req.body.idToFollow)) {
    return res.status(402).send('Unknown to follow user id : ' + req.body.idToFollow)
  }
  
  try {

    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow }},
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(202)
        if (err) return res.status(531).json(err)
      }
    ) 

    await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id }},
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(203).json(docs)
        else return res.status(532).json(err)
      }
    )

  } catch (err) {
    return res.status(530).json({ message: err })
  }
}

module.exports.unfollow = async (req, res) => {
  if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow))
    return res.status(400).send('Unknown id : ' + req.params.id + " / " + req.body.idToUnfollow)
  
  try {

    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow }},
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201)
        if (err) return res.status(541).json(err)
      }
    )

    await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { followers: req.params.id }},
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs)
        if (err) return res.status(542).json(err)
      }
    )

  } catch (err) {
    return res.status(540).json(err)
  }
}

module.exports.toggleSideBar = async (req, res) => {
  try {
    await RandomUserModel.findOne({ tokenId: req.params.token }, function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        docs.sideBarIsOpen = !docs.sideBarIsOpen
        docs.save(function (err, updatedDocs) {
          if (!err) res.send(updatedDocs)
          else return res.status(551).json(err)
        })
      }
    })
  } catch (err) {
    return res.status(550).json(err)
  }
}