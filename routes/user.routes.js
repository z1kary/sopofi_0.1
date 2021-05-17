const router = require('express').Router()
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

router.post('/register', authController.signup)
router.post('/login', authController.signin)
router.get('/logout', authController.signout)

router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUserById)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)
router.get('/token/:token', userController.getUserByToken)
router.get('/channel/:username', userController.getUserChannel)
router.patch('/follow/:id', userController.follow)
router.patch('/unfollow/:id', userController.unfollow)
router.get('/ru', userController.getRu)

router.put('/togglesidebar/:token', userController.toggleSideBar)

module.exports = router