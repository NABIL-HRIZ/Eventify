import Accordion from 'react-bootstrap/Accordion';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Faqs.css';

function Faqs() {
  return (
    <div className="modern-faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <h1 className="faq-titlle">Questions fréquemment posées</h1>
          <p className="faq-subtitle">
            Trouvez rapidement les réponses à vos questions sur Eventify
          </p>
        </div>
        
        <div className="faq-content">
          <Accordion defaultActiveKey="0" flush className="modern-accordion">
            <Accordion.Item eventKey="0" className="accordion-item-modern">
              <Accordion.Header className="accordion-header-modern">
                <div className="header-content">
                  <span className="question-text">Comment créer un compte sur Eventify.com ?</span>
                  <span className="accordion-icon">+</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="accordion-body-modern">
                <div className="answer-content">
                  Cliquez sur le bouton "S'inscrire" en haut de la page, remplissez le formulaire avec vos informations personnelles et validez. Vous recevrez un email de confirmation.
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1" className="accordion-item-modern">
              <Accordion.Header className="accordion-header-modern">
                <div className="header-content">
                  <span className="question-text">Comment acheter un billet ?</span>
                  <span className="accordion-icon">+</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="accordion-body-modern">
                <div className="answer-content">
                  <ul className="answer-steps">
                    <li>Recherchez l'événement ou le service de votre choix</li>
                    <li>Sélectionnez le billet ou l'option souhaitée</li>
                    <li>Ajoutez-le au panier et procédez au paiement</li>
                  </ul>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2" className="accordion-item-modern">
              <Accordion.Header className="accordion-header-modern">
                <div className="header-content">
                  <span className="question-text">Puis-je annuler ou modifier ma commande ?</span>
                  <span className="accordion-icon">+</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="accordion-body-modern">
                <div className="answer-content">
                  Cela dépend de la politique de l'événement ou du prestataire. Veuillez consulter les conditions d'annulation indiquées sur la page de l'événement.
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3" className="accordion-item-modern">
              <Accordion.Header className="accordion-header-modern">
                <div className="header-content">
                  <span className="question-text">Comment recevoir mon billet ?</span>
                  <span className="accordion-icon">+</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="accordion-body-modern">
                <div className="answer-content">
                  Une fois la commande validée, votre billet sera envoyé par email au format PDF. Vous pouvez également y accéder depuis votre espace personnel sur le site.
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4" className="accordion-item-modern">
              <Accordion.Header className="accordion-header-modern">
                <div className="header-content">
                  <span className="question-text">Quels sont les moyens de paiement acceptés ?</span>
                  <span className="accordion-icon">+</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="accordion-body-modern">
                <div className="answer-content">
                  Nous acceptons les paiements par carte bancaire (Visa, MasterCard), PayPal, et d'autres solutions locales ou internationales selon votre région.
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="5" className="accordion-item-modern">
              <Accordion.Header className="accordion-header-modern">
                <div className="header-content">
                  <span className="question-text">Mon paiement est-il sécurisé ?</span>
                  <span className="accordion-icon">+</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="accordion-body-modern">
                <div className="answer-content">
                  Oui, nous utilisons des systèmes de cryptage avancés pour protéger vos informations personnelles et financières.
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="6" className="accordion-item-modern">
              <Accordion.Header className="accordion-header-modern">
                <div className="header-content">
                  <span className="question-text">Que faire si mon paiement échoue ?</span>
                  <span className="accordion-icon">+</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="accordion-body-modern">
                <div className="answer-content">
                  Assurez-vous que vos informations bancaires sont correctes et que votre carte est active. Si le problème persiste, contactez notre service client.
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="7" className="accordion-item-modern">
              <Accordion.Header className="accordion-header-modern">
                <div className="header-content">
                  <span className="question-text">Je n'arrive pas à me connecter à mon compte, que faire ?</span>
                  <span className="accordion-icon">+</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="accordion-body-modern">
                <div className="answer-content">
                  Vérifiez votre email et votre mot de passe. Si vous l'avez oublié, cliquez sur "Mot de passe oublié" pour réinitialiser votre mot de passe.
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="8" className="accordion-item-modern">
              <Accordion.Header className="accordion-header-modern">
                <div className="header-content">
                  <span className="question-text">Je ne reçois pas mes emails de confirmation, que faire ?</span>
                  <span className="accordion-icon">+</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="accordion-body-modern">
                <div className="answer-content">
                  <ul className="answer-steps">
                    <li>Vérifiez vos dossiers "Spam" ou "Courrier indésirable"</li>
                    <li>Assurez-vous que l'adresse email fournie est correcte</li>
                    <li>Contactez notre support si le problème persiste</li>
                  </ul>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="9" className="accordion-item-modern">
              <Accordion.Header className="accordion-header-modern">
                <div className="header-content">
                  <span className="question-text">Comment contacter le service client ?</span>
                  <span className="accordion-icon">+</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="accordion-body-modern">
                <div className="answer-content">
                  <div className="contact-info">
                    <p>Vous pouvez nous joindre :</p>
                    <div className="contact-methods">
                      <div className="contact-method">
                        <strong>Email :</strong> 
                        <a href="mailto:sav@eventify.ma" className="contact-link">sav@eventify.ma</a>
                      </div>
                      <div className="contact-method">
                        <strong>Téléphone :</strong> 
                        <span className="contact-link">+212 645-765765</span>
                      </div>
                      <div className="contact-method">
                        <strong>Formulaire :</strong> 
                        <span>Disponible sur la page "Nous Contacter"</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="10" className="accordion-item-modern">
              <Accordion.Header className="accordion-header-modern">
                <div className="header-content">
                  <span className="question-number">11</span>
                  <span className="question-text">Quels sont vos horaires d'ouverture ?</span>
                  <span className="accordion-icon">+</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="accordion-body-modern">
                <div className="answer-content">
                  Notre service client est disponible du lundi au vendredi, de 9h à 18h.
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="11" className="accordion-item-modern">
              <Accordion.Header className="accordion-header-modern">
                <div className="header-content">
                  <span className="question-text">Mes données personnelles sont-elles protégées ?</span>
                  <span className="accordion-icon">+</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="accordion-body-modern">
                <div className="answer-content">
                  Oui, Eventify.com respecte les normes de protection des données en vigueur. Vos informations sont stockées de manière sécurisée et ne sont jamais partagées sans votre consentement.
                </div>
              </Accordion.Body>
            </Accordion.Item>

          </Accordion>
        </div>
      </div>
    </div>
  );
}

export default Faqs;