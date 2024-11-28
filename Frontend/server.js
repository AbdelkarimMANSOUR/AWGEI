const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize Express
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const mongoURI = "mongodb+srv://abdelkarimmansouretu24:JdFAlqJ8TbSZCDc4@gynelink.8qmqx.mongodb.net/myDatabaseName?retryWrites=true&w=majority";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

// Schema and Model
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// Routes
// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ email: username, password });
        if (user) {
            res.status(200).send("Login successful!");
        } else {
            res.status(401).send("Invalid credentials");
        }
    } catch (error) {
        res.status(500).send("Server error");
    }
});

// Signup Route
app.post('/signup', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).send("Passwords do not match");
    }

    const newUser = new User({ username, email, password });
    try {
        await newUser.save();
        res.status(201).send("User registered successfully");
    } catch (error) {
        res.status(500).send("Error registering user");
    }
});

// Serve the frontend
app.use(express.static('public'));

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
