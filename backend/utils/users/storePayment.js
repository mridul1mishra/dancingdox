const pool = require('../sql');

async function storePayment({paymentMethodId, brand, last4, expMonth, expYear, billingName, subscription, email }){
    try {
    const sql = `
  UPDATE dashdoxs.users
SET  paymentMethodId = ?,  brand = ?,  last4 = ?,  expMonth = ?,  expYear = ?, billingName = ?, isSubscribed = ?, subscriptiontype = ? WHERE Email = ?;`;

const values = [  paymentMethodId ?? null,  brand ?? null,  last4 ?? null,  expMonth ?? null,  expYear ?? null,  billingName ?? null,  'true', subscriptiontype, email ?? null];
const [result] = await pool.execute(sql, values);
return result.length > 0 ? result[0] : null;
  } catch (err) {
    return { status: 500, message: 'data not updated successfully' };
  }
}

async function getstorePayment(email) {
  try {
    
    const [rows] = await pool.execute(
            'SELECT * FROM users WHERE Email = ?',
            [email]
            );
        if (rows.length === 0) {
            return ({ status: 404, message: 'User not found' });
        }
        // Return the full user object (first row)
        return rows.length > 0 ? rows[0] : null;
      } catch (err) {
        return { status: 500, message: 'data not updated successfully' };
      }
}

module.exports = { storePayment,getstorePayment };