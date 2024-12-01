const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3001;
const DB_URI = process.env.DB_URI;

// Connect to MongoDB
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.error('Database connection error:', err));


