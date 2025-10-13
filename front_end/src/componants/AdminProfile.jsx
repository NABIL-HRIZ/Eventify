import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSideBar from './AdminSideBar';
import '../styles/UserProfile.css';
import Swal from 'sweetalert2';

const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    phone: '',
    email: ''
  });

  // Configure SweetAlert2 theme for dark background
  const Toast = Swal.mixin({
    background: '#1a1a2e',
    color: 'white',
    iconColor: '#FFD700',
    confirmButtonColor: '#FFD700',
    cancelButtonColor: '#6c757d',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        setUser(response.data.user);
        setFormData({
          prenom: response.data.user.prenom,
          nom: response.data.user.nom,
          phone: response.data.user.phone,
          email: response.data.user.email
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Erreur lors du chargement du profil');
      
      // SweetAlert for error
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors du chargement du profil',
        background: '#1a1a2e',
        color: 'white',
        confirmButtonColor: '#FFD700',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://127.0.0.1:8000/api/user/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        setUser(response.data.user);
        setIsEditing(false);
        
        // SweetAlert for success
        Toast.fire({
          icon: 'success',
          title: 'Profil mis à jour avec succès!',
          iconColor: '#00ff7f'
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Erreur lors de la mise à jour du profil');
      
      // SweetAlert for error
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la mise à jour du profil',
        background: '#1a1a2e',
        color: 'white',
        confirmButtonColor: '#FFD700',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      prenom: user.prenom,
      nom: user.nom,
      phone: user.phone,
      email: user.email
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <>
        <AdminSideBar />
        <div className="user-profile-loading">
          <div className="loading-spinner"></div>
          <p>Chargement de votre profil...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AdminSideBar />
        <div className="user-profile-error">
          <div className="error-icon"></div>
          <h3>Erreur</h3>
          <p>{error}</p>
          <button onClick={fetchUserProfile} className="retry-btn">
            Réessayer
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminSideBar />
      <div className="user-profile-container">
        <div className="user-profile-card">
          <div className="profile-header">
            
            <div className="profile-title">
              <h1>Mon Profil</h1>
              <p>Gérez vos informations personnelles</p>
            </div>
            <button 
              className={`editt-btn ${isEditing ? 'editing' : ''}`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Annuler' : 'Modifier'}
            </button>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="prenom">Prénom</label>
                {isEditing ? (
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                ) : (
                  <div className="form-display">{user.prenom}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="nom">Nom</label>
                {isEditing ? (
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                ) : (
                  <div className="form-display">{user.nom}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                ) : (
                  <div className="form-display">{user.email}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Téléphone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                ) : (
                  <div className="form-display">{user.phone}</div>
                )}
              </div>

             

              <div className="form-group">
                <label>Date d'inscription</label>
                <div className="form-display">
                  {new Date(user.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Enregistrer les modifications
                </button>
                <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
                  Annuler
                </button>
              </div>
            )}
          </form>

         
        </div>
      </div>
    </>
  );
};

export default AdminProfile;