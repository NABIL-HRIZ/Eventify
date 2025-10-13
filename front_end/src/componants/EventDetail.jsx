import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import OrganisateurSideBar from "./OrganisateurSideBar";
import '../styles/EventDetail.css';
import { IoLocationOutline } from "react-icons/io5";
import { MdDateRange } from "react-icons/md";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const EventDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/evenement/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error("Erreur lors du fetch de l'événement :", error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les détails de l\'événement',
          background: '#1a1a2e',
          color: 'white',
          confirmButtonColor: '#FFD700',
          confirmButtonText: 'OK'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleEdit = () => {
    navigate(`/organisateur/edit-event/${id}`);
  };

  const handleDelete = async () => {
    // SweetAlert confirmation dialog
    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action est irréversible! L'événement sera définitivement supprimé.",
      icon: 'warning',
      background: '#1a1a2e',
      color: 'white',
      iconColor: '#ffcc00',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler',
      customClass: {
        popup: 'custom-swal-popup'
      }
    });

    if (result.isConfirmed) {
      setDeleteLoading(true);
      
      try {
        const token = localStorage.getItem("token"); 
        await axios.delete(`http://127.0.0.1:8000/api/evenement/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Success SweetAlert
        Toast.fire({
          icon: 'success',
          title: 'Événement supprimé avec succès!',
          iconColor: '#00ff7f'
        });

        // Navigate after a short delay to show the success message
        setTimeout(() => {
          navigate('/admin/events');
        }, 1500);

      } catch (error) {
        console.error("Erreur lors de la suppression de l'événement :", error);
        
        // Error SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error.response?.data?.message || 'Erreur lors de la suppression de l\'événement',
          background: '#1a1a2e',
          color: 'white',
          confirmButtonColor: '#FFD700',
          confirmButtonText: 'OK'
        });
      } finally {
        setDeleteLoading(false);
      }
    }
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
          <div className="error-icon">❌</div>
          <h3>Événement non trouvé</h3>
          <p>L'événement que vous recherchez n'existe pas ou a été supprimé.</p>
          <button 
            onClick={() => navigate('/admin/events')} 
            className="back-button"
          >
            ← Retour aux événements
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
            <div className="user-event-detail-header-back">
              <Link to='/admin/events' className="back-link">
                <span className="back-arrow">←</span>
                Retourner aux événements
              </Link>
            </div>
            
            <div className="action-buttons">
              <button onClick={handleEdit} className="edit-button">
                 Modifier l'événement
              </button>

              <button 
                
                onClick={handleDelete} 
                className="delete-button"
                style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <span className="spinner"></span>
                    Suppression...
                  </>
                ) : (
                  ' Supprimer l\'événement'
                )}
              </button>
            </div>
          </div>

          <div className="event-detail-content">
            <div className="event-detail-info">
              <h1 className="event-detail-title" style={{color:"white"}}>{event.title}</h1>
              <p className="event-detail-description">{event.description}</p>

              <div className="detail-card">
                <div className="detail-content">
                  <p style={{fontSize:"40px",fontWeight:"bold",color:"#B0CE88"}}>{event.prix} MAD</p>
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

              <div className="quick-stats">
                <div className="stat">
                  <span className="stat-number">{event.views || 0}</span>
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