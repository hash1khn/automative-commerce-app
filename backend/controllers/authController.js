// /src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailHelper');

const SALT_ROUNDS = 10;
const EMAIL_EXPIRATION = '1h'; // e.g., 1 hour

/**
 * @route   POST /api/auth/signup
 * @desc    Sign up a new user and send verification email
 * @access  Public
 */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 3. Create the user (verified = false initially)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      verified: false,
    });

    // 4. Generate a token for email verification
    const emailVerificationToken = jwt.sign(
      { email: newUser.email },
      process.env.EMAIL_VERIFICATION_SECRET,
      { expiresIn: EMAIL_EXPIRATION }
    );

    // 5. Construct a verification link
    // For example, if your server runs on port 5000:
    // http://localhost:5000/api/auth/verify-email?token=XYZ
    // Or if you have a separate client, adjust accordingly
    const verificationLink = `${process.env.CLIENT_DOMAIN}/api/auth/verify-email?token=${emailVerificationToken}`;

    // 6. Send the email using Brevo SMTP
    await sendEmail({
      to: newUser.email,
      subject: 'Verify your email - Automotive Commerce Official',
      text: `Hello, ${newUser.name}!
Please verify your account by clicking the following link:
${verificationLink}
This link will expire in 1 hour.
`,
    });

    // 7. Respond to the client
    return res.status(200).json({
      message: 'Signup successful! Check your email to verify your account.',
      userId: newUser._id,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * @route   GET /api/auth/verify-email
 * @desc    Verify the user's email via token
 * @access  Public
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send('Verification token is missing or invalid.');
    }

    // 1. Verify the token
    const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
    const { email } = decoded;

    // 2. Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('User not found.');
    }

    // 3. Mark user as verified
    user.verified = true;
    await user.save();

    return res.status(200).send('Email successfully verified! You can now log in.');
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(400).send('Invalid or expired token.');
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Logs in a verified user and returns a JWT
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // 2. Check if user is verified
    if (!user.verified) {
      return res
        .status(400)
        .json({ message: 'Please verify your email before logging in.' });
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // 4. Create JWT for the user
    const authToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // or any desired duration
    );

    // 5. Send token back
    return res.status(200).json({ token: authToken });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
/**
 * @route   POST /api/auth/forgot-password
 * @desc    Generate a reset token and email it to the user
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
      }
  
      // 1. Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        // For security, you can still return a success message
        // to not reveal whether the email exists. But for clarity:
        return res.status(404).json({ message: 'User with that email not found.' });
      }
  
      // 2. Create a JWT reset token
      const resetToken = jwt.sign(
        { email: user.email },
        process.env.PASSWORD_RESET_SECRET,
        { expiresIn: RESET_TOKEN_EXPIRATION }
      );
  
      // 3. Construct reset link
      const resetLink = `${process.env.CLIENT_DOMAIN}/reset-password?token=${resetToken}`;
  
      // 4. Send reset email
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        text: `Hello, ${user.name}.
  You requested to reset your password. Click this link to set a new password:
  ${resetLink}
  If you did not request a reset, please ignore this email.
  (This link expires in 15 minutes.)
  `,
      });
  
      return res.status(200).json({
        message: 'Password reset link sent to your email (if it exists in our system).',
      });
    } catch (error) {
      console.error('Forgot Password Error:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };
  
  /**
   * @route   POST /api/auth/reset-password
   * @desc    Validate reset token and update the user password
   * @access  Public
   */
  exports.resetPassword = async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token and new password are required.' });
      }
  
      // 1. Verify the token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.PASSWORD_RESET_SECRET);
      } catch (err) {
        return res.status(400).json({ message: 'Invalid or expired reset token.' });
      }
  
      const { email } = decoded;
  
      // 2. Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // 3. Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
      user.password = hashedPassword;
  
      // 4. Save the user
      await user.save();
  
      return res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
      console.error('Reset Password Error:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };