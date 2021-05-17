const router = require('express').Router()
const themeController = require('../controllers/themeController')

router.put('/', themeController.getTheme)

module.exports = router