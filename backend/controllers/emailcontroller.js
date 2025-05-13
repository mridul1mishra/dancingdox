const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const ses = new AWS.SES();

exports.sendEmail = async (req, res) => {
  const { to, subject, body } = req.body;

  const params = {
    Source: 'info@dashdoxs.com', // replace with your verified SES email
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Text: { Data: body } }
    }
  };

  try {
    await ses.sendEmail(params).promise();
    res.status(200).send('Email sent successfully!');
  } catch (err) {
    console.error('SES Error:', err);
    res.status(500).send('Failed to send email: ' + err.message);
  }
};