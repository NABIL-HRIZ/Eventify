// src/pages/Checkout.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Checkout.css";
import { AuthContext } from "../auth/AuthContext";
import { FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import cmi from "../assets/cmi.jpg";
import { loadStripe } from "@stripe/stripe-js";


import { useDispatch, useSelector } from "react-redux";
import {  incrementCartBy } from "../slices/CartSlice";
import { addPurchasedEvent } from "../slices/UserSlice";



const stripePromise = loadStripe("pk_test_51OmxxCFMrNvJHi85lITE0lzZbtF2p4rtVQDOeXdBRIIIWa5SjTeX9TL7TLMZH6I6PyomHXIgxXwYSqt81GqSZiAF00yXRbVvzP"); 

const Checkout = () => {
  const dispatch = useDispatch();
const cartCount = useSelector((state) => state.cart.cartCount);
const purchasedEvents = useSelector((state) => state.user.purchasedEvents);

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


const handleCheckout = async () => {
  try {
    const res = await axios.post("http://127.0.0.1:8000/api/create-checkout-session", {
      amount: event.prix,
      count,
      title: event.title,
      eventId: event.id,
      user_id: user?.id, 
      
      return_url: `http://localhost:3000/success?eventId=${event.id}&title=${encodeURIComponent(event.title)}&count=${count}&amount=${event.prix}`
    });

    dispatch(incrementCartBy(count));

    
    window.location.href = res.data.url;
  } catch (err) {
    console.error("Erreur Stripe:", err);
  }
};


  if (loading)
    return (
      <div className="checkout-loading">
        <div className="loading-spinner"></div>
        <p>Chargement de votre commande...</p>
      </div>
    );

  if (!event)
    return (
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
            <h2 className="section-title">Récapitulatif de la commande</h2>

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
                <FaCalendarAlt className="detaill-icon" />
                <div className="detail-content">
                  <span className="detail-label">Date de l'événement</span>
                  <span className="detail-value">
                    {new Date(event.date_fin).toLocaleString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <FaMapMarkerAlt className="detaill-icon" />
                <div className="detail-content">
                  <span className="detail-label">Lieu</span>
                  <span className="detail-value">{event.lieu}</span>
                </div>
              </div>

              <div className="pricing-breakdown">
                <div className="price-row">
                  <span>
                    {event.prix} MAD × {count} billet{count > 1 ? "s" : ""}
                  </span>
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
            <h2 className="section-title">Informations de paiement</h2>

            {!user && (
              <div className="guest-form">
                <h3 className="form-subtitle">Informations personnelles</h3>

                <div className="input-group">
                  <div className="input-icon"><FaEnvelope /></div>
                  <input
                    type="email"
                    placeholder="Votre adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="modern-input"
                  />
                </div>

                <div className="input-group">
                  <div className="input-icon"><FaPhone /></div>
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
                    <img src={cmi} style={{ width: "40px" }} alt="cmi" />
                    <div className="option-text">
                      <span className="option-title">Carte bancaire</span>
                      <span className="option-desc">Paiement sécurisé via Stripe</span>
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
                <span className="terms-text" style={{ color: "#fff" }}>
                  J'accepte les{" "}
                  <a href="/politique" target="_blank" rel="noreferrer" className="terms-link">
                    politiques de remboursement
                  </a>
                </span>
              </label>
            </div>

            <button
              onClick={handleCheckout}
              className={`checkout-button ${!acceptTerms ? "disabled" : ""}`}
              disabled={!acceptTerms}
            >
              Payer Maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
