import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdDateRange } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";




const CategoryPages = () => {
  const { category } = useParams();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchCategoryEvents = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/evenements?categorie=${category}`);
        setEvents(res.data.evenements);
      } catch (error) {
        console.error("Error fetching category events:", error);
      }
    };

    fetchCategoryEvents();
  }, [category]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="category-page">
      <h2 style={{fontSize:"40px",color:"#fff",padding:"20px",marginBottom:"20px"}}>Événements de la catégorie: <strong style={{color:"#FF9D00",textTransform:"uppercase"}}>{category}</strong></h2>
     <div className="all-eventss-grid">
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
                  
         <h3 className="event-tittle" >{event.title} </h3>
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

export default CategoryPages;
