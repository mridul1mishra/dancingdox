const express = require('express');
const cors = require('cors');
const projectRoutes = require('./routes/projects');
const uploadRoute = require('./routes/uploadnew');
const docRoutes = require('./routes/docs');
const collabRoutes = require('./routes/collab');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/public', express.static('public')); // if needed to serve files
app.get('/', (req, res) => {
  res.send('🚀 Welcome to my Node API!');
});


app.use('/', uploadRoute);

// Route registration
app.use('/', projectRoutes);
app.use('/docs', docRoutes);
app.use('/collab', collabRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
