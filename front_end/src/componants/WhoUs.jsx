import React from 'react'
import { 
  FaRocket, 
  FaShoppingCart, 
  FaCreditCard, 
  FaEnvelope,
  FaChartLine,
  FaThLarge,
  FaCalendarAlt,
  FaHeadset,
  FaTheaterMasks,
  FaFutbol,
  FaMusic,
  FaUmbrellaBeach,
  FaGraduationCap,
  FaStar
} from 'react-icons/fa'
import '../styles/WhoUs.css'

const WhoUs = () => {
  return (
    <div className="who-us-simple">
      {/* Hero Section */}
      <section className="simple-hero">
        <div className="container">
          <h1>Qui sommes nous ?</h1>
          <div className="hero-content">
            <p className="lead">
              Eventify.ma est une plateforme innovante dédiée aux bonnes affaires en ligne.
            </p>
            <p>
              Véritable guichet unique, le site internet et l'application Eventify.ma vous 
              permettent d'acheter en un clic vos tickets d'événements à prix coûtant ou de 
              profiter de deals à prix réduits.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="simple-container">
        {/* Countdown Feature */}
        <section className="simple-section">
          <div className="section-header">
            <h2>Notre Approche</h2>
          </div>
          <div className="section-content">
            <p style={{textAlign:"center"}}>
              Tout est simplifié pour vous permettre d'économiser du temps, de l'énergie et de 
              l'argent. Chaque produit ou service qui vous intéresse fait l'objet d'un compte 
              à rebours.
            </p>
          </div>
        </section>

        {/* For Buyers */}
        <section className="simple-section accent">
          <div className="section-header">
            <h2>Pour les Acheteurs</h2>
          
          </div>
          <div className="section-content" >
            <p style={{textAlign:"center"}}>
              La démarche d'inscription est simple. En 60 secondes chrono, vous pouvez créer 
              votre compte utilisateur pour acheter des tickets ou pour profiter de deals.
            </p>
         
          </div>
        </section>

        <section className="simple-section">
          <div className="section-header">
            <h2>Pour les Vendeurs</h2>
          </div>
          <div className="section-content">
            <p style={{textAlign:"center"}}>
              Inscrivez-vous en ligne ou contactez notre service commercial pour connaître 
              nos conditions de vente. Proposez votre produit ou service à vendre en indiquant 
              soigneusement le prix, les quantités, les dates de mise à disposition et autres 
              modalités.
            </p>
            <p style={{textAlign:"center"}}>
              Suivez en temps réel l'évolution de votre offre à travers divers indicateurs : 
              compte à rebours, nombre de clics, d'achats, de ventes.
            </p>
       
          </div>
        </section>


        <section className="simple-section">
          <div className="section-header">
            <h2>À propos de Eventify</h2>
          </div>
          <div className="section-content">
            <p style={{textAlign:"center"}}>
              Eventify.ma est une plateforme d'intermédiation entre clients et vendeurs 
              développée par l'entreprise Eventify Maroc SARL basée à Casablanca. Créée en 
              2018, Eventify Maroc est une société spécialisée dans la vente et la 
              commercialisation de la billetterie.
            </p>
            <div className="stats">
              <div className="stat">
                <div className="stat-number">6+</div>
                <div className="stat-label">Années d'expérience</div>
              </div>
              <div className="stat">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Événements créés</div>
              </div>
              <div className="stat">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Clients satisfaits</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default WhoUs