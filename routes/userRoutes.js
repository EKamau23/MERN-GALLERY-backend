const express = require('express');
const { getUserProfile } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/profile', verifyToken, getUserProfile);

module.exports = router;