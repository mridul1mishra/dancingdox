const bcrypt = require('bcryptjs');
const pool = require('../sql');

// Login function
async function loginUser(email, password) {
  try {
    // 1. Get user by email
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE Email = ?',
      [email]
    );

    if (rows.length === 0) {
      return { success: false, message: 'User not found' };
    }

    const user = rows[0];
    // 2. Compare bcrypt hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return { success: false, message: 'Incorrect password' };
    }

    // 3. Auth success
    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.UserId,
        name: user.Name,
        email: user.Email
      }
    };
  } catch (err) {
    console.error('Login error:', err);
    return { success: false, message: 'Internal server error' };
  }
}

module.exports = { loginUser };
