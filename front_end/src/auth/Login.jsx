import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
    if (!formData.password) newErrors.password = "Le mot de passe est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", formData);

      const userData = response.data.user;
      const token = response.data.token;
      const roles = response.data.roles; 

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      setUser({
  ...userData,
  role: roles[0] || null 
});
      localStorage.setItem("roles", JSON.stringify(roles));

      if (roles.includes("admin")) {
        navigate("/admin");
      } else if (roles.includes("organisateur")) {
        navigate("/organisateur");
      } else {
        navigate("/user");
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response && error.response.data.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: "Une erreur est survenue. Veuillez réessayer." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  
 useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  axios.get("http://127.0.0.1:8000/api/user", { headers: { Authorization: `Bearer ${token}` } })
    .then(res => {
      if (!res.data.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } else {
        setUser(res.data.user);
      }
    })
    .catch(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    });
}, []);


  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Content de vous revoir !</h2>
          <p>Connectez-vous à votre compte Eventify</p>
        </div>

        {errors.general && <div className="error-message">{errors.general}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              placeholder="votre@email.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
              placeholder="Votre mot de passe"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> <span>Se souvenir de moi</span>
            </label>
            <a href="/forgot-password" className="forgot-password">Mot de passe oublié ?</a>
          </div>

          <button type="submit" className={`submit-btn ${isLoading ? "loading" : ""}`} disabled={isLoading}>
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="login-footer">
          <p>Pas encore de compte ? <Link to="/register">S'inscrire</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
