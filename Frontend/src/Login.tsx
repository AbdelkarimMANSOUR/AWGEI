import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Réinitialiser les erreurs
    setIsLoading(true); // Afficher un indicateur de chargement

    try {
      const response = await axios.post("http://localhost:3003/login", {
        username,
        password,
      });

      // Si la connexion réussit

      console.log("Login successful:", response.data);
      alert("Connexion réussie !");


      // Enregistrer le token dans le stockage local (ou cookies)

      localStorage.setItem("token", response.data.token);

      // Redirection ou autre logique
    } catch (err: any) {
      console.error("Login failed:", err.response?.data?.error || err.message);
      setError(err.response?.data?.error || "Erreur lors de la connexion.");
    } finally {
      setIsLoading(false); // Arrêter l'indicateur de chargement
    }
  };


  return (
    <div className="login-container">
      <h1>Portail Scolarité AWEGI </h1>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Entrer votre nom d'utilisateur"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Entrer votre mot de passe"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>
        <br/>
        <button type="submit" className="login-button" disabled={isLoading}>
        Créer un compte </button>
        <br/>
        
      
      <form>
        <p className="forgot-password">
          <a href="/forgot-password">Mot de passe oublié ?</a>
        </p>
        

      </form>
    </div>
  );
}

export default LoginPage;