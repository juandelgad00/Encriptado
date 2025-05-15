// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { login, getAllUsers, registerUser } = require('../controllers/authcontroller');

router.post('/login', login);
router.get('/usuarios', getAllUsers);
router.post('/register', registerUser);
module.exports = router;