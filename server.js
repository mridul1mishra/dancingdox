const express = require('express');
const helmet = require('helmet');
const path = require('path');

const app = express();

// Apply CSP using Helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      objectSrc: ["'none'"],
    },
  })
);

// Serve Angular static files
app.use(express.static(path.join(__dirname, 'dist/my-angular-app/browser/')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/my-angular-app/browser/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
