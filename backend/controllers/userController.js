// /src/controllers/userController.js
const bcrypt = require('bcrypt');
const User = require('../models/User');

/**
 * @route   GET /api/users/me
 * @desc    Get the current user's profile
 * @access  Private (Requires Authentication)
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * @route   PUT /api/users/me
 * @desc    Update the user's profile (name, phone, password)
 * @access  Private (Requires Authentication)
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    // Find the user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (phone) user.phone = phone;

    // If user wants to update password, hash it before saving
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    return res.status(200).json({ message: 'Profile updated successfully.', user });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
