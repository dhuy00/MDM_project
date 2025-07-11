const authController = require("../controllers/authController");

const router = require("express").Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/check-auth", authController.checkAuth);
router.post('/login', authController.login)
router.post('/register', authController.register)


module.exports = router;
