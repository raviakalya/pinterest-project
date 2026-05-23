const Pin = require('../models/Pin');
const User = require('../models/User');

exports.createPin = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const imageUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const newPin = new Pin({
      title,
      description,
      category,
      imageUrl,
      user: req.user.id
    });

    const pin = await newPin.save();
    res.status(201).json(pin);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllPins = async (req, res) => {
  try {
    const { category, search, userType, currentUserId } = req.query;
    let query = {};

    // Filter by user context if provided
    if (userType === 'home' && currentUserId) {
      query.user = currentUserId;
    } else if (userType === 'explore' && currentUserId) {
      query.user = { $ne: currentUserId };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      // Check if search matches a category exactly (case insensitive)
      const categories = ['Art', 'Food', 'Travel', 'Fashion', 'Home Decor', 'Technology'];
      const matchedCategory = categories.find(c => c.toLowerCase() === search.toLowerCase());
      
      if (matchedCategory) {
        query.category = matchedCategory;
      } else {
        query.title = { $regex: search, $options: 'i' };
      }
    }

    const pins = await Pin.find(query)
      .populate('user', 'username profileImage')
      .sort({ createdAt: -1 });
    res.json(pins);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPinById = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id)
      .populate('user', 'username profileImage bio')
      .populate('comments.user', 'username profileImage');
      
    if (!pin) return res.status(404).json({ message: 'Pin not found' });
    res.json(pin);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.likePin = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id);
    if (!pin) return res.status(404).json({ message: 'Pin not found' });

    if (pin.likes.includes(req.user.id)) {
      pin.likes = pin.likes.filter(id => id.toString() !== req.user.id);
    } else {
      pin.likes.push(req.user.id);
    }

    await pin.save();
    res.json(pin.likes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.commentOnPin = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id);
    if (!pin) return res.status(404).json({ message: 'Pin not found' });

    const newComment = {
      user: req.user.id,
      text: req.body.text
    };

    pin.comments.unshift(newComment);
    await pin.save();
    
    const updatedPin = await Pin.findById(req.params.id).populate('comments.user', 'username profileImage');
    res.json(updatedPin.comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.savePin = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const pinId = req.params.id;

    if (user.savedPins.includes(pinId)) {
      user.savedPins = user.savedPins.filter(id => id.toString() !== pinId);
    } else {
      user.savedPins.push(pinId);
    }

    await user.save();
    res.json(user.savedPins);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
