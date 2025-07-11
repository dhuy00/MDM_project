const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.get('/', (req, res) => UserController.getAllUsers(req, res));
router.get('/:id', (req, res) => UserController.getUserById(req, res));
router.post('/', (req, res) => UserController.createUser(req, res));
router.delete('/:id', (req, res) => UserController.deleteUser(req, res));

module.exports = router;
