const db = require('../db/mysql');

class UserController {
  async getAllUsers(req, res) {
    try {
      const [rows] = await db.query('SELECT * FROM users');
      res.json(rows);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(rows[0]);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Error fetching user' });
    }
  }

  async createUser(req, res) {
    try {
      const { phone, password, full_name } = req.body;
      const [result] = await db.query(
        'INSERT INTO users (phone, password, full_name) VALUES (?, ?, ?)',
        [phone, password, full_name]
      );

      res.status(201).json({ message: 'User created', userId: result.insertId });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Error creating user' });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User deleted' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Error deleting user' });
    }
  }

}

module.exports = new UserController();
