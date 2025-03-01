const { User } = require('../models');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/validator');

exports.register = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: 'user',
    });

    const token = generateToken(user);
    if (role === 'admin') {
      return res.status(201).json({ token, role });
    }
    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    if (user.role === 'admin') {
      return res.status(200).json({ token, role: user.role });
    }
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, email, address } = req.body;
  console.log(req.body);
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.name = name;
    user.email = email;
    user.address = address;
    await user.save();

    res.status(200).json({ message: 'Profile updated' });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
