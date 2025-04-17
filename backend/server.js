const express = require('express');
const cors = require('cors');
const projectRoutes = require('./routes/projects');
const uploadRoute = require('./routes/uploadnew');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/public', express.static('public')); // if needed to serve files
app.use('/', uploadRoute);

// Route registration
app.use('/', projectRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
