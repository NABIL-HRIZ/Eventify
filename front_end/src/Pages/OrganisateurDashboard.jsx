import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrganisateurSideBar from '../componants/OrganisateurSideBar';
import '../styles/OrganisateurDashboard.css';

const OrganisateurDashboard = () => {
  const [events, setEvents] = useState([]);
  const [counts, setCounts] = useState({ sport: 0, cinema: 0, billetterie: 0 });
  const [loading, setLoading] = useState(true);
const [ticketsData, setTicketsData] = useState({ totalTickets: 0, totalRevenue: 0 });


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:8000/api/evenement-personnels', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const eventsData = res.data.evenements || res.data.data || [];
        setEvents(eventsData);

        const countsObj = { sport: 0, cinema: 0, billetterie: 0 };
        eventsData.forEach(event => {
          if (countsObj[event.categorie] !== undefined) {
            countsObj[event.categorie]++;
          }
        });
        setCounts(countsObj);

      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);



useEffect(() => {
  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:8000/api/organisateur/tickets-sold', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if(res.data.success) {
        setTicketsData({
          totalTickets: res.data.totalTickets,
          totalRevenue: res.data.totalRevenue
        });
      }
    } catch(err) {
      console.error(err);
    }
  };

  fetchTickets();
}, []);


  if (loading) {
    return (
      <>
        <OrganisateurSideBar />
        <div className='dashboard-acceil'>
          <div className="loading-spinner" style={{color:"#fff"}}>Chargement...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <OrganisateurSideBar />
      <div className='dashboard-acceil'>
        <div className="dashboard-header">
          <h1>Tableau de Bord Organisateur</h1>
          <p>Bienvenue dans votre espace de gestion d'événements</p>
        </div>

       <div className='card-stats-infos' style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
  <div className='card'>
    <h3>Tickets Sold</h3>
    <p>{ticketsData.totalTickets}</p>
  </div>
  <div className='card'>
    <h3>Total Revenue</h3>
    <p>{ticketsData.totalRevenue} DH</p>
  </div>
</div>

        
        <div className='stats-section'>
          <h2>Statistiques par Catégorie</h2>
          <div className='card-stats-infos'>
            <div className='stat-card-infos sport-card'>
              <h3>Événements Sport</h3>
              <p className="stat-number">{counts.sport}</p>
              <div className="card-footer">Événements créés</div>
            </div>
            
            <div className='stat-card-infos cinema-card'>
              <h3>Événements Cinéma</h3>
              <p className="stat-number">{counts.cinema}</p>
              <div className="card-footer">Événements créés</div>
            </div>
            
            <div className='stat-card-infos billetterie-card'>
              <h3>Événements Billetterie</h3>
              <p className="stat-number">{counts.billetterie}</p>
              <div className="card-footer">Événements créés</div>
            </div>
          </div>
        </div>

        
      </div>
    </>
  );
};

export default OrganisateurDashboard;