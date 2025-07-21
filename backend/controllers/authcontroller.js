const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { insertUser } = require('../utils/users/createUsers'); // adjust path
const { loginUser } = require('../utils/users/loginUser'); // adjust path as needed
const { getUser } = require('../utils/users/getUser'); 
const { updateUser } = require('../utils/users/updateUser'); 
const { updatePass } = require('../utils/users/updatePass'); 

const csvFilePath = path.join(__dirname, '../public/data/users.csv');

// Ensure CSV file exists with headers
if (!fs.existsSync(csvFilePath)) {
  fs.writeFileSync(csvFilePath, 'email,password\n'); // headers
}


exports.login = async (req, res) => {
  const { email, password } = req.body;

  const result = await loginUser(email, password);

  if (!result.success) {
    return res.status(401).json(result);
  }

  const token = jwt.sign(
        { email: email },
        process.env.JWT_SECRET || 'your_default_secret',
        { expiresIn: process.env.JWT_EXPIRATION || '1h' }
      );

      res.json({ token });
};




exports.register = async (req, res) => {
  const { email, password, firstname, lastname, designation, organization  } = req.body;
  console.log(req.body);
  try{
    const userId = Math.floor(Date.now() / 1000);
  const hashedPassword = await bcrypt.hash(password, 10);
  const isSubscribed = false; // boolean
  const user = {
      userId: userId, // or a UUID if preferred
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedPassword,
      designation: designation,
      organization: organization
    };
  const result = await insertUser(user);
  res.json({ success: true, message: 'User created', insertId: result.insertId });
}catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error', err });
  }
  
};

exports.getCSV = async (req, res) => {
  const { email } = req.query;
   try {
    const user = await getUser(email);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json(user);

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
  
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
exports.updateProfile = async (req, res) => {
  const user = req.body;
  try{
    console.log(user);
    const result = await updateUser(user);
    
    res.json({ success: true, message: 'User updated' });
  }catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error', err });
  }
};

exports.passUpdate = async (req, res) => {
  const {email, password, existingPass} = req.body;
  try{
    console.log(email);
    const result = await updatePass({email, password, existingPass});
    console.log(result);
    res.status(result.status).json({ message: result.message });
  }catch (err) {
    return res.status(err.status).json({ message: err.message });
  }

  
};