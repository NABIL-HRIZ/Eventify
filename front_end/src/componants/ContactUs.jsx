import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ContactUs.css';
import { FaPaperPlane, FaUser, FaEnvelope, FaComment } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  // Configure SweetAlert2 theme for dark background
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post('http://127.0.0.1:8000/api/contacts', formData);

      if (data.success) {
        // Success SweetAlert
        Toast.fire({
          icon: 'success',
          title: 'Message envoyé avec succès!',
          iconColor: '#00ff7f'
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        // Error SweetAlert for API response error
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de l\'envoi du message.',
          background: '#1a1a2e',
          color: 'white',
          confirmButtonColor: '#FFD700',
          confirmButtonText: 'OK'
        });
      }

    } catch (error) {
      console.error('Erreur serveur:', error);
      
      // Error SweetAlert for network/server error
      Swal.fire({
        icon: 'error',
        title: 'Erreur serveur',
        text: 'Erreur serveur, réessayez plus tard.',
        background: '#1a1a2e',
        color: 'white',
        confirmButtonColor: '#FFD700',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-us-container">
      <div className="contact-us-wrapper">
        <div className="contact-header">
          <h1 className="contact-title">Contactez-Nous</h1>
          <p className="contact-subtitle">
            Nous sommes là pour répondre à toutes vos questions. Envoyez-nous un message et nous vous répondrons dès que possible.
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-form-container">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
             
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Votre nom complet"
                  required
                />
              </div>

              <div className="form-group">
               
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div className="form-group">
                
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Décrivez votre demande en détail..."
                  rows="6"
                  required
                />
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Envoyer le message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;