const pool = require('../sql');
exports.insertNotification = (userEmail, message, type = 'info') => {
  const sql = `INSERT INTO notifications (userEmail, message, notificationType) VALUES (?, ?, ?)`;
  pool.query(sql, [userEmail, message, type], (err, results) => {
    if (err) {
      console.error('Insert notification error:', err);
    } else {
      console.log('Notification inserted with ID:', results.insertId);
    }
  });
};

