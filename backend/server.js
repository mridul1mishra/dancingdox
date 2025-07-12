const express = require('express');
const cors = require('cors');
const projectRoutes = require('./routes/projects');
const uploadRoute = require('./routes/uploadfile'); // ✅ must come before json parser
const docRoutes = require('./routes/docs');
const collabRoutes = require('./routes/collab');
const authRoutes = require('./routes/authroutes');
const paymentRoutes = require('./routes/paymentroutes');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());

// ✅ Place this BEFORE body parsers
app.use('/api', uploadRoute);   // multer routes (upload-multiple)

// ✅ NOW apply JSON and URLENCODED parsers
app.use(express.json());             
app.use(express.urlencoded({ extended: true }));

// Other static + non-multer routes
app.use('/public', express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', projectRoutes);
app.use('/api/docs', docRoutes);
app.use('/api/collab', collabRoutes);
app.use('/api', authRoutes);
app.use('/api', paymentRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Welcome to my Node API!');
});

app.use((req, res) => {
  console.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
