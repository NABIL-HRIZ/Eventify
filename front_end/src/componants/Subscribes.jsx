import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Subscibes.css';

const Subscibes = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/add-email', { email });
      setMessage(response.data.message); // success message from backend
      setEmail('');
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Erreur, réessayez.');
    }
  };

  return (
    <div className="contact-us-section">
      <div className="contact-us-container">
        <div className="contact-us-content">
          <h3 className="contact-us-title">Restez informés!</h3>
          <p className="contact-us-description">
            Soyez le premier à profiter d'offres exclusives et à être informé des dernières 
            nouveautés sur nos produits, le tout directement dans votre boîte de réception
          </p>
          
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre adresse email"
                className="email-input"
                required
              />
              <button type="submit" className="subscribe-btn">
                S'inscrire
              </button>
            </div>



          </form>

          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Subscibes;
