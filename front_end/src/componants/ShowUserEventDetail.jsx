import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { IoLocationOutline } from "react-icons/io5";
import { MdDateRange } from "react-icons/md";
import '../styles/ShowUserEventDetail.css'

const ShowUserEventDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const [isBuying, setIsBuying] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/evenement/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error("Erreur lors du fetch de l'événement :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBuyNow = () => {
    setIsBuying(true);
  };



  if (loading) {
    return (
      <div className="user-event-detail-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des détails de l'événement...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="user-event-detail-error">
        <div className="error-icon"></div>
        <h3>Événement non trouvé</h3>
        <p>L'événement que vous recherchez n'existe pas ou a été supprimé.</p>
        <button onClick={handleBack} className="back-btn">
          Retour aux événements
        </button>
      </div>
    );
  }

  return (
    <div className="user-event-detail-container">
      <div className="user-event-detail-card">
        <div className="user-event-detail-header-back">
          <Link to='/' className="back-link">
            <span className="back-arrow">←</span>
            Retourner aux événements
          </Link>
        </div>

        <div className="user-event-detail-content">
          <div className="user-event-detail-visual">
            <div className="image-container">
              {event.image && !imageError ? (
                <img 
                  src={`http://127.0.0.1:8000/storage/${event.image}`} 
                  alt={event.title}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="image-placeholder">
                  <p>Image de l'événement</p>
                </div>
              )}
            </div>
          </div>

          <div className="user-event-detail-info">
            {!isBuying ? (
              <>
                <div className="event-organizer">
                  <span className="organizer-badge">Organisé par</span>
                  <h2 className="organizer-name">{event.organisateur.prenom} {event.organisateur.nom}</h2>
                </div>

                <h1 className="user-event-detail-title">{event.title}</h1>
                <p className="user-event-detail-description">{event.description}</p>

                <div className="price-card">
                  <div className="price-content">
                    <span className="price-label">Prix</span>
                    <span className="price-amount">{event.prix} MAD</span>
                  </div>
                </div>

                <div className="user-event-detail-details-grid">
                  <div className="detail-card">
                    <div className="detail-icon"><MdDateRange /></div>
                    <div className="detail-content">
                      <h4>Date de début des ventes</h4>
                      <p>{formatDate(event.date_debut)}</p>
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-icon"><MdDateRange /></div>
                    <div className="detail-content">
                      <h4>Date de l'événement</h4>
                      <p>{formatDate(event.date_fin)}</p>
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-icon"><IoLocationOutline /></div>
                    <div className="detail-content">
                      <h4>Lieu</h4>
                      <p>{event.lieu}</p>
                    </div>
                  </div>
                </div>

                <div className="action-section">
                  <button className="buy-now-button" onClick={handleBuyNow}>
                    Achetez Maintenant
                  </button>
                </div>
              </>
            ) : (
              <div className="purchase-section">
                <h2 style={{color:"white"}}>Sélectionnez vos billets</h2>
                <div className="counter-price-row">
                  <div className="counter">
                    <button onClick={() => setCount(Math.max(0, count - 1))} style={{color:"white"}}>-</button>
                    <span style={{color:"white"}}>{count}</span>
                    <button onClick={() => setCount(count + 1)} style={{color:"white"}}>+</button>
                  </div>
                  <div className="price">
                    <span style={{color:"white"}} >{event.prix} MAD</span>
                  </div>
                </div>

                <div className="total" style={{color:"white"}}>
                  Total: <strong>{count * event.prix} MAD</strong>
                </div>
                 

                <button
  className="continue-button" style={{color:"#fff"}}
  onClick={() => 
    navigate(`/user/event/${event.id}/checkout`, {
      state: { count } 
    })
  }
>
  Continue
</button>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowUserEventDetail;
