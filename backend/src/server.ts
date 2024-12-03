import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import {User} from "./models/User";
import jwt from "jsonwebtoken";

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.error("Erreur MongoDB:", err));

// Route : Enregistrement d'un utilisateur
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: "Utilisateur déjà enregistré" });

    // Créer et sauvegarder un nouvel utilisateur
    const user = new User({ username, password });
    await user.save();

    res.status(201).json({ message: "Utilisateur enregistré avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'enregistrement" });
  }
});

// Route : Connexion utilisateur
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Mot de passe incorrect" });

    // Générer un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    res.status(200).json({ message: "Connexion réussie", token });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
});

// Route : Vérification du token (authentification protégée)
app.get("/protected", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Accès non autorisé, token manquant" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    res.status(200).json({ message: "Accès autorisé", user: decoded });
  } catch (err) {
    res.status(401).json({ error: "Token invalide ou expiré" });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});