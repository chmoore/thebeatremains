const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const express = require('express');
const cors = require('cors');
const audioRoutes = require('./routes/audioRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
  next();
});

// Routes
app.use('/audio', audioRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
