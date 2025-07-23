const pool = require('../utils/sql');
exports.getNotifications = async (req, res) => {
try {
    const userEmail = req.headers['x-user-email'] || req.query.userEmail;

    if (!userEmail) {
      return res.status(400).json({ message: 'User email is required' });
    }

    const sql = `
      SELECT id, userEmail, message, notificationType, isRead, createdAt
      FROM notifications
      WHERE userEmail = ?
      ORDER BY createdAt DESC
      LIMIT 50
    `;

    const [results] = await pool.execute(sql, [userEmail]);

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
