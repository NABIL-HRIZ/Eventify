import React, { useState } from 'react';
import AdminSideBar from './AdminSideBar';
import '../styles/CreateUser.css';
import Swal from 'sweetalert2';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    phone: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Success SweetAlert
        Toast.fire({
          icon: 'success',
          title: 'Utilisateur créé avec succès!',
          iconColor: '#00ff7f'
        });

        // Reset form
        setFormData({
          prenom: "",
          nom: "",
          phone: "",
          email: "",
          password: ""
        });
      } else {

        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: data.message || "Erreur lors de la création de l'utilisateur",
          background: '#1a1a2e',
          color: 'white',
          confirmButtonColor: '#FFD700',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {

      Swal.fire({
        icon: 'error',
        title: 'Erreur réseau',
        text: "Impossible de se connecter au serveur",
        background: '#1a1a2e',
        color: 'white',
        confirmButtonColor: '#FFD700',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminSideBar />
      <div className="create-user-container">
        <div className="create-user-card">
          <div className="create-user-header">
            <h1>Créer un Nouvel Utilisateur</h1>
            <p>Ajouter un nouvel utilisateur au système</p>
          </div>

          <form onSubmit={handleSubmit} className="create-user-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="prenom">Prénom *</label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  placeholder="Entrez le prénom"
                />
              </div>

              <div className="form-group">
                <label htmlFor="nom">Nom *</label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  placeholder="Entrez le nom"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Téléphone *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Entrez le numéro de téléphone"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Entrez l'adresse email"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="password">Mot de passe *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Entrez le mot de passe (min. 6 caractères)"
                  minLength="6"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={`submit-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Création en cours...
                </>
              ) : (
                'Créer Utilisateur'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;