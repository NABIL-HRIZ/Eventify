import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import OrganisateurSideBar from "./OrganisateurSideBar";
import '../styles/EventDetail.css';
import { IoLocationOutline } from "react-icons/io5";
import { MdDateRange } from "react-icons/md";


const EventDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

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

  const handleEdit = () => {
    navigate(`/organisateur/edit-event/${id}`);
  };

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

 

  if (loading) {
    return (
      <>
        <OrganisateurSideBar />
        <div className="event-detail-loading">
          <div className="loading-spinner"></div>
          <p>Chargement des détails de l'événement...</p>
        </div>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <OrganisateurSideBar />
        <div className="event-detail-error">
          <div className="error-icon"></div>
          <h3>Événement non trouvé</h3>
          <p>L'événement que vous recherchez n'existe pas ou a été supprimé.</p>
          <button onClick={handleBack} className="back-btn">
            Retour aux événements
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <OrganisateurSideBar />
      <div className="event-detail-container">
        <div className="event-detail-card">
          <div className="event-detail-header">
            
            <div className="header-actions">
              <button onClick={handleEdit} className="edit-button">
                 Modifier l'événement
              </button>
            </div>
          </div>

          <div className="event-detail-content">
            <div className="event-detail-info">
              

              <h1 className="event-detail-title" style={{color:"white"}}>{event.title}</h1>
              <p className="event-detail-description">{event.description}</p>

              <div className="detail-card">
                  
                  <div className="detail-content">
                    <p style={{fontSize:"24px",color:"#B6771D",border:"2px solid gray",padding:"10px",borderRadius:"15px"}}>{event.prix} MAD</p>
                  </div>
                </div>

              <div className="event-detail-details-grid">
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

             
            </div>

            <div className="event-detail-visual">
              <div className="image-container">
                {event.image && !imageError ? (
                  <img 
                    src={`http://127.0.0.1:8000/storage/${event.image}`} 
                    alt={event.title}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="image-placeholder">
                    <span></span>
                    <p>Image de l'événement</p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="quick-stats">
                <div className="stat">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Billets vendus</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{event.views}</span>
                  <span className="stat-label">Vues</span>
                </div>
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetail;