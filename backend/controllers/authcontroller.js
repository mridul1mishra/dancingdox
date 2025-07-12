const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const csvFilePath = path.join(__dirname, '../public/data/users.csv');

// Ensure CSV file exists with headers
if (!fs.existsSync(csvFilePath)) {
  fs.writeFileSync(csvFilePath, 'email,password\n'); // headers
}


exports.login = (req, res) => {
  const { email, password } = req.body;

  


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
    return res.status(400).json({ message: 'Email, password, and name are required' });
  }

  fs.readFile(csvFilePath, 'utf8', async (err, data) => {
    if (err) {
      console.error('Error reading CSV:', err);
      return res.status(500).json({ message: 'Server error while checking users' });
    }

    const lines = data.trim().split('\n');  // Remove trailing whitespace
    const emails = lines.slice(1).map(line => line.split(',')[0].trim());

    if (emails.includes(email)) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isSubscribed = false; // boolean
    let newLine = `${email},${hashedPassword},${name},${isSubscribed}`;

    // Ensure the file ends with a newline
    const needsNewline = data.length > 0 && !data.endsWith('\n');
    const lineToAdd = (needsNewline ? '\n' : '') + newLine + '\n';

    fs.appendFile(csvFilePath, lineToAdd, (err) => {
      if (err) {
        console.error('Error appending to CSV:', err);
        return res.status(500).json({ message: 'Failed to register user' });
      }

      res.status(201).json({ message: 'User registered and saved to CSV' });
    });
  });
};

exports.getCSV = (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email query parameter is required' });
  }

  const results = [];
let responseSent = false;
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      const csvEmail = row.email?.trim().toLowerCase();
      const inputEmail = email.trim().toLowerCase();
       
       if (csvEmail === inputEmail) {
        results.push(row);
      }
    })
    .on('end', () => {
      if (responseSent) return;
      if (results.length > 0) {
      const { name, image, email, isSubscribed } = results[0];
      res.json({ name, image, email, isSubscribed });
    } else {
        res.status(404).json({ error: 'User not found' });
      }
       responseSent = true;
    })
    .on('error', (err) => {
      if (!responseSent) {
      console.error('Error reading CSV:', err);
      res.status(500).json({ error: 'Server error while reading CSV' });
      responseSent = true;
    }
    });
};

exports.passReset = async (req, res) => {
  console.log('console log from passReset')
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  fs.readFile(csvFilePath, 'utf8', async (err, data) => {
    if (err) {
      console.error('Error reading CSV file:', err);
      return res.status(500).json({ message: 'Server error while reading user file' });
    }

    const lines = data.trim().split(/\r?\n|\r/); 
    const headers = lines[0];
    const users = lines.slice(1);

    let found = false;
    const emailInput = email.trim().toLowerCase().replace(/[\r\n"]/g, '');
    
    
    const updatedUsers = await Promise.all(users.map(async (line) => {
      const [userEmail, _password, ...rest] = line.trim().split(',');
      const csvEmail = userEmail.trim().toLowerCase().replace(/[\r\n"]/g, '');
      const csvEmailFirst = csvEmail.trim().toLowerCase().replace(/^\uFEFF/, '');
      console.log('Comparing:', csvEmail, '===', emailInput); // Debug log
      if (csvEmailFirst === emailInput) {
        found = true;
        const hashedPassword = await bcrypt.hash(password, 10);
        return [userEmail, hashedPassword, ...rest].join(',');
      }
      return line;
    }));

    if (!found) {
      return res.status(404).json({ message: 'Email not found in system Pass Reset' });
    }

    const updatedCsv = [headers, ...updatedUsers].join('\n');

    fs.writeFile(csvFilePath, updatedCsv, (err) => {
      if (err) {
        console.error('Error writing to CSV:', err);
        return res.status(500).json({ message: 'Failed to update password' });
      }

      return res.status(200).json({ message: 'Password updated successfully' });
    });
  });
};