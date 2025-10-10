// src/pages/Checkout.js
import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Checkout.css";
import { AuthContext } from "../auth/AuthContext";
import { FaCreditCard, FaUser, FaPhone, FaEnvelope, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";
import cmi from '../assets/cmi.jpg'
import StripeContainer from "./StripeContainer";

const Checkout = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const count = state?.count || 0;

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/evenement/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error("Erreur lors du fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);



  if (loading) return (
    <div className="checkout-loading">
      <div className="loading-spinner"></div>
      <p>Chargement de votre commande...</p>
    </div>
  );
  
  if (!event) return (
    <div className="checkout-error">
      <h2>Événement non trouvé</h2>
      <p>L'événement que vous recherchez n'existe pas ou a été supprimé.</p>
      <button onClick={() => navigate("/")} className="back-home-btn">
        Retour à l'accueil
      </button>
    </div>
  );

  return (
    <div className="modern-checkout-container">
      <div className="checkout-header">
        <h1>Finaliser votre commande</h1>
        <p>Révisez vos billets et procédez au paiement</p>
      </div>

      <div className="checkout-content">
        <div className="checkout-left">
          <div className="order-summary-card">
            <h2 className="section-title">
              
              Récapitulatif de la commande
            </h2>
            
            <div className="event-image-container">
              {event.image && (
                <img
                  src={`http://127.0.0.1:8000/storage/${event.image}`}
                  alt={event.title}
                  className="event-image"
                />
              )}
            </div>

            <div className="event-details">
              <h3 className="event-title">{event.title}</h3>
              
              <div className="detail-item">
                <FaCalendarAlt className="detail-icon" />
                <div className="detail-content">
                  <span className="detail-label">Date de l'événement</span>
                  <span className="detail-value">
                    {new Date(event.date_fin).toLocaleString("fr-FR", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <FaMapMarkerAlt className="detail-icon"/>
                <div className="detail-content">
                  <span className="detail-label">Lieu</span>
                  <span className="detail-value">{event.lieu}</span>
                </div>
              </div>

              <div className="pricing-breakdown">
                <div className="price-row">
                  <span>{event.prix} MAD × {count} billet{count > 1 ? 's' : ''}</span>
                  <span>{count * event.prix} MAD</span>
                </div>
                <div className="price-row total">
                  <span>Total</span>
                  <span className="total-amount">{count * event.prix} MAD</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="checkout-right">
          <div className="payment-card">
            <h2 className="section-title">
              
              Informations de paiement
            </h2>

            {!user && (
              <div className="guest-form">
                <h3 className="form-subtitle">
                 
                  Informations personnelles
                </h3>
                
                <div className="input-group">
                  <div className="input-icon">
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    placeholder="Votre adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="modern-input"
                  />
                </div>

                <div className="input-group">
                  <div className="input-icon">
                    <FaPhone />
                  </div>
                  <input
                    type="tel"
                    placeholder="Votre numéro de téléphone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="modern-input"
                  />
                </div>
              </div>
            )}

            <div className="payment-method">
              <h3 className="form-subtitle">Méthode de paiement</h3>
              
              <div className="payment-options">
                <label className="payment-option selected">
                  <input type="radio" name="payment" defaultChecked />
                  <div className="option-content">
                    <img src={cmi} style={{width:'40px'}}/>
                    <div className="option-text">
                      <span className="option-title">Carte bancaire</span>
                      <span className="option-desc">Paiement sécurisé</span>
                    </div>
                  </div>
                </label>

               
              </div>
            </div>

            <div className="terms-section">
              <label className="terms-checkbox">
                <input 
                  type="checkbox" 
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="terms-text" style={{color:'#fff'}}>
                  J'accepte les{" "}
                  <a href="/politiques" target="_blank" rel="noreferrer" className="terms-link">
                    politiques de remboursement
                  </a>{" "}
                 
                </span>
              </label>
            </div>

            <button 
              className={`checkout-button ${!acceptTerms ? 'disabled' : ''}`}
             onClick={() => 
    navigate(`/create-payement`)
  }
              disabled={!acceptTerms}
            >
                <StripeContainer amount={2000} />
              Payer {count * event.prix} MAD
            </button>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;