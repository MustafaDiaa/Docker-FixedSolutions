const crypto = require('crypto');
const bcrypt = require('bcrypt');
const transporter = require('../utils/sendEmail');
const { buildConfirmationEmail } = require('../utils/email/confirmationTemplate');
const { buildResetPasswordEmail } = require('../utils/email/resetPasswordTemplate');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_EXPIRES_IN = '1h';

const signup = async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth, city, address } = req.body;

    if (!name || !email || !password) return res.status(400).json({ message: 'Missing required fields' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const confirmationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const user = await User.create({
      name, email, password: hashed, phone, dateOfBirth, city, address,
      emailConfirmationToken: confirmationToken,
      emailConfirmationExpires: confirmationExpires,
      // role default is 'user'
    });

    const emailPayload = buildConfirmationEmail({ name: user.name, token: confirmationToken });

    await transporter.sendEmail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: emailPayload.subject,
      html: emailPayload.html
    });

    return res.status(201).json({ message: 'Account created. Please check your email to confirm.' });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const confirmEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'Token required' });

    const user = await User.findOne({ emailConfirmationToken: token }).select('+emailConfirmationToken +emailConfirmationExpires');
    if (!user) return res.status(400).json({ message: 'Invalid token' });

    if (user.emailConfirmationExpires < Date.now()) {
      return res.status(400).json({ message: 'Token expired' });
    }

    user.isEmailConfirmed = true;
    user.emailConfirmationToken = undefined;
    user.emailConfirmationExpires = undefined;
    await user.save();

    // Optionally redirect to front-end confirmation page:
    return res.status(200).json({ message: 'Email confirmed. You can now login.' });
  } catch (err) {
    console.error('Confirm email error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Ensure email confirmed (optional)
    if (!user.isEmailConfirmed) return res.status(403).json({ message: 'Please confirm your email first.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { id: user._id.toString(), role: user.role, email: user.email };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // persist refresh token on user
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    // set refreshToken as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // match REFRESH_TOKEN_EXPIRES_IN
    });

    return res.json({ accessToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) return res.status(401).json({ message: 'Refresh token required' });

    // verify signature
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (e) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'Invalid refresh token' });

    // check that token is persisted (not revoked)
    const stored = user.refreshTokens.find(r => r.token === token);
    if (!stored) return res.status(401).json({ message: 'Refresh token revoked' });

    // issue new tokens
    const newAccessToken = signAccessToken({ id: user._id.toString(), role: user.role, email: user.email });
    const newRefreshToken = signRefreshToken({ id: user._id.toString(), role: user.role, email: user.email });

    // replace old refresh token
    user.refreshTokens = user.refreshTokens.filter(r => r.token !== token);
    user.refreshTokens.push({ token: newRefreshToken });
    await user.save();

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error('Refresh token error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (token) {
      // remove token from user
      await User.updateOne({}, { $pull: { refreshTokens: { token } } });
    }

    res.clearCookie('refreshToken');
    return res.json({ message: 'Logged out' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate a short-lived JWT for password reset
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Save the token in user model (optional) if you want to verify later
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();

    // Build HTML email
    const { subject, html } = buildResetPasswordEmail({ name: user.name, token });

    // Send email
    await transporter.sendEmail({ to: user.email, subject, html });

    return res.json({ message: 'Password reset email sent successfully' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Find the user
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.json({ message: 'Password has been reset successfully' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getAllSubAdmins = async (req, res) => {
  try {
    const subAdmins = await User.find({ role: 'subAdmin' }).select('-password'); // hide password
    return res.json(subAdmins);
  } catch (err) {
    console.error('Error fetching subAdmins:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getSubAdminById = async (req, res) => {
  try {
    const subAdmin = await User.findOne({ _id: req.params.id, role: 'subAdmin' }).select('-password');
    if (!subAdmin) {
      return res.status(404).json({ message: 'SubAdmin not found' });
    }
    return res.json(subAdmin);
  } catch (err) {
    console.error('Error fetching subAdmin:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const createSubAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if email exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const subAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'subAdmin'
    });

    await subAdmin.save();
    return res.status(201).json({
      message: 'SubAdmin created successfully',
      subAdmin: {
        id: subAdmin._id,
        name: subAdmin.name,
        email: subAdmin.email,
        role: subAdmin.role
      }
    });
  } catch (err) {
    console.error('Error creating subAdmin:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateSubAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const subAdmin = await User.findOne({ _id: req.params.id, role: 'subAdmin' });
    if (!subAdmin) {
      return res.status(404).json({ message: 'SubAdmin not found' });
    }

    if (name) subAdmin.name = name;
    if (email) subAdmin.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      subAdmin.password = await bcrypt.hash(password, salt);
    }

    await subAdmin.save();

    return res.json({
      message: 'SubAdmin updated successfully',
      subAdmin: {
        id: subAdmin._id,
        name: subAdmin.name,
        email: subAdmin.email,
        role: subAdmin.role
      }
    });
  } catch (err) {
    console.error('Error updating subAdmin:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const deleteSubAdmin = async (req, res) => {
  try {
    const subAdmin = await User.findOneAndDelete({ _id: req.params.id, role: 'subAdmin' });
    if (!subAdmin) {
      return res.status(404).json({ message: 'SubAdmin not found' });
    }

    return res.json({ message: 'SubAdmin deleted successfully' });
  } catch (err) {
    console.error('Error deleting subAdmin:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  signup,
  confirmEmail,
  login,
  refreshToken,
  logout,
  requestPasswordReset,
  resetPassword,
  getAllSubAdmins,
  getSubAdminById,
  createSubAdmin,
  updateSubAdmin,
  deleteSubAdmin
};