import React, { useEffect, useState } from "react";
import axios from "axios";
import OrganisateurSideBar from "./OrganisateurSideBar";
import '../styles/ShowEvents.css';
import { MdDateRange } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { Link } from "react-router-dom";


const ShowEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/api/evenement-personnels", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setEvents(response.data.evenements);
        }
      } catch (error) {
        console.error("Erreur lors du fetch des événements :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events by category
  const filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(event => event.categorie === selectedCategory);

  // Get unique categories for filter
  const categories = ['all', ...new Set(events.map(event => event.categorie))];

  if (loading) {
    return (
      <>
        <OrganisateurSideBar />
        <div className="events-loading">
          <div className="loading-spinner"></div>
          <p>Chargement de vos événements...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <OrganisateurSideBar />

      <div className="show-events-container">
        <div className="events-header">
          <div className="header-content">
            <h1>Mes Événements</h1>
            <p>Gérez et visualisez tous vos événements créés</p>
          </div>
          
          
          <div className="events-stats">
            <div className="stat-card">
              <span className="stat-number">{events.length}</span>
              <span className="stat-label">Événements Totaux</span>
            </div>
          </div>
        </div>

        
       
        {filteredEvents.length === 0 ? (
          <div className="no-events">
            
            <h3>Aucun événement trouvé</h3>
            <p>
              {selectedCategory === 'all' 
                ? "Vous n'avez pas encore créé d'événements." 
                : `Aucun événement dans la catégorie ${selectedCategory}.`
              }
            </p>
          </div>
        ) : (
          <div id="organisateur-show-events"  className="events-grid">
            {filteredEvents.map((event) => (
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
                      <span className="detail-icon" style={{color:"gray"}}><MdDateRange /></span>
                      <div className="detail-info">
                        
                        <span className="detail-value">
                          {new Date(event.date_fin).toLocaleDateString('fr-FR', {
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
                      <span className="detail-icon" style={{color:"gray"}}><IoLocationOutline/></span>

                      <div className="detail-info">
                        <span className="detail-value"> {event.lieu}</span>
                      </div>
                    </div>

                    <div className="detail-item">
                      
                      <div className="detail-info">
                        <span className="detail-value price">{event.prix} MAD</span>
                      </div>
                    </div>
                  </div>

                  <div className="event-actions">
                     <Link 
  className="action-btn view-btn" 
  to={`/event/${event.id}`}
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

export default ShowEvents;