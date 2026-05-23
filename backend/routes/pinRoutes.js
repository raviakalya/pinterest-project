const express = require('express');
const { createPin, getAllPins, getPinById, likePin, commentOnPin, savePin } = require('../controllers/pinController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/localUpload');
const router = express.Router();

router.post('/', auth, upload.single('image'), createPin);
router.get('/', getAllPins);
router.get('/:id', getPinById);
router.post('/:id/like', auth, likePin);
router.post('/:id/comment', auth, commentOnPin);
router.post('/:id/save', auth, savePin);

module.exports = router;
