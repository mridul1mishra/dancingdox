const express = require('express');
const bodyParser = require('body-parser');
const { storePayment } = require('../utils/users/storePayment.js'); 
const { getstorePayment } = require('../utils/users/storePayment.js'); 
const notificationService   = require('../utils/nofitication/notificationservice');
const fs = require('fs');
const path = require('path');
const csvPath = path.join(__dirname, '../public/data/users.csv');

if (!fs.existsSync(csvPath)) {
  fs.writeFileSync(csvPath, 'PaymentMethodId,Brand,Last4,ExpMonth,ExpYear,BillingName\n');
}

exports.storeData = async (req, res) => {
  try {
      const email = req?.headers?.['x-user-email'];
      const {
        paymentMethodId,
        brand,
        last4,
        expMonth,
        expYear,
        billingName,
        subscriptiontype
      } = req.body;
    console.log(req.body);
    console.log(email);
    const result = await storePayment({paymentMethodId, brand, last4, expMonth, expYear, billingName, subscriptiontype, email })
      
    //notificationService.insertNotification(email, 'Susbription to the app successful', 'success');
    res.json({ success: true, affectedRows: result.affectedRows });
  } catch (err) {
    console.error('Error updating users.csv:', err);
    return ({status: 500, message: err.message });
  }
};

exports.getstoreData = async (req, res) => {
  try {
    const email = req.params.email;
    console.log(email);
    const user = await getstorePayment(email )
    if (!user) {
      return ({ status: 404, message: 'User not found' });
    }

    res.json(user);  
  } catch (err) {
    console.error('Error updating users.csv:', err);
    return ({ status: 500, error: err.message });
  }
};