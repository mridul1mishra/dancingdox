const pool = require('../sql');

async function storePayment({paymentMethodId, brand, last4, expMonth, expYear, billingName, subscriptiontype, email }){
    console.log('storepayment triggered');
    const sql = `
  UPDATE users
SET  paymentMethodId = ?,  brand = ?,  last4 = ?,  expMonth = ?,  expYear = ?, billingName = ?, isSubscribed = ?, subscriptiontype = ? WHERE Email = ?;`;

const values = [  paymentMethodId ?? null,  brand ?? null,  last4 ?? null,  expMonth ?? null,  expYear ?? null,  billingName ?? null,  'true', subscriptiontype, email ?? null];
values.forEach((v, i) => {
  if (v === undefined) {
    console.warn(`Warning: Parameter at index ${i} is undefined`);
  }
});

const sanitizedValues = values.map(v => v === undefined ? null : v);
console.log(sanitizedValues);
try {
const [res] = await pool.execute(sql, values);


return result.length > 0 ? result[0] : null;
  } catch (err) {
    console.error('Error executing SQL:', err.message);
  console.error('Query:', sql);
  console.error('Values:', values);
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