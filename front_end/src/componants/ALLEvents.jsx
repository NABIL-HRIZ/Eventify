// src/components/AllEvents.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AllEvents.css";
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

        setEvents(response.data.evenements);
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
        <div className="events-loading-section">
          <div className="events-loading-spinner"></div>
          <p>Chargement de vos événements...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminSideBar />

      <div className="events-container">
        <div className="events-header">
          <div className="events-header-info">
            <h1>Tous les Événements</h1>
            <p>Gérez et visualisez tous les événements créés</p>
          </div>

          <div className="events-stats">
            <div className="events-stat-card">
              <span className="events-stat-number">{events.length}</span>
              <span className="events-stat-label">Événements Totaux</span>
            </div>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="events-empty-section">
            <h3>Aucun événement trouvé</h3>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="events-card">
                <div className="events-card-image">
                  {event.image ? (
                    <img
                      src={`http://127.0.0.1:8000/storage/${event.image}`}
                      alt={event.title}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x200/667eea/ffffff?text=Event+Image";
                      }}
                    />
                  ) : (
                    <div className="events-image-placeholder">
                      <span>🎭</span>
                    </div>
                  )}
                </div>

                <div className="events-card-content">
                  <h3 className="events-title">{event.title}</h3>

                  <div className="events-details">
                    <div className="events-detail-item">
                      <MdDateRange className="events-detail-icon" />
                      <span className="events-detail-value">
                        {new Date(event.date_fin).toLocaleDateString("fr-FR", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="events-detail-item">
                      <IoLocationOutline className="events-detail-icon" />
                      <span className="events-detail-value">{event.lieu}</span>
                    </div>

                    <div className="events-detail-item">
                      <span className="events-detail-value events-price">
                        {event.prix} MAD
                      </span>
                    </div>
                  </div>

                  <div className="events-actions">
                    <Link
                      className="events-btn-view"
                      to={`/admin/event/${event.id}`}
                      style={{ textDecoration: "none", textAlign: "center" }}
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
