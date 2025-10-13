import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/ForgotPassword.css";
import { FaEnvelope, FaPaperPlane, FaKey } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const Toast = Swal.mixin({
    background: '#1a1a2e',
    color: 'white',
    iconColor: '#FFD700',
    confirmButtonColor: '#FFD700',
    cancelButtonColor: '#6c757d',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Veuillez entrer votre adresse email.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie"); 

      const res = await axios.post("http://127.0.0.1:8000/api/forgot-password", { email });

      Toast.fire({
        icon: "success",
        title: "Lien envoyé! Vérifiez votre email.",
        iconColor: '#00ff7f'
      });

      setEmail("");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors.email?.[0] || "Une erreur est survenue.");
        
        Toast.fire({
          icon: "error",
          title: err.response.data.errors.email?.[0] || "Une erreur est survenue.",
          iconColor: '#ff4757'
        });
      } else {
        setError("Impossible d'envoyer le lien. Vérifiez votre connexion.");
        
        Toast.fire({
          icon: "error",
          title: "Erreur de connexion",
          iconColor: '#ff4757'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <div className="forgot-header">
        
          <h2>Mot de passe oublié ?</h2>
          <p>Entrez votre email pour recevoir un lien de réinitialisation.</p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-form">
          <div className="form-group">
            <div className="input-container">
              <input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="forgot-input"
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">
           
               
                Envoyer le lien
            
          </button>
        </form>

        <div className="forgot-footer">
          <p>Vous vous souvenez de votre mot de passe ? <a href="/login" className="login-link">Se connecter</a></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;