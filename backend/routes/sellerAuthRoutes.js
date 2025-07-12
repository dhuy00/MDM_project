const express = require("express");
const router = express.Router();
const {
  registerSeller,
  loginSeller,
  logoutSeller,
  checkSellerAuth,
} = require("../controllers/sellerAuthController");
const { authenticateSeller } = require("../middleware/sellerAuthMiddleware");

// Public routes
router.post("/register", registerSeller);
router.post("/login", loginSeller);

// Protected routes
router.post("/logout", authenticateSeller, logoutSeller);
router.get("/check-auth", authenticateSeller, checkSellerAuth);

module.exports = router;
