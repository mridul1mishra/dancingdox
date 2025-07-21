const bcrypt = require('bcryptjs');
const pool = require('../sql');

async function updatePass(payload){
try {
  console.log('updateUser'); 
  const {email, password, existingPass} = payload;

  const [rows] = await pool.execute(
  'SELECT password FROM dashdoxs.users WHERE email = ?',
  [email]
); 
  
if (rows.length === 0) {
  return { status: 404, message: 'User not found' };
}

const hashedPassword = rows[0].password;
const isMatch = await bcrypt.compare(existingPass, hashedPassword);
if (!isMatch) {
  return { status: 400,  message: 'Incorrect existing password' };
}
const newHashedPassword = await bcrypt.hash(password, 10);

await pool.execute(
  'UPDATE users SET password = ? WHERE email = ?',
  [newHashedPassword, email]
);

return { status: 200, message: 'Password updated successfully' };
}catch (err) {
    console.error('Login error:', err);
    return { status: 500, message: 'Internal Server Error' };
  }
};

module.exports = { updatePass };