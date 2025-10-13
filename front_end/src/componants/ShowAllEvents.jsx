import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ShowAllEvents.css';
import { MdDateRange } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

const ShowAllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Fetch events with optional page
  const fetchEvents = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/evenements?paginate=1&page=${page}`);
      
      // Gestion compatibilité : pagination ou ancien tableau
      const eventsData = res.data.data || res.data.evenements || [];
      setEvents(eventsData);

      setCurrentPage(res.data.current_page || 1);
      setLastPage(res.data.last_page || 1);

    } catch (err) {
      console.error('Erreur fetching events:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= lastPage) {
      fetchEvents(page);
    }
  };

  if (loading) {
    return (
      <div className="all-events-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des événements...</p>
      </div>
    );
  }

  return (
    <div className="all-events-container">
      <div className="all-events-header">
        <div className="headerr-content">
          <h1>Tous les Événements</h1>
          <p>Découvrez tous les événements disponibles</p>
        </div>
      </div>

      <div className="all-eventss-grid">
        {events.map(event => (
          <Link to={`/user/event/${event.id}`} style={{textDecoration:"none"}} key={event.id}>
            <div className="event-card">
              <div className="event-image">
                <img
                  src={`http://127.0.0.1:8000/storage/${event.image}`}
                  alt={event.title}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                  }}
                />
              </div>

              <div className="event-content">
                <div className="event-details">
                  <h3 className="event-tittle">{event.title}</h3>

                  <div className="detail-item">
                    <span className="detail-icon" style={{color:'white',fontSize:"20px",marginTop:"-15px"}}><MdDateRange /></span>
                    <div className="detail-info">
                      <span className="detaill-value">{formatDate(event.date_fin)}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <span className="detail-icon" style={{color:'white',fontSize:"20px",marginTop:"-15px"}}><IoLocationOutline /></span>
                    <div className="detail-info">
                      <span className="detaill-value">{event.lieu}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-info">
                      <span className="detailll-value" style={{color:'#fff',fontSize:"20px",fontWeight:"bold",marginLeft:"30px"}}>{event.prix} MAD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Précédent</button>
        <span>{currentPage} / {lastPage}</span>
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === lastPage}>Suivant</button>
      </div>
    </div>
  );
};

export default ShowAllEvents;
