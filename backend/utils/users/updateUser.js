const pool = require('../sql');


async function updateUser({ firstName, lastName, email, designation, organization }){
try {
    const sql = `
  UPDATE dashdoxs.users
SET  firstname = ?,  lastname = ?,  Designation = ?,  Organization = ? WHERE Email = ?;`;

const values = [
  firstName,
  lastName,
  designation,
  organization,
  email // must match an existing user
];
const [result] = await pool.execute(sql, values);
return result;
  } catch (err) {
    console.error('Error inserting user:', err);
  }
};

module.exports = { updateUser };