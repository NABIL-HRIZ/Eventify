import React, { useState } from 'react';
import AdminSideBar from './AdminSideBar';
import '../styles/CreateUser.css'
const CreateUser = () => {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    phone: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

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
      setMessage("User created successfully!");
      setFormData({
        prenom: "",
        nom: "",
        phone: "",
        email: "",
        password: ""
      });
    } else {
      setMessage("Error creating user: " + (data.message || "Unknown error"));
    }
  } catch (error) {
    setMessage("Network error: " + error.message);
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
            <h1>Create New User</h1>
            <p>Add a new user to the system</p>
          </div>

          <form onSubmit={handleSubmit} className="create-user-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="prenom">First Name *</label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  placeholder="Enter first name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="nom">Last Name *</label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  placeholder="Enter last name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter phone number"
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
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter password (min. 6 characters)"
                  minLength="6"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={`submit-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Creating User...' : 'Create User'}
            </button>

            {message && (
              <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;