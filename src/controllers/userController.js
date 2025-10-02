const User = require('../models/User');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -refreshTokens');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshTokens');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID format' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Prevent non-rootAdmins from creating admins
    if (role && ['rootAdmin', 'subAdmin'].includes(role) && req.user.role !== 'rootAdmin') {
      return res.status(403).json({ message: 'Only rootAdmin can assign admin roles' });
    }

    if( !name || !email || !password ) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = password ? await bcrypt.hash(password, SALT_ROUNDS) : undefined;

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isEmailConfirmed: true,
      role: role || 'user',
    });

    const userToReturn = newUser.toObject();
    delete userToReturn.password;
    delete userToReturn.refreshTokens;

    res.status(201).json(userToReturn);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Prevent role escalation
    if (updates.role && ['rootAdmin', 'subAdmin'].includes(updates.role) && req.user.role !== 'rootAdmin') {
      return res.status(403).json({ message: 'Only rootAdmin can assign admin roles' });
    }

    // Hash password if provided
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, SALT_ROUNDS);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password -refreshTokens');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshTokens');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCurrentUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    // Prevent role changes by user
    delete updates.role;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password -refreshTokens');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteCurrentUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Your account has been deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old password and new password are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllSubAdmins = async (req, res) => {
  try {
    const subAdmins = await User.find({ role: 'subAdmin' }).select('-password');
    res.json({ subAdmins });
  } catch (err) {
    console.error('Error fetching SubAdmins:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSubAdminById = async (req, res) => {
  try {
    const subAdmin = await User.findOne({ _id: req.params.id, role: 'subAdmin' }).select('-password');
    if (!subAdmin) return res.status(404).json({ message: 'SubAdmin not found' });
    res.json({ subAdmin });
  } catch (err) {
    console.error('Error fetching SubAdmin:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createSubAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const subAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'subAdmin',
      isEmailConfirmed: true // optional
    });

    res.status(201).json({ message: 'SubAdmin created', subAdmin });
  } catch (err) {
    console.error('Error creating SubAdmin:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSubAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const subAdmin = await User.findOne({ _id: req.params.id, role: 'subAdmin' });
    if (!subAdmin) return res.status(404).json({ message: 'SubAdmin not found' });

    if (name) subAdmin.name = name;
    if (email) subAdmin.email = email;
    if (password) subAdmin.password = await bcrypt.hash(password, SALT_ROUNDS);

    await subAdmin.save();

    res.json({ message: 'SubAdmin updated', subAdmin });
  } catch (err) {
    console.error('Error updating SubAdmin:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteSubAdmin = async (req, res) => {
  try {
    const subAdmin = await User.findOneAndDelete({ _id: req.params.id, role: 'subAdmin' });
    if (!subAdmin) return res.status(404).json({ message: 'SubAdmin not found' });

    res.json({ message: 'SubAdmin deleted' });
  } catch (err) {
    console.error('Error deleting SubAdmin:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllSubAdmins,
  getSubAdminById,
  createSubAdmin,
  updateSubAdmin,
  deleteSubAdmin,
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  changePassword
};
