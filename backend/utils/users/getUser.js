const pool = require('../sql');

// Login function
async function getUser(email) {
    try {
        const [rows] = await pool.execute(
            'SELECT email, firstName, lastName, designation, organization, isSubscribed FROM users WHERE Email = ?',
            [email]
            );
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Return the full user object (first row)
        return rows.length > 0 ? rows[0] : null;

    }catch (err) {
    console.error('Error fetching user:', err);
    throw err; // let controller handle the response
  }


};
module.exports = { getUser };