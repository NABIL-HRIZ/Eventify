import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUpload, FaCalendarAlt, FaMapMarkerAlt, FaTag, FaImage } from 'react-icons/fa';
import Swal from 'sweetalert2';
import '../styles/EditEvent.css';

const AdminEditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date_debut: '',
    date_fin: '',
    lieu: '',
    prix: '',
    categorie: '',
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
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

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/evenement/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;

      setEventData({
        title: data.title || '',
        description: data.description || '',
        date_debut: data.date_debut || '',
        date_fin: data.date_fin || '',
        lieu: data.lieu || '',
        prix: data.prix || '',
        categorie: data.categorie || '',
        image: null,
      });

      setPreview(data.image ? `http://127.0.0.1:8000/storage/${data.image}` : null);
    } catch (err) {
      console.error('Erreur fetching event:', err);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les données de l\'événement',
        background: '#1a1a2e',
        color: 'white',
        confirmButtonColor: '#FFD700',
        confirmButtonText: 'OK'
      });
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files[0]) {
      setEventData(prev => ({ ...prev, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setEventData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const formData = new FormData();
    Object.entries(eventData).forEach(([key, value]) => {
      if (key === 'image') {
        if (value instanceof File) formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    });

    try {
      const res = await axios.put(
        `http://127.0.0.1:8000/api/evenement/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Toast.fire({
        icon: 'success',
        title: 'Événement mis à jour avec succès!',
        iconColor: '#00ff7f'
      });

      const updated = res.data.evenement;
      setEventData({
        title: updated.title || '',
        description: updated.description || '',
        date_debut: updated.date_debut || '',
        date_fin: updated.date_fin || '',
        lieu: updated.lieu || '',
        prix: updated.prix || '',
        categorie: updated.categorie || '',
        image: null,
      });
      setPreview(updated.image ? `http://127.0.0.1:8000/storage/${updated.image}` : null);

      setTimeout(() => navigate('/admin/events'), 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        
        Swal.fire({
          icon: 'error',
          title: 'Erreur de validation',
          text: 'Veuillez corriger les erreurs dans le formulaire',
          background: '#1a1a2e',
          color: 'white',
          confirmButtonColor: '#FFD700',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de la mise à jour de l\'événement',
          background: '#1a1a2e',
          color: 'white',
          confirmButtonColor: '#FFD700',
          confirmButtonText: 'OK'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Les modifications non enregistrées seront perdues!',
      icon: 'warning',
      background: '#1a1a2e',
      color: 'white',
      iconColor: '#ffcc00',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, quitter!',
      cancelButtonText: 'Rester',
      customClass: {
        popup: 'custom-swal-popup'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/admin/events');
      }
    });
  };

  return (
    <div className="edit-event-container">
      <div className="edit-event-header">
        <button 
          className="back-button"
          onClick={handleBackClick}
        >
          <FaArrowLeft /> Retour
        </button>
        <h1>Modifier l'Événement</h1>
        <p>Mettez à jour les détails de votre événement</p>
      </div>

      <div className="edit-event-card">
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="edit-event-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Titre de l'événement
              </label>
              <input 
                type="text" 
                name="title" 
                value={eventData.title} 
                onChange={handleChange}
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="Entrez le titre de l'événement"
              />
              {errors.title && <span className="error-message">{errors.title[0]}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Catégorie
              </label>
              <select 
                name="categorie" 
                value={eventData.categorie} 
                onChange={handleChange}
                className={`form-select ${errors.categorie ? 'error' : ''}`}
              >
                <option value="">Sélectionnez une catégorie</option>
                <option value="billetterie">Billetterie</option>
                <option value="sport">Sport</option>
                <option value="cinema">Cinéma</option>
                <option value="musique">Musique</option>
                <option value="theatre">Théâtre</option>
                <option value="conference">Conférence</option>
              </select>
              {errors.categorie && <span className="error-message">{errors.categorie[0]}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Date et heure de début
              </label>
              <input 
                type="datetime-local" 
                name="date_debut" 
                value={eventData.date_debut} 
                onChange={handleChange}
                className={`form-input ${errors.date_debut ? 'error' : ''}`}
              />
              {errors.date_debut && <span className="error-message">{errors.date_debut[0]}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Date et heure de fin
              </label>
              <input 
                type="datetime-local" 
                name="date_fin" 
                value={eventData.date_fin} 
                onChange={handleChange}
                className={`form-input ${errors.date_fin ? 'error' : ''}`}
              />
              {errors.date_fin && <span className="error-message">{errors.date_fin[0]}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Lieu
              </label>
              <input 
                type="text" 
                name="lieu" 
                value={eventData.lieu} 
                onChange={handleChange}
                className={`form-input ${errors.lieu ? 'error' : ''}`}
                placeholder="Entrez le lieu de l'événement"
              />
              {errors.lieu && <span className="error-message">{errors.lieu[0]}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Prix (MAD)
              </label>
              <input 
                type="number" 
                name="prix" 
                value={eventData.prix} 
                onChange={handleChange}
                className={`form-input ${errors.prix ? 'error' : ''}`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.prix && <span className="error-message">{errors.prix[0]}</span>}
            </div>
          </div>

          <div className="form-group full-width">
            <label className="form-label">Description</label>
            <textarea 
              name="description" 
              value={eventData.description} 
              onChange={handleChange}
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Décrivez votre événement en détail..."
              rows="5"
            />
            {errors.description && <span className="error-message">{errors.description[0]}</span>}
          </div>

          <div className="form-group full-width">
            <label className="form-label">
              Image de l'événement
            </label>
            <div className="image-upload-section">
              <label className="file-upload-label">
                <input 
                  type="file" 
                  name="image" 
                  onChange={handleChange}
                  className="file-input"
                  accept="image/*"
                />
                <span>Choisir une image</span>
              </label>
              
              {preview && (
                <div className="image-preview">
                  <img src={preview} alt="Aperçu" className="preview-image" />
                  <div className="preview-overlay">
                    <span>Aperçu</span>
                  </div>
                </div>
              )}
            </div>
            {errors.image && <span className="error-message">{errors.image[0]}</span>}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Mise à jour...
                </>
              ) : (
                'Mettre à jour l\'événement'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditEvent;