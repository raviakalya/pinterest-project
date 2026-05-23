const User = require('../models/User');
const Pin = require('../models/Pin');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const pins = await Pin.find({ user: req.params.id }).sort({ createdAt: -1 });
    const savedPins = await Pin.find({ _id: { $in: user.savedPins } }).populate('user', 'username profileImage');

    res.json({
      user,
      pins,
      savedPins
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;
    let updateData = { username, bio };

    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
