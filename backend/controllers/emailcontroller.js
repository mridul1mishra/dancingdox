const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const otpStore = new Map();
const sesClient = new SESClient({
  region: 'us-east-2',
  credentials: {
    
  }

});
exports.sendEmail = async (req, res) => {
  const { to } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  otpStore.set(to, otp);
    // Custom subject and body (override any sent by client)
  const subject = 'Your OTP Code for DashDoxs';
  const body = `Hello,\n\nYour One-Time Password (OTP) is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nThanks,\nDashDoxs Team`;
  const params = {
    Source: 'info@dashdoxs.com', // replace with your verified SES email
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Text: { Data: body } }
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
  const { to, otp } = req.body;
  const storedOtp = otpStore.get(to);
  console.log('Current OTP store:', Array.from(otpStore.entries()));
  if (storedOtp && storedOtp == otp) {
    delete otpStore[to]; // One-time use
    return res.status(200).json({
      valid: true,
      message: 'User verified successfully!'
    });
  } else {
    res.status(400).json({ valid: false, message: 'Invalid OTP' });
  }
};
