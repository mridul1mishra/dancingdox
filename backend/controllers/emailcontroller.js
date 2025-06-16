const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const otpStore = new Map();
const tokenStore = new Map();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const sesClient = new SESClient({
  region: 'us-east-2',
  credentials: {
   
  }

});
exports.sendEmail = async (req, res) => {
  const { to } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  otpStore.set(to, otp);
  console.log('Stored OTP for', to, ':', otpStore.get(to));
  console.log('Stored OTP for', otp, ':', otpStore.get(otp));
    // Custom subject and body (override any sent by client)
  const subject = 'Your OTP Code for DashDoxs';
  const templatePath = path.join(__dirname, 'templates', 'html/otp.html');
  let body = fs.readFileSync(templatePath, 'utf8');
  body = body.replace('{{ActionLink}}', otp);
  const params = {
    Source: 'DashDoxs<info@dashdoxs.com>', // replace with your verified SES email
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Html: { Charset: "UTF-8", Data: body } }
    }
  };

  try {
    const command = new SendEmailCommand(params);
    await sesClient.send(command);
    console.log(`OTP sent to ${to}: ${otp}`);

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (err) {
    console.error('SES Error:', err);
    res.status(500).send('Failed to send email: ' + err.message);
  }
};


exports.verifyOtp =  (req, res) => {
  const { to, otp, reset  } = req.body;
  console.log('Received:', { to, otp, reset });
  const storedOtp = otpStore.get(to);
  console.log('storedotp',storedOtp);
  if (storedOtp && storedOtp == otp) {
    delete otpStore[to]; // One-time use
    if (reset === 'true') {
      const token = generateResetToken(to); // your custom logic to generate token
      return res.status(200).json({
        valid: true,
        message: 'User verified successfully!',
        token: token
      });
    }
    return res.status(200).json({
      valid: true,
      message: 'User verified successfully!'
    });
  } else {
    res.status(400).json({ valid: false, message: 'Invalid OTP' });
  }
};

exports.quoteEmail = async (req, res) => {
  const { to, subject1, body1 } = req.body;
  console.log(req.body);
  const subject = 'Thank you for contacting us';
  const templatePath = path.join(__dirname, 'templates', 'html/contactus.html');
  let body = fs.readFileSync(templatePath, 'utf8');
  const params = {
    Source: 'DashDoxs<info@dashdoxs.com>', // replace with your verified SES email
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Html: { Charset: "UTF-8", Data: body } }
    }
  };

  try {
    const command = new SendEmailCommand(params);
    await sesClient.send(command);

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (err) {
    console.error('SES Error:', err);
    res.status(500).send('Failed to send email: ' + err.message);
  }
};
function generateResetToken(to) {
  const token = crypto.randomBytes(64).toString('hex');
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes from now

  tokenStore.set(token, { token, expiresAt });
  return token;
}

exports.sendResetLinkEmail = async (req, res) => {
  const { to } = req.body;
  
  const resetUrl = `https://www.dashdoxs.com/reset-password?email=${to}&token=${token}`;
  const templatePath = path.join(__dirname, 'templates', 'html/reset-password.html');
    // Custom subject and body (override any sent by client)
  const subject = 'Reset your password';
  let body = fs.readFileSync(templatePath, 'utf8');
  body = body.replace('{{ActionLink}}', resetUrl);
  console.log(body);
  const params = {
    Source: 'DashDoxs<info@dashdoxs.com>', // replace with your verified SES email
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Html: { Charset: "UTF-8", Data: body } }
    }
  };

  try {
    const command = new SendEmailCommand(params);
    await sesClient.send(command);
    console.log(`Reset link sent to ${to}: ${resetUrl}`);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (err) {
    console.error('SES Error:', err);
    res.status(500).send('Failed to send email: ' + err.message);
  }
};

exports.validateResetToken = (req, res) => {
  const { token } = req.body;

  const record = tokenStore.get(token);
  if (!record || Date.now() > record.expiresAt) {
    return res.status(400).json({ valid: false, message: 'Token is invalid or expired' });
  }

  return res.status(200).json({ valid: true });
};
