const express = require('express');
const { getUserProfile, updateProfile } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');
const router = express.Router();

router.get('/:id', getUserProfile);
router.put('/profile', auth, upload.single('profileImage'), updateProfile);

module.exports = router;
