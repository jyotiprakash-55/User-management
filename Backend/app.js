const express = require('express');
const cors = require('cors');
const app = express();

// Important: Order matters!
app.use(cors());
app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Your routes here...