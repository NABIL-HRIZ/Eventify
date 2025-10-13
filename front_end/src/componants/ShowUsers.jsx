import React, { useState, useEffect } from "react";
import AdminSideBar from "./AdminSideBar";
import "../styles/ShowUsers.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";

const ShowUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [show, setShow] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    phone: "",
    role: "",
  });

 
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
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/show-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setUsers(data.users || data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    const userToDelete = users.find(user => user.id === userId);
    
    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: `Voulez-vous vraiment supprimer ${userToDelete?.prenom} ${userToDelete?.nom} ?`,
      icon: 'warning',
      background: '#1a1a2e',
      color: 'white',
      iconColor: '#ffcc00',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler',
      customClass: {
        popup: 'custom-swal-popup'
      }
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/user/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setUsers(users.filter((user) => user.id !== userId));

          Toast.fire({
            icon: 'success',
            title: 'Utilisateur supprimé avec succès!',
            iconColor: '#00ff7f'
          });
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        Toast.fire({
          icon: 'error',
          title: 'Erreur lors de la suppression!',
          iconColor: '#ff4757'
        });
      }
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setEditForm({
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      phone: user.phone,
      role: user.role || "User",
    });
    setIsEditing(false);
    setShow(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();

        setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
        setSelectedUser(updatedUser);
        setIsEditing(false);
        setShow(false);

        Toast.fire({
          icon: 'success',
          title: 'Utilisateur modifié avec succès!',
          iconColor: '#00ff7f'
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Échec de la modification",
          text: errorData.message || "Impossible de modifier l'utilisateur. Veuillez réessayer.",
          background: '#1a1a2e',
          color: 'white',
          confirmButtonColor: '#FFD700'
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur s'est produite. Veuillez réessayer plus tard.",
        background: '#1a1a2e',
        color: 'white',
        confirmButtonColor: '#FFD700'
      });
    }
  };

  const handleClose = () => {
    setShow(false);
    setSelectedUser(null);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="admin-container">
        <AdminSideBar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <AdminSideBar />
      <div className="show-users-container">
        <div className="users-header">
          <div className="header-content" style={{ display: "grid" }}>
            <h1>Gestion des Utilisateurs</h1>
            <p>Gérez tous les utilisateurs du système et leurs permissions</p>
          </div>
          <div className="header-stats">
            <div className="stat-ccard">
              <span className="stat-number">{users.length} </span>
              <span className="stat-label"> Inscris</span>
            </div>
          </div>
        </div>

        <div className="users-table-container">
          <div className="table-responsive">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Prénom</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Rôle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="user-row">
                    <td>{user.prenom}</td>
                    <td>{user.nom}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || 'Non renseigné'}</td>
                    <td>
                      <span
                        className={`role-badge ${
                          user.role?.toLowerCase() || "user"
                        }`}
                      >
                        {user.role || "User"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          
                          size="sm"
                          onClick={() => handleViewDetails(user)}
                          className="btn-view"
                          style={{background:"#FA812F"}}

                        >
                          Voir
                        </Button>
                        <Button
                          
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          className="btn-delete"
                          style={{background:"#DD0303"}}
                        >
                           Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="empty-state">
                <h3>Aucun utilisateur trouvé</h3>
                <p>Il n'y a pas encore d'utilisateurs dans le système.</p>
              </div>
            )}
          </div>
        </div>

        {selectedUser && (
          <Modal show={show} onHide={handleClose} centered className="user-modal">
            <Modal.Header closeButton className="modal-header-custom">
              <Modal.Title className="modal-title-custom" style={{color:"#fff"}}>
                {isEditing ? " Modifier l'Utilisateur" : " Détails de l'Utilisateur"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-custom">
              {isEditing ? (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">Prénom</Form.Label>
                    <Form.Control
                      type="text"
                      value={editForm.prenom}
                      onChange={(e) =>
                        setEditForm({ ...editForm, prenom: e.target.value })
                      }
                      className="form-control-custom"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">Nom</Form.Label>
                    <Form.Control
                      type="text"
                      value={editForm.nom}
                      onChange={(e) =>
                        setEditForm({ ...editForm, nom: e.target.value })
                      }
                      className="form-control-custom"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="form-control-custom"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">Téléphone</Form.Label>
                    <Form.Control
                      type="text"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      className="form-control-custom"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">Rôle</Form.Label>
                    <Form.Select
                      value={editForm.role}
                      onChange={(e) =>
                        setEditForm({ ...editForm, role: e.target.value })
                      }
                      className="form-control-custom"
                    >
                      <option value="user">Utilisateur</option>
                      <option value="organisateur">Organisateur</option>
                      <option value="admin">Administrateur</option>
                    </Form.Select>
                  </Form.Group>
                </Form>
              ) : (
                <div className="user-details-content">
                  <p style={{color:"#fff"}}>
                    <strong>Prénom:</strong> {selectedUser.prenom}
                  </p>
                  <p style={{color:"#fff"}}>
                    <strong>Nom:</strong> {selectedUser.nom}
                  </p>
                  <p style={{color:"#fff"}}>
                    <strong>Email:</strong> {selectedUser.email}
                  </p>
                  <p style={{color:"#fff"}}>
                    <strong>Téléphone:</strong> {selectedUser.phone || 'Non renseigné'}
                  </p>
                  <p style={{color:"#fff"}}>
                    <strong>Rôle:</strong>{" "}
                    <span
                      className={`role-badge ${
                        selectedUser.role?.toLowerCase() || "user"
                      }`}
                    >
                      {selectedUser.role || "User"}
                    </span>
                  </p>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer className="modal-footer-custom">
              {isEditing ? (
                <>
                  <Button variant="success" onClick={handleUpdate} className="btn-save">
                     Enregistrer
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                    className="btn-cancel"
                  >
                    Annuler
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="btn-edit"
                >
                   Modifier
                </Button>
              )}
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ShowUsers;