import React from 'react'
import img from '../assets/app-mobile.png'
import img_1 from '../assets/app-store.png'
import img_2 from '../assets/play-store.png'
import '../styles/About.css'
const About = () => {
  return (
    <div className='about-section'>
        <div className='about-left'>
            <img src={img} alt="about info" />

        </div>

        <div className='about-details'>
            <h3>Une app repensée, une ambiance renouvelée</h3>
            <h1>Préparez-vous pour le prochain Guichet !</h1>
            <p>L'application Eventify fait peau neuve ! Notre toute nouvelle version est désormais disponible, avec une expérience repensée et enrichie.Téléchargez-la dès aujourd’hui et découvrez toutes les dernières fonctionnalités !</p>
             <div className='images'>
                <img src={img_1} alt="" />
                <img src={img_2} alt="" />

             </div>
        </div>
      
    </div>
  )
}

export default About
