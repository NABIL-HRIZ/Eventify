// src/components/SearchResults.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { MdDateRange } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm.trim()) return;

      setIsLoading(true);
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/search-evenements", {
          params: {
            title: searchTerm,
            lieu: searchTerm
          },
        });

        setResults(res.data.evenements.data || []);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [searchTerm]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!searchTerm) return <p>Veuillez saisir un terme de recherche.</p>;

  return (
    <div className="search-results-page">
      <h2 style={{fontSize:"40px",color:"#fff",padding:"20px"}}>Résultats pour : <strong style={{color:"yellow",textTransform:"capitalize"}}>{searchTerm}</strong></h2>

      {isLoading && <p>Recherche en cours...</p>}

      {!isLoading && results.length === 0 && <p style={{color:"#fff"}}>Aucun événement trouvé.</p>}

      {!isLoading && results.length > 0 && (
        <div className="all-eventss-grid" style={{padding:"20px"}}>
          {results.map((event) => (
            <Link
              to={`/user/event/${event.id}`}
              key={event.id}
              style={{ textDecoration: "none" }}
            >
              <div className="event-card">
                <div className="event-image">
            
                 <img 
  src={event.image ? `http://127.0.0.1:8000${event.image}` : 'https://images.unsplash.com/...'} 
  alt={event.title}
  onError={(e) => {
    e.target.src = 'https://images.unsplash.com/...';
  }}
/>

                  
                </div>
                <div className="event-content">
                  <h3 className="event-title">{event.title}</h3>
                  <div className="event-details">
                   <div className="detail-item">
                                       <span className="detail-icon" style={{color:'white',fontSize:"20px",marginTop:"-15px"}}><MdDateRange /></span>
                                       <div className="detail-info">
                                         <span className="detaill-value">{formatDate(event.date_fin)}</span>
                                       </div>
                                     </div>
                    <div className="detail-item">
                                        <span className="detail-icon" style={{color:'white',fontSize:"20px",marginTop:"-15px"}}><MdDateRange /></span>
                                        <div className="detail-info">
                                          <span className="detaill-value">{event.lieu}</span>
                                        </div>
                                      </div>
                    <div className="detail-item">
                      <span className="detailll-value" style={{color:'#fff',fontSize:"20px",fontWeight:"bold",marginLeft:"30px"}}>{event.prix} MAD</span>
                      
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;