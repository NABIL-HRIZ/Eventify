import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import appStore from '../assets/app-store.webp';
import playStore from '../assets/play-store.jpg';
import { FaBars } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import mar_flag from '../assets/mar.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Navbar.css';

function MyNavbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();



useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
  };

  fetchUser();
}, [localStorage.getItem("token")]); 






  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://127.0.0.1:8000/api/logout", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Erreur logout:", err);
    }
  };

  return (
    <Navbar expand="lg" className="" style={{ marginTop:"20px" }}>
      <Container>
        <Navbar.Brand href="/">Eventify</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-1" style={{ marginLeft:"500px" }}>
            <Nav.Link href="#link">Qui Sommes Nous ?</Nav.Link>
            <Nav.Link href="#">FAQ</Nav.Link>
            <Nav.Link href="#"><img src={mar_flag} style={{ width:"20px" }} alt="Maroc flag"/></Nav.Link>
            <Nav.Link href="#"><IoCartOutline style={{ fontSize:"25px" }}/></Nav.Link>

            <NavDropdown 
              title={<FaBars style={{ fontSize:"25px" }}/>} 
              id="basic-nav-dropdown"
              align="end"
            >
              {user ? (
                <>
                  <NavDropdown.Item disabled>
                    <strong style={{background:"white",color:"black"}}>{user.prenom} {user.nom}</strong><br/>
                    <small  style={{background:"white",color:"black"}}>{user.email}</small>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/organisateur/profile" className='mes-links'>Mes informations</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/organisateur/create-event" className='mes-links'>Ajouter un événement</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/organisateur/events" className='mes-links'>Mes Evénements</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} style={{padding:"15px",background:"red",width:"90%",marginLeft:"10px",textAlign:"center",color:"white"}}>Se déconnecter</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Divider />
                  <NavDropdown.Item className='dropdown-footer'>
                    <h5 style={{ backgroundColor:'white', marginBottom:"20px" }}>
                      Télécharger L'application
                    </h5>
                    <div className='imgs'>
                      <img src={appStore} alt="App Store" />
                      <img src={playStore} alt="Play Store" />
                    </div>
                  </NavDropdown.Item>
                </>
              ) : (
                <>
                  <NavDropdown.Item as={Link} to="/login">Se connecter</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/register">Inscription</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item>Politique de remboursement</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item className='dropdown-footer'>
                    <h5 style={{ backgroundColor:'white', marginBottom:"20px" }}>
                      Télécharger L'application
                    </h5>
                    <div className='imgs'>
                      <img src={appStore} alt="App Store" />
                      <img src={playStore} alt="Play Store" />
                    </div>
                  </NavDropdown.Item>
                </>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
