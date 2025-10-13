import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import { setPurchasedEvents } from "../slices/UserSlice";
import { 
  FaTicketAlt, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaMoneyBillWave,
  FaDownload,
  FaShare
} from 'react-icons/fa';
import '../styles/Cart.css';

function extractTickets(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.data)) return res.data.data;
  if (Array.isArray(res.data?.tickets)) return res.data.tickets;
  return [];
}

const Cart = () => {
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const purchasedEvents = useSelector((state) => state.user.purchasedEvents);

  useEffect(() => {
    if (user) {
      axios.get(`http://127.0.0.1:8000/api/user/${user.id}/tickets`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }).then(res => {
        const tickets = extractTickets(res.data);
        dispatch(setPurchasedEvents(tickets));
      });
    }
  }, [user, dispatch]);

  const handleDownloadTicket = async (ticketId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/verify-ticket/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-${ticketId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading ticket:', error);
    }
  };

  const handleShareTicket = (ticket) => {
    if (navigator.share) {
      navigator.share({
        title: `Ticket pour ${ticket.evenement.title}`,
        text: `Rejoignez-moi à ${ticket.evenement.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`Ticket pour ${ticket.evenement.title}`);
      alert('Lien copié dans le presse-papier !');
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

  if (!user) {
    return (
      <div className="cart-auth-required">
        <div className="cart-auth-message">
          <FaTicketAlt className="cart-auth-icon" />
          <h2>Connectez-vous pour voir vos tickets</h2>
          <p>Veuillez vous connecter pour accéder à vos billets et événements</p>
          <button 
            className="cart-auth-button"
            onClick={() => window.location.href = '/login'}
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-wrapper">
      {/* Header */}
      <div className="cart-header">
        <div className="cart-header-content">
          <div className="cart-header-title">
            <FaTicketAlt className="cart-header-icon" />
            <h1>Mes Billets</h1>
          </div>
          <p className="cart-header-subtitle">
            Gérez et accédez à tous vos billets d'événements
          </p>
        </div>
        {purchasedEvents.length > 0 && (
          <div className="cart-ticket-count">
            <span className="cart-count-number">{purchasedEvents.length}</span>
            <span className="cart-count-label">billet{purchasedEvents.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Body */}
      {purchasedEvents.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon-wrap">
            <FaTicketAlt className="cart-empty-icon" />
          </div>
          <h2>Aucun billet acheté</h2>
          <p>Vous n'avez pas encore acheté de billets pour des événements</p>
          <button 
            className="cart-explore-btn"
            onClick={() => window.location.href = '/'}
          >
            Explorer les événements
          </button>
        </div>
      ) : (
        <div className="cart-tickets-grid">
          {purchasedEvents.map(ticket => (
            <div key={ticket.id} className="cart-ticket-card">
              <div className="cart-ticket-header">
                <div className="cart-event-image">
                  {ticket.evenement?.image ? (
                    <img 
                      src={`http://127.0.0.1:8000/storage/${ticket.evenement.image}`} 
                      alt={ticket.evenement.title}
                    />
                  ) : (
                    <div className="cart-image-placeholder">
                      <FaTicketAlt />
                    </div>
                  )}
                </div>
                <div className="cart-badge-wrap">
                  <span className="cart-badge cart-badge-confirmed">
                    Confirmé
                  </span>
                </div>
              </div>

              <div className="cart-ticket-content">
                <h3 className="cart-event-title">{ticket.evenement?.title || 'Événement'}</h3>
                <div className="cart-event-details">
                  <div className="cart-detail-item">
                    <FaCalendarAlt className="cart-detail-icon" />
                    <div className="cart-detail-content">
                      <span className="cart-detail-label">Date</span>
                      <span className="cart-detail-value">
                        {ticket.evenement?.date_fin ? formatDate(ticket.evenement.date_fin) : 'Non spécifiée'}
                      </span>
                    </div>
                  </div>

                  <div className="cart-detail-item">
                    <FaMapMarkerAlt className="cart-detail-icon" />
                    <div className="cart-detail-content">
                      <span className="cart-detail-label">Lieu</span>
                      <span className="cart-detail-value">
                        {ticket.evenement?.lieu || 'Non spécifié'}
                      </span>
                    </div>
                  </div>

                  <div className="cart-detail-item">
                    <FaMoneyBillWave className="cart-detail-icon" />
                    <div className="cart-detail-content">
                      <span className="cart-detail-label">Prix total</span>
                      <span className="cart-detail-value cart-price">
                        {ticket.amount * ticket.quantity} MAD
                      </span>
                    </div>
                  </div>
                </div>

                <div className="cart-ticket-info">
                  <div className="cart-quantity-badge">
                    <span className="cart-quantity-number">{ticket.quantity}</span>
                    <span className="cart-quantity-label">billet{ticket.quantity > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              <div className="cart-ticket-actions">
                <button 
                  className="cart-btn-primary"
                  onClick={() => handleDownloadTicket(ticket.id)}
                >
                  <FaDownload /> Télécharger
                </button>
                <button 
                  className="cart-btn-secondary"
                  onClick={() => handleShareTicket(ticket)}
                >
                  <FaShare /> Partager
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
