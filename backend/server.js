const express = require('express');
const cors = require('cors');
const projectRoutes = require('./routes/projects');
const uploadRoute = require('./routes/uploadfile');
const docRoutes = require('./routes/docs');
const collabRoutes = require('./routes/collab');
const authRoutes = require('./routes/authroutes');
const paymentRoutes = require('./routes/paymentroutes');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/public', express.static('public')); // if needed to serve files
app.get('/', (req, res) => {
  res.send('🚀 Welcome to my Node API!');
});

// Route registration
app.use('/api', uploadRoute);
app.use('/api', projectRoutes);
app.use('/api/docs', docRoutes);
app.use('/api/collab', collabRoutes);
app.use('/api', authRoutes);
app.use('/api', paymentRoutes);
app.use((req, res) => {
  console.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
