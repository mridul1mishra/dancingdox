const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../user');
const fs = require('fs');
const path = require('path');

const csvFilePath = path.join(__dirname, '../public/data/users.csv');

// Ensure CSV file exists with headers
if (!fs.existsSync(csvFilePath)) {
  fs.writeFileSync(csvFilePath, 'email,password\n'); // headers
}


exports.login = (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt with', email);

  fs.readFile(csvFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read CSV:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    const lines = data.trim().split('\n');
    const users = lines.slice(1).map(line => {
      const [storedEmail, storedPassword] = line.split(',');
      return { email: storedEmail.trim(), password: storedPassword.trim() };
    });

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing password:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET || 'your_default_secret',
        { expiresIn: process.env.JWT_EXPIRATION || '1h' }
      );

      res.json({ token });
    });
  });
};


exports.register = (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Step 1: Read CSV and check for existing email
  fs.readFile(csvFilePath, 'utf8', async (err, data) => {
    if (err) {
      console.error('Error reading CSV file:', err);
      return res.status(500).json({ message: 'Server error while checking users' });
    }
    const lines = data.split('\n');
    const emails = lines.slice(1).map(line => line.split(',')[0].trim());

    if (emails.includes(email)) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Step 2: Append new user
    const newLine = `${email},${hashedPassword},${name}\n`;
    fs.appendFile(csvFilePath, newLine, (err) => {
      if (err) {
        console.error('Error writing to CSV:', err);
        return res.status(500).json({ message: 'Failed to register user' });
      }

      res.status(201).json({ message: 'User registered and saved to CSV' });
    });
  });
};