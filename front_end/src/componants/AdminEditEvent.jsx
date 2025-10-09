import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const AdminEditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:8000/api/evenement/${id}`)
      .then(res => {
        const data = res.data.evenement;
        setEventData({
          title: data.title,
          description: data.description,
          date_debut: data.date_debut.slice(0, 16),
          date_fin: data.date_fin.slice(0, 16),
          lieu: data.lieu,
          prix: data.prix,
          categorie: data.categorie,
          image: null,
        });
        setPreview(`http://localhost:8000/storage/${data.image}`);
      })
      .catch(err => console.log(err));
  }, [id]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setEventData(prev => ({ ...prev, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setEventData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(eventData).forEach(([key, value]) => {
      if (value !== null && value !== '') formData.append(key, value);
    });

    try {
      const res = await axios.put(`http://localhost:8000/api/evenement/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res.data.message);
      setErrors({});
      console.log(res.data);
    
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error(err.response ? err.response.data : err);
      }
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2>Edit Event</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
          />
          {errors.title && <span style={{ color: 'red' }}>{errors.title[0]}</span>}
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={eventData.description}
            onChange={handleChange}
          ></textarea>
          {errors.description && <span style={{ color: 'red' }}>{errors.description[0]}</span>}
        </div>

        <div>
          <label>Date Start:</label>
          <input
            type="datetime-local"
            name="date_debut"
            value={eventData.date_debut}
            onChange={handleChange}
          />
          {errors.date_debut && <span style={{ color: 'red' }}>{errors.date_debut[0]}</span>}
        </div>

        <div>
          <label>Date End:</label>
          <input
            type="datetime-local"
            name="date_fin"
            value={eventData.date_fin}
            onChange={handleChange}
          />
          {errors.date_fin && <span style={{ color: 'red' }}>{errors.date_fin[0]}</span>}
        </div>

        <div>
          <label>Lieu:</label>
          <input
            type="text"
            name="lieu"
            value={eventData.lieu}
            onChange={handleChange}
          />
          {errors.lieu && <span style={{ color: 'red' }}>{errors.lieu[0]}</span>}
        </div>

        <div>
          <label>Prix:</label>
          <input
            type="number"
            name="prix"
            value={eventData.prix}
            onChange={handleChange}
          />
          {errors.prix && <span style={{ color: 'red' }}>{errors.prix[0]}</span>}
        </div>

        <div>
          <label>Categorie:</label>
          <select
            name="categorie"
            value={eventData.categorie}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            <option value="billetterie">Billetterie</option>
            <option value="sport">Sport</option>
            <option value="cinema">Cinema</option>
          </select>
          {errors.categorie && <span style={{ color: 'red' }}>{errors.categorie[0]}</span>}
        </div>

        <div>
          <label>Image:</label>
          <input type="file" name="image" onChange={handleChange} />
          {preview && <img src={preview} alt="Preview" style={{ width: '200px', marginTop: '10px' }} />}
          {errors.image && <span style={{ color: 'red' }}>{errors.image[0]}</span>}
        </div>

        <button type="submit" style={{ marginTop: '20px' }}>Update Event</button>
      </form>
    </div>
  );
};

export default AdminEditEvent;
