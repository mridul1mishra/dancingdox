const pool = require('../sql');


async function insertUser({ userId, firstname, lastname, email, password, designation, organization }){
    try {
    const sql = `
  INSERT INTO dashdoxs.users (
    UserId, firstname, lastname, Email, Password, Designation, Organization, isSubscribed
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

const values = [  userId,  firstname ?? null,  lastname ?? null,  email ?? null,  password ?? null,  designation ?? null,  organization ?? null,  'false'];
const [result] = await pool.execute(sql, values);
return result;
  } catch (err) {
    console.error('Error inserting user:', err);
  }
}
module.exports = { insertUser };