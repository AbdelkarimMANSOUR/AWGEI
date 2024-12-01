const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.send('AWGEI Backend is Running');
});

module.exports = app;


