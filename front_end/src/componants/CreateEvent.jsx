import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrganisateurSideBar from './OrganisateurSideBar';
import '../styles/CreateEvent.css';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date_debut: '',
    date_fin: '',
    lieu: '',
    prix: '',
    categorie: 'billetterie',
    image: null
  });
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

 



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      image: e.target.files[0]
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date_debut: '',
      date_fin: '',
      lieu: '',
      prix: '',
      categorie: 'billetterie',
      image: null
    });
    setEditingEvent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      let response;
      if (editingEvent) {
        // Update existing event
        response = await axios.put(
          `http://127.0.0.1:8000/api/evenement/${editingEvent.id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            }
          }
        );
        setSuccess('Événement mis à jour avec succès!');
      } else {
        // Create new event
        response = await axios.post(
          'http://127.0.0.1:8000/api/create-evenement',
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            }
          }
        );
        setSuccess('Événement créé avec succès!');
      }

      if (response.data.success) {
        resetForm();
       
      }
    } catch (error) {
      console.error('Error saving event:', error);
      setError(error.response?.data?.message || 'Erreur lors de la sauvegarde de l\'événement');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      date_debut: event.date_debut.split(' ')[0], // Format for datetime-local
      date_fin: event.date_fin.split(' ')[0],
      lieu: event.lieu,
      prix: event.prix,
      categorie: event.categorie,
      image: null
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/evenement/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (response.data.success) {
        setSuccess('Événement supprimé avec succès!');
       
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('Erreur lors de la suppression de l\'événement');
    }
  };

  const categories = [
    { value: 'billetterie', label: 'Billetterie' },
    { value: 'sport', label: 'Sport' },
    { value: 'cinema', label: 'Cinéma' }
  ];

  return (
    <>
      <OrganisateurSideBar />
      <div className="create-event-container">
        <div className="create-event-card">
          {/* Header */}
          <div className="event-header">
            <h1>{editingEvent ? 'Modifier l\'Événement' : 'Créer un Nouvel Événement'}</h1>
            <p>
              {editingEvent 
                ? 'Modifiez les détails de votre événement' 
                : 'Remplissez les informations pour créer un nouvel événement'
              }
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          {/* Event Form */}
          <form onSubmit={handleSubmit} className="event-form">
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="title">Titre de l'événement *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  placeholder="Ex: Concert de Jazz en Plein Air"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="4"
                  placeholder="Décrivez votre événement..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="date_debut">Date et heure de début du vente *</label>
                <input
                  type="datetime-local"
                  id="date_debut"
                  name="date_debut"
                  value={formData.date_debut}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="date_fin">Date et heure de dupart de l'événement *</label>
                <input
                  type="datetime-local"
                  id="date_fin"
                  name="date_fin"
                  value={formData.date_fin}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lieu">Lieu *</label>
                <input
                  type="text"
                  id="lieu"
                  name="lieu"
                  value={formData.lieu}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  placeholder="Ex: Paris, France"
                />
              </div>

              <div className="form-group">
                <label htmlFor="prix">Prix (DH) *</label>
                <input
                  type="number"
                  id="prix"
                  name="prix"
                  value={formData.prix}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label htmlFor="categorie">Catégorie *</label>
                <select
                  id="categorie"
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                  style={{color:"white",backgroundColor:'black'}}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="image">Image de l'événement</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                  className="form-file"
                  accept="image/*"
                />
                <small>Formats acceptés: JPG, PNG, WebP. Taille max: 5MB</small>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className={`submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading 
                  ? 'Enregistrement...' 
                  : editingEvent 
                    ? 'Mettre à jour l\'événement' 
                    : 'Créer l\'événement'
                }
              </button>
              {editingEvent && (
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={resetForm}
                >
                  Annuler
                </button>
              )}
            </div>
          </form>

       
        </div>
      </div>
    </>
  );
};

export default CreateEvent;