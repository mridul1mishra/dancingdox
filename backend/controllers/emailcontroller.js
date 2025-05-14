const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const sesClient = new SESClient({
  region: 'us-east-2',
  credentials: {
    
  }
});
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
    const command = new SendEmailCommand(params);
    await sesClient.send(command);
    res.status(200).send('Email sent successfully!');
  } catch (err) {
    console.error('SES Error:', err);
    res.status(500).send('Failed to send email: ' + err.message);
  }
};
