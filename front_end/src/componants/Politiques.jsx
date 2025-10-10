import React from 'react'
import '../styles/Politiques.css'

const Politiques = () => {
  return (
    <div className="politiques-container">
      <div className="politiques-content">
        <header className="politiques-header">
          <h1>Politique de remboursement</h1>
          <div className="header-divider"></div>
        </header>

        <div className="politiques-body">
          <div className="intro-section">
            <p className="intro-text">
              Les billets de spectacles ne bénéficient d'aucun droit de rétractation conformément à la réglementation applicable.
            </p>
            <p className="intro-text">
              Un billet ne peut être remboursé, repris ou échangé, sauf dans les cas suivants :
            </p>
          </div>

          <div className="cases-section">
            <div className="case-card">
              <div className="case-header">
                
                <h2>Annulation de l'événement</h2>
              </div>
              <div className="case-content">
                <ul className="case-list">
                  <li>
                    <span className="list-marker"></span>
                    En cas d'annulation de l'événement, seul le prix du billet (hors frais de service éventuels) sera remboursé à l'acheteur initial.
                  </li>
                  <li>
                    <span className="list-marker"></span>
                    Le remboursement est conditionné à la restitution du billet.
                  </li>
                  <li>
                    <span className="list-marker"></span>
                    Aucun duplicata ne sera délivré en cas de perte ou vol du billet.
                  </li>
                  <li>
                    <span className="list-marker"></span>
                    Aucun remboursement ne sera effectué au-delà de 30 jours après la date initialement prévue de l'événement.
                  </li>
                </ul>
              </div>
            </div>

            <div className="case-card">
              <div className="case-header">
                <div className="case-number">2</div>
                <h2>Report ou modification</h2>
              </div>
              <div className="case-content">
                <ul className="case-list">
                  <li>
                    <span className="list-marker"></span>
                    En cas de report ou de modification substantielle de l'événement (date, lieu, horaire), Eventify.com informera les clients via les coordonnées communiquées lors de l'achat.
                  </li>
                  <li>
                    <span className="list-marker"></span>
                    Il est de la responsabilité du client de vérifier le maintien de l'événement dans les 24 heures précédant la date prévue.
                  </li>
                </ul>
              </div>
            </div>

            {/* Case 3 */}
            <div className="case-card">
              <div className="case-header">
                <div className="case-number">3</div>
                <h2>Contrôle à l'entrée</h2>
              </div>
              <div className="case-content">
                <ul className="case-list">
                  <li>
                    <span className="list-marker"></span>
                    Une pièce d'identité avec photo peut être exigée lors de l'entrée.
                  </li>
                  <li>
                    <span className="list-marker"></span>
                    Celle-ci devra correspondre au nom indiqué sur le billet, si ce dernier est nominatif.
                  </li>
                </ul>
              </div>
            </div>
          </div>

         
        </div>
      </div>
    </div>
  )
}

export default Politiques