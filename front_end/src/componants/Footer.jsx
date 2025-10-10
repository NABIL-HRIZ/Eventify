import React from 'react';
import '../styles/Footer.css';
import appStore from '../assets/app-store.webp';
import playStore from '../assets/play-store.jpg';

const Footer = () => {
  return (
    <footer className="modern-footer">
      <div className="footer-container">
        <div className="footer-content">
          
          <div className="footer-column">
            <div className="brand-section">
              <h3 className="brand-title">Eventify</h3>
              <p className="brand-description">
                Eventify.com ! la plateforme numéro 1 de la billetterie digitalisée en Afrique. 
                Elle met à la disposition des amoureux de la culture les meilleurs événements ! 
                Entre des pièces théâtrales, des concerts, des festivals, ou même des matchs de Foot, 
                Eventify.com transporte ses clients vers un univers révolutionnaire, où divers 
                événements leur sont proposés !
              </p>
            </div>
            <div className="social-links">
              
            </div>
          </div>

          <div className="footer-column">
            <h4 className="column-title">Explorer</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Billetterie</a></li>
              <li><a href="#" className="footer-link">Cinéma</a></li>
              <li><a href="#" className="footer-link">Sport</a></li>
             
            </ul>
          </div>

    
          <div className="footer-column">
            <h4 className="column-title">Eventify.com</h4>
            <ul className="footer-links">
              <li><a href="/qui-sommes-nous" className="footer-link">Qui sommes-nous ?</a></li>
              <li><a href="/contactez-nous" className="footer-link">Contactez-nous</a></li>
              <li><a href="/faq" className="footer-link">F.A.Q</a></li>
              <li><a href="/politique" className="footer-link">Politique de remboursement</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="column-title">Téléchargez l'application</h4>
            <div className="app-download-section">
              <p className="app-description">
                Téléchargez notre application mobile pour une expérience encore plus fluide
              </p>
              <div className="app-buttons">
                <a href="#" className="app-button">
                  <img src={appStore} alt="Download on App Store" />
                </a>
                <a href="#" className="app-button">
                  <img src={playStore} alt="Get it on Google Play" />
                </a>
              </div>
            </div>
           
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              © 2025 Eventify.com. Tous droits réservés.
            </div>
            <div className="payment-methods">
              <span className="payment-text">Paiements sécurisés</span>
              
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;