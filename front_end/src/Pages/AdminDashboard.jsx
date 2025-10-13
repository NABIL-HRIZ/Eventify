import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSideBar from '../componants/AdminSideBar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, organisateurs: 0, admins: 0 });
  const [eventData, setEventData] = useState([]);
  const [ticketStats, setTicketStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:8000/api/show-users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allUsers = res.data;
        const counts = { users: 0, organisateurs: 0, admins: 0 };

        allUsers.forEach((u) => {
          if (u.role.includes('user')) counts.users++;
          if (u.role.includes('organisateur')) counts.organisateurs++;
          if (u.role.includes('admin')) counts.admins++;
        });

        setStats(counts);
      } catch (err) {
        console.error('Error fetching user stats:', err);
      }
    };

    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/evenements');
        const allEvents = res.data.evenements || res.data;

        const categories = ['sport', 'cinema', 'billetterie'];
        const categoryCounts = categories.map((cat) => ({
          name: cat.charAt(0).toUpperCase() + cat.slice(1),
          count: allEvents.filter((e) => e.categorie?.toLowerCase() === cat).length,
        }));

        setEventData(categoryCounts);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    const fetchTicketsStats = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await axios.get('http://127.0.0.1:8000/api/tickets-stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setTicketStats(res.data.data);
      } catch (err) {
        console.error('Error fetching ticket stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    fetchEvents();
    fetchTicketsStats();
  }, []);

  if (loading) {
    return (
      <>
        <AdminSideBar />
        <div className="admin-dashboard">
          <div className="loading-spinner">Chargement...</div>
        </div>
      </>
    );
  }

  const maxTickets = Math.max(...ticketStats.map((t) => t.tickets), 1);

  return (
    <>
      <AdminSideBar />
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Tableau de Bord Administrateur</h1>
          <p>Vue d'ensemble sur les utilisateurs et les statistiques des ventes</p>
        </div>

         <div className="progress-section">
          <h2 style={{ color: "#fff", marginBottom: "1rem" }}>Ventes de Tickets par Catégorie</h2>
          {ticketStats.map((t, i) => (
            <div key={i} className="progress-bar-container">
              <div className="progress-label" style={{marginTop:"20px"}} >
                <span style={{fontSize:"20px",color:"#fff"}}>{t.categorie}</span>
                <span style={{fontSize:"20px",color:"gray",marginLeft:"400px"}}>{t.tickets} tickets — {t.revenue} MAD</span>
              </div>
              <div className="progress" style={{marginTop:"20px"}}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${(t.tickets / maxTickets) * 100}%`,
                    backgroundColor: i === 0 ? '#B87C4C' : i === 1 ? '#A8BBA3' : '#9A3F3F'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

      
        <div className="chart-section" style={{"marginTop":"50px"}}>
          <h2 style={{ color: "#fff" }}>Événements par catégorie</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#FFCF71" barSize={50} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

  <div className="stats-grid" style={{"marginTop":"50px"}}>
          <div className="stat-card user-card">
            <h3>Utilisateurs</h3>
            <p className="stat-number">{stats.users}</p>
            <div className="card-footerr">Utilisateurs inscrits</div>
          </div>

          <div className="stat-card organisateur-card">
            <h3>Organisateurs</h3>
            <p className="stat-number">{stats.organisateurs}</p>
            <div className="card-footerr">Organisateurs actifs</div>
          </div>

          <div className="stat-card admin-card">
            <h3>Administrateurs</h3>
            <p className="stat-number">{stats.admins}</p>
            <div className="card-footerr" style={{ color: "#000" }}>
              Administrateurs système
            </div>
          </div>
        </div>
       
      </div>
    </>
  );
};

export default AdminDashboard;
