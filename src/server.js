require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const consultationRoutes = require('./routes/consultation_routes');
const projectRoutes = require('./routes/project_routes');
const materialRoutes = require('./routes/material_routes');

const app = express();
app.use(
    cors({
        origin: 'http://127.0.0.1:5500'
    })
);
app.use(express.json());
// app.use(express.static('frontend'));
app.use('/api', consultationRoutes);
app.use('/api', projectRoutes);
app.use('/api', materialRoutes);

pool.query('SELECT NOW()', (err, res) => {
  if(err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    console.log('Connected to the database:', res.rows);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
