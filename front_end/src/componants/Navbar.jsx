import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";
import { FaBars } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import mar_flag from '../assets/mar.jpg';
import appStore from '../assets/app-store.webp';
import playStore from '../assets/play-store.jpg';
import '../styles/Navbar.css';

function MyNavbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Erreur logout:", err);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="modern-navbar">
      <div className="nav-container">
        <Link className="navbar-brand-modern" to="/">
          <span className="brand-text">Eventify</span>
        </Link>

        <div className="nav-center">
          <Link className="nav-link-modern" to="/about" onClick={closeDropdown}>
            Qui Sommes Nous ?
          </Link>
          <Link className="nav-link-modern" to="/faq" onClick={closeDropdown}>
            FAQ
          </Link>
          <span className="nav-link-modern flag-link">
            <img src={mar_flag} alt="Maroc flag" className="flag-img"/>
          </span>
          <Link className="nav-link-modern cart-link" to="/cart" onClick={closeDropdown}>
            <IoCartOutline className="cart-icon"/>
            <span className="cart-badge">0</span>
          </Link>
        </div>

        <div className="nav-right">
          <div className={`dropdown-container ${isDropdownOpen ? 'active' : ''}`}>
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              <div className="dropdown-toggle-content">
                <FaBars className="dropdown-icon"/>
                {user && (
                  <span className="user-avatar">
                    {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                  </span>
                )}
              </div>
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu show">
                {user ? (
                  <>
                    <div className="dropdown-user-info">
                      <div className="user-avatar-large">
                        {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                      </div>
                      <div className="user-details">
                        <div className="user-name">{user.prenom} {user.nom}</div>
                        <div className="user-email">{user.email}</div>
                        <div className="user-role-badge">{user.role}</div>
                      </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>

                    {/* Dynamic role-based menu */}
                    {user.role === "admin" && (
                      <>
                        <Link to="/admin" className="dropdown-item-modern" onClick={closeDropdown}>
                          <div className="menu-item-icon"></div>
                          Tableau de bord admin
                        </Link>
                        <Link to="/admin/users" className="dropdown-item-modern" onClick={closeDropdown}>
                          <div className="menu-item-icon">👥</div>
                          Gérer les utilisateurs
                        </Link>
                        <Link to="/admin/events" className="dropdown-item-modern" onClick={closeDropdown}>
                          <div className="menu-item-icon"></div>
                          Gérer les événements
                        </Link>
                      </>
                    )}

                    {user.role === "organisateur" && (
                      <>
                        <Link to="/organisateur/profile" className="dropdown-item-modern" onClick={closeDropdown}>
                          <div className="menu-item-icon"></div>
                          Mes informations
                        </Link>
                        <Link to="/organisateur/create-event" className="dropdown-item-modern" onClick={closeDropdown}>
                          <div className="menu-item-icon"></div>
                          Ajouter un événement
                        </Link>
                        <Link to="/organisateur/events" className="dropdown-item-modern" onClick={closeDropdown}>
                          <div className="menu-item-icon"></div>
                          Mes Événements
                        </Link>
                        
                      </>
                    )}

                    {user.role === "user" && (
                      <>
                        <Link to="/user/profile" className="dropdown-item-modern" onClick={closeDropdown}>
                          <div className="menu-item-icon">👤</div>
                          Mon profil
                        </Link>
                        <Link to="/user/tickets" className="dropdown-item-modern" onClick={closeDropdown}>
                          <div className="menu-item-icon"></div>
                          Mes tickets
                        </Link>
                        <Link to="/user/favorites" className="dropdown-item-modern" onClick={closeDropdown}>
                          <div className="menu-item-icon"></div>
                          Mes favoris
                        </Link>
                        <Link to="/user/reservations" className="dropdown-item-modern" onClick={closeDropdown}>
                          <div className="menu-item-icon"></div>
                          Mes réservations
                        </Link>
                      </>
                    )}

                    <div className="dropdown-divider"></div>
                    
                    <button onClick={handleLogout} className="dropdown-item-logout">
                      <div className="menu-item-icon"></div>
                      Se déconnecter
                    </button>

                    <div className="dropdown-divider"></div>
                    
                    <div className="dropdown-footer">
                      <h5 className="footer-title">Télécharger L'application</h5>
                      <div className="app-download-buttons">
                        <img src={appStore} alt="App Store" className="app-download-img" />
                        <img src={playStore} alt="Play Store" className="app-download-img" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="dropdown-item-modern" onClick={closeDropdown}>
                      <div className="menu-item-icon">🔑</div>
                      Se connecter
                    </Link>
                    <Link to="/register" className="dropdown-item-modern" onClick={closeDropdown}>
                      <div className="menu-item-icon">📝</div>
                      Inscription
                    </Link>
                    <div className="dropdown-divider"></div>
                    <Link to="/refund-policy" className="dropdown-item-modern" onClick={closeDropdown}>
                      <div className="menu-item-icon">📄</div>
                      Politique de remboursement
                    </Link>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-footer">
                      <h5 className="footer-title">Télécharger L'application</h5>
                      <div className="app-download-buttons">
                        <img src={appStore} alt="App Store" className="app-download-img" />
                        <img src={playStore} alt="Play Store" className="app-download-img" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button className="mobile-menu-btn" onClick={toggleDropdown}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isDropdownOpen && <div className="dropdown-overlay" onClick={closeDropdown}></div>}
    </nav>
  );
}

export default MyNavbar;