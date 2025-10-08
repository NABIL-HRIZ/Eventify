import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import OrganisateurSideBar from './OrganisateurSideBar';

const EditEvent = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date_debut: '',
    date_fin: '',
    lieu: '',
    prix: '',
    categorie: 'billetterie',
    image: null,
  });
  const [editingEvent, setEditingEvent] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Charger les infos de l’événement existant
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/evenement/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const event = response.data.evenement || response.data; // selon ta réponse API
        setEditingEvent(event);

        setFormData({
          title: event.title,
          description: event.description || '',
          date_debut: event.date_debut.slice(0, 16), 
          date_fin: event.date_fin.slice(0, 16),
          lieu: event.lieu,
          prix: event.prix,
          categorie: event.categorie,
          image: null, // l'image ne sera re-uploadée que si modifiée
        });
      } catch (err) {
        console.error("Erreur lors du chargement de l'événement :", err);
        setError("Impossible de charger l'événement.");
      }
    };

    fetchEvent();
  }, [id]);

  // Gestion des inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.put(
        `http://127.0.0.1:8000/api/evenement/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setSuccess("Événement mis à jour avec succès !");
        setTimeout(() => {
          navigate('/organisateur/events'); // redirige vers liste
        }, 1500);
      }
    } catch (err) {
      console.error("Erreur update :", err);
      setError(err.response?.data?.message || "Erreur lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'billetterie', label: 'Billetterie' },
    { value: 'sport', label: 'Sport' },
    { value: 'cinema', label: 'Cinéma' },
  ];

  return (
    <>
      <OrganisateurSideBar />
      <div className="create-event-container">
        <div className="create-event-card">
          <h1 style={{color:"white"}}>Modifier l'Événement</h1>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="event-form">
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="title">Titre *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  style={{color:"white"}}
                />
              </div>

              <div className="form-group">
                <label>Date début de vente *</label>
                <input
                  type="datetime-local"
                  name="date_debut"
                  value={formData.date_debut}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Date d'événement *</label>
                <input
                  type="datetime-local"
                  name="date_fin"
                  value={formData.date_fin}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Lieu *</label>
                <input
                  type="text"
                  name="lieu"
                  value={formData.lieu}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Prix *</label>
                <input
                  type="number"
                  name="prix"
                  value={formData.prix}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Catégorie *</label>
                <select
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleInputChange}
                  required
                  style={{color:"white"}}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* SECTION IMAGE */}
              <div className="form-group full-width">
                <label htmlFor="image">Image de l'événement</label>

                {/* Affiche l’image actuelle si aucune nouvelle n’est sélectionnée */}
                {!formData.image && editingEvent && editingEvent.image && (
                  <div style={{ marginBottom: "10px" }}>
                    <p>Image actuelle :</p>
                    <img
                      src={`http://127.0.0.1:8000/storage/${editingEvent.image}`}
                      alt="Event"
                      style={{ width: "200px", borderRadius: "8px" }}
                    />
                  </div>
                )}

                {/* Preview nouvelle image */}
                {formData.image && (
                  <div style={{ marginBottom: "10px" }}>
                    <p>Nouvelle image sélectionnée :</p>
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Preview"
                      style={{ width: "200px", borderRadius: "8px" }}
                    />
                  </div>
                )}

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
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Mise à jour..." : "Mettre à jour"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditEvent;
