const authController = require("../controllers/authController")

const router = require("express").Router()

router.post('/login', authController.login)
router.get('/register', authController.register)

module.exports = router