import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ShowAllEvents.css';
import { MdDateRange } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
const ShowAllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/evenements')
      .then(res => {
        setEvents(res.data.evenements || res.data); 
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  ;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <div className="header-content">
          <h1>Tous les Événements</h1>
          <p>Découvrez tous les événements disponibles</p>
        </div>
      </div>


        <div className="all-events-grid">
          {events.map(event => (
            <Link to={`/user/event/${event.id}`} style={{textDecoration:"none"}}>
                        <div key={event.id} className="event-card">
              <div className="event-image">
                <img
                  src={`http://localhost:8000/storage/${event.image}`}
                  alt={event.title}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                  }}
                />
              </div>

              <div className="event-content">
               
               

                <div className="event-details">
                  
         <h3 className="event-title" style={{marginBottom:"10px"}}>{event.title} </h3>
                  <div className="detail-item">
                    <span className="detail-icon" style={{color:'white',fontSize:"20px",marginTop:"-10px"}}><MdDateRange /></span>
                    <div className="detail-info">
                      <span className="detail-value">{formatDate(event.date_fin)}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <span className="detail-icon" style={{color:'white',fontSize:"20px",marginTop:"-10px"}}><IoLocationOutline /></span>
                    <div className="detail-info">
                      <span className="detail-value">{event.lieu}</span>
                    </div>
                  </div>

                   <div className="detail-item">
                    <div className="detail-info">
                      <span className="detail-value" style={{color:'#fff',fontSize:"15px",fontWeight:"bold",marginLeft:"25px"}}>{event.prix} MAD</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            </Link>

          ))}
        </div>
      
    </div>
  );
};

export default ShowAllEvents;