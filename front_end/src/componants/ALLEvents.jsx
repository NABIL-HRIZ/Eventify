import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/AllEvents.css';
import { MdDateRange } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";


const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
       const response = await axios.get("http://127.0.0.1:8000/api/evenements", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

setEvents(response.data); 

      } catch (error) {
        console.error("Erreur lors du fetch des événements :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

 


  if (loading) {
    return (
      <>
        <AdminSideBar />
        <div className="all-events-loading">
          <div className="loading-spinner"></div>
          <p>Chargement de vos événements...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminSideBar />

      <div className="show-all-events-container">
        <div className="all-events-header">
          <div className="header-content">
            <h1>Toutes Événements</h1>
            <p>Gérez et visualisez tous événements créés</p>
          </div>
          
          
          <div className="all-events-stats">
            <div className="stat-card">
              <span className="stat-number">{events.length}</span>
              <span className="stat-label">Événements Totaux</span>
            </div>
          </div>
        </div>

        
       
        {events.length === 0 ? (
          <div className="no-all-events">
            
            <h3>Aucun événement trouvé</h3>
            <p>
           
            </p>
          </div>
        ) : (
          <div id="organisateur-show-all-events"  className="all-events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                {/* Event Image */}
                <div className="event-image">
                  {event.image ? (
                    <img 
                      src={`http://127.0.0.1:8000/storage/${event.image}`} 
                      alt={event.title}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200/667eea/ffffff?text=Event+Image';
                      }}
                    />
                  ) : (
                    <div className="image-placeholder">
                      <span>🎭</span>
                    </div>
                  )}
                  
                </div>

                {/* Event Content */}
                <div className="event-content">
                  <h3 className="event-title">{event.title}</h3>
                  

                  <div className="event-details">
    

<div className="detail-item">
  <MdDateRange className="detail-icon" />
  <span className="detail-value">
    {new Date(event.date_fin).toLocaleDateString('fr-FR', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
  </span>
</div>

<div className="detail-item">
  <IoLocationOutline className="detail-icon" />
  <span className="detail-value">{event.lieu}</span>
</div>

<div className="detail-item">
  <span className="detail-value price">{event.prix} MAD</span>
</div>

            
                  </div>

                  <div className="event-actions">
                     <Link 
  className="action-btn view-btn" 
  to={`/admin/event/${event.id}`}
  style={{textDecoration:'none',textAlign:"center"}}
>
  Voir Détails
</Link>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AllEvents;