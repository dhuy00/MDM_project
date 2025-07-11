const db = require('../db/mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../db/redisClient');

class AuthController {
  register = async (req, res) => {
    try {
      const { phone, password, full_name } = req.body;

      const [userExist] = await db.query('SELECT id FROM users WHERE phone = ?', [phone]);
      if (userExist.length > 0) {
        return res.status(400).json({ message: 'Phone number already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await db.query(
        'INSERT INTO users (phone, password, full_name, role, status) VALUES (?, ?, ?, ?, ?)',
        [phone, hashedPassword, full_name, 'user', 'active']
      );

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Registration failed' });
    }
  }

  login = async (req, res) => {
    try {
      const { phone, password } = req.body;

      const [users] = await db.query('SELECT * FROM users WHERE phone = ? AND status = "active"', [phone]);
      if (users.length === 0) {
        return res.status(400).json({ message: 'Invalid phone number or password' });
      }

      const user = users[0];

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid phone number or password' });
      }

      const token = jwt.sign(
        { userId: user.id, phone: user.phone, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      await redisClient.set(`session:${user.id}`, token, { EX: 7 * 24 * 60 * 60 });

      res.json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  }

  logout = async (req, res) => {
    try {
      const userId = req.user.userId;
      await redisClient.del(`session:${userId}`);
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Logout failed' });
    }
  };

}

module.exports = new AuthController();
