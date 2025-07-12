const express = require('express');
const bodyParser = require('body-parser');

const fs = require('fs');
const path = require('path');
const csvPath = path.join(__dirname, '../public/data/users.csv');

if (!fs.existsSync(csvPath)) {
  fs.writeFileSync(csvPath, 'PaymentMethodId,Brand,Last4,ExpMonth,ExpYear,BillingName\n');
}

exports.storeData = async (req, res) => {
  try {
    const email = req.headers['x-user-email'];
    if (!email) return res.status(400).json({ error: 'Missing x-user-email header.' });

    const {
      paymentMethodId,
      brand,
      last4,
      expMonth,
      expYear,
      billingName
    } = req.body;
    console.log(paymentMethodId, brand, last4, expMonth, expYear, billingName);
    const raw = fs.readFileSync(csvPath, 'utf-8');
    const lines = raw.trim().split('\n');

    // Parse headers and data
    const headers = lines[0].split(',').map(h => h.trim());
    const records = lines.slice(1).map(line => line.split(','));
    console.log('Headers:', headers);
    const updatedLines = [headers.join(',')];
    records.forEach(row => {
       if (!row || row.length === 0 || row.every(cell => cell.trim() === '')) return;
      
      while (row.length < headers.length) {
        row.push('');
      }
      const record = Object.fromEntries(headers.map((h, i) => [h, row[i] || '']));
      if (record.email === email) {
        console.log('Before update:', record);
        record.isSubscribed = true;
        record.paymentMethodId = paymentMethodId;
        record.brand = brand;
        record.last4 = last4;
        record.expMonth = expMonth;
        record.expYear = expYear;
        record.billingName = billingName;
        console.log('After update:', record);        
      }

      // Rebuild row from headers
      const updatedRow = headers.map(h => record[h] || '');
      updatedLines.push(updatedRow.join(','));
      });
      fs.writeFileSync(csvPath, updatedLines.join('\n'), 'utf-8');

    res.status(200).json({
      message: 'User record updated in user.csv successfully.'
    });
  } catch (err) {
    console.error('Error updating users.csv:', err);
    res.status(500).json({ error: err.message });
  }
};