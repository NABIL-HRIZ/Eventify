import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FaTachometerAlt, 
  FaUser, 
  FaPlus, 
  FaCalendarAlt, 
  FaTrash, 
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/OrganisateurSideBar.css';

const AdminSideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://127.0.0.1:8000/api/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.data.success) {
          setUser(res.data.user);
        }
      })
      .catch(err => {
        console.error("Erreur user connecté", err);
      });
    }
  }, []);

const menuItems = [
  { icon: <FaTachometerAlt />, label: 'Dashboard Accueil', path: '/admin' },
  { icon: <FaUser />, label: 'Mes Informations', path: '/admin/profile' },
  { icon: <FaPlus />, label: 'Créer Utilisateur', path: '/admin/create-user' },
  { icon: <FaUser />, label: 'Toutes Utilisateurs', path: '/admin/users' },
  { icon: <FaPlus />, label: 'Créer Événement', path: '/admin/create-event' },
  { icon: <FaCalendarAlt />, label: 'Toutes Événements', path: '/admin/events' },
  { icon: <FaSignOutAlt />, label: 'Se Déconnecter', path: '/logout' }
];


  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://127.0.0.1:8000/api/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error("Erreur logout:", error);
    }
  };



  const handleNavigation = (path) => {
    if (path === '/logout') {
      handleLogout();
    } else if (path === '/organisateur/delete-account') {
      handleDeleteAccount();
    } else {
      navigate(path);
    }
  };

  return (
    <div className={`organisateur-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
    
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="sidebar-title">
            <h2 style={{textTransform:"uppercase"}}>{user ? `${user.prenom} ${user.nom}` : 'Chargement...'}</h2>
          </div>
        )}
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`nav-item ${item.label === 'Supprimer Compte' || item.label === 'Se Déconnecter' ? 'danger' : ''}`}
            onClick={() => handleNavigation(item.path)}
          >
            <div className="nav-icon">{item.icon}</div>
            {!isCollapsed && <span className="nav-label">{item.label}</span>}
          </div>
        ))}
      </nav>

      
    </div>
  );
};

export default AdminSideBar;
