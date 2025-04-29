// Simple in-memory users "database"
const bcrypt = require('bcryptjs');

const users = [
    {
      id: 1,
      username: 'user1',
      password: bcrypt.hashSync('mridul123', 10) // password: 'password123'
    }
  ];
  
  module.exports = users;
  