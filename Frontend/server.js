// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json()); // for parsing application/json

// Connect to MongoDB using environment variable
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// User Schema and Model
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// POST route for user signup
app.post('/signup', async (req, res) => {
    const { email, username, password, confirmPassword } = req.body;

    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        return res.status(400).json({ error: "L'email ou le nom d'utilisateur existe déjà." });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Les mots de passe ne correspondent pas." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ email, username, password: hashedPassword });

    try {
        await newUser.save();
        res.status(200).json({ message: "Inscription réussie !" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur est survenue. Veuillez réessayer." });
    }
});

// POST route for login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ $or: [{ email: username }, { username }] });
    if (!user) {
        return res.status(400).json({ error: "Utilisateur non trouvé." });
    }

    // Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: "Mot de passe incorrect." });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send response
    res.status(200).json({ message: "Connexion réussie !", token });
});

// Example of a protected route using JWT token
app.get('/protected', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token
    if (!token) return res.status(401).json({ error: 'Access Denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid Token' });
        res.status(200).json({ message: 'Protected Route Accessed', user });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
