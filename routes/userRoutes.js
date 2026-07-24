const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
//const auth = require("../middleware/auth"); // Import the auth middleware

// Define routes
router.get("/",  userController.getAllUsers);
router.get("/:email",   userController.getUserByEmail);
//router.post("/",   audit, userController.createUser);

module.exports = router;