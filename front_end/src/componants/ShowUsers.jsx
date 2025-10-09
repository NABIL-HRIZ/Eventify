import React, { useState, useEffect } from 'react';
import AdminSideBar from './AdminSideBar';
import '../styles/ShowUsers.css';

const ShowUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    phone: '',
    role: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/show-users", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }
      });
      const data = await response.json();
      setUsers(data.users || data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
        alert('User deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setEditForm({
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      phone: user.phone,
      role: user.role || 'User'
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/user/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        setSelectedUser(updatedUser);
        setIsEditing(false);
        setShowModal(false);
        alert('User updated successfully');
      } else {
        alert('Error updating user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="admin-container">
        <AdminSideBar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <AdminSideBar />
      <div className="show-users-container">
        <div className="users-header">
          <div className="header-content">
            <h1>User Management</h1>
            <p>Manage all system users and their permissions</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{users.length}</span>
              <span className="stat-label">Total Users</span>
            </div>
          </div>
        </div>

        <div className="users-table-container">
          <div className="table-responsive">
            <table className="users-table">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="user-row">
                    <td>{user.prenom}</td>
                    <td>{user.nom}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
  <span className={`role-badge ${user.role?.toLowerCase() || 'user'}`}>
    {user.role || 'User'}
  </span>
</td>

                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-view"
                          onClick={() => handleViewDetails(user)}
                          title="View Details"
                        >
                          Voir
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDelete(user.id)}
                          title="Delete User"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="empty-state">
                <h3>No Users Found</h3>
                <p>There are no users in the system yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && selectedUser && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{isEditing ? 'Edit User' : 'User Details'}</h2>
                <button className="close-btn" onClick={closeModal}>×</button>
              </div>

              <div className="modal-body">
                {isEditing ? (
                  <div className="user-detail-grid">
                    <div className="detail-item">
                      <label>First Name:</label>
                      <input
                        type="text"
                        value={editForm.prenom}
                        onChange={e => setEditForm({...editForm, prenom: e.target.value})}
                        style={{color:"white",border:"none"}}
                      />
                    </div>
                    <div className="detail-item">
                      <label>Last Name:</label>
                      <input
                        type="text"
                        value={editForm.nom}
                        onChange={e => setEditForm({...editForm, nom: e.target.value})}
                       style={{color:"white",border:"none"}}
                      />
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={e => setEditForm({...editForm, email: e.target.value})}
                      style={{color:"white",border:"none"}}
                     />
                    </div>
                    <div className="detail-item">
                      <label>Phone:</label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={e => setEditForm({...editForm, phone: e.target.value})}
                      style={{color:"white",border:"none"}}
                     />
                    </div>
                    <div className="detail-item">
                      <label>Role:</label>
                      <input
                        type="text"
                        value={editForm.role}
                        onChange={e => setEditForm({...editForm, role: e.target.value})}
                    style={{color:"white",border:"none"}}
                   />
                    </div>
                  </div>
                ) : (
                  <div className="user-detail-grid">
                    <div className="detail-item">
                      <label>First Name:</label>
                      <span>{selectedUser.prenom}</span>
                    </div>
                    <div className="detail-item">
                      <label>Last Name:</label>
                      <span>{selectedUser.nom}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="detail-item">
                      <label>Phone:</label>
                      <span>{selectedUser.phone}</span>
                    </div>
                    <div className="detail-item">
                      <label>Role:</label>
                      <span className={`role-badge ${selectedUser.role?.toLowerCase() || 'user'}`}>
                        {selectedUser.role || 'User'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>User ID:</label>
                      <span className="user-id">{selectedUser.id}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                {isEditing ? (
                  <>
                    <button className="btn-save" onClick={handleUpdate}>Save</button>
                    <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                  </>
                ) : (
                  <button className="btn-secondary" onClick={handleEditClick}>Modifier</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowUsers;
