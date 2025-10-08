import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import '../styles/Caroussel.css';
import { Link } from 'react-router-dom';

const CarousselEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/top-evenements');
      setEvents(response.data.evenements);
    } catch (error) {
      console.error('Erreur fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, []);


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="carousel-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des événements...</p>
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="carousel-empty">
        <div className="empty-icon"></div>
        <h3>Aucun événement disponible</h3>
        <p>Revenez bientôt pour découvrir de nouveaux événements</p>
      </div>
    );
  }

  return (
    <div className="carousel-container">
      <div className="carousel-header">
        <h2>Événements à ne pas manquer</h2>
        <p>Découvrez les meilleurs événements près de chez vous</p>
      </div>

      <Swiper
        spaceBetween={30}
        slidesPerView={3}
        loop={true}
        autoplay={{
          delay:2000,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: '.carousel-nav-next',
          prevEl: '.carousel-nav-prev',
        }}
        pagination={{ 
          clickable: true,
          el: '.carousel-pagination'
        }}
        modules={[Autoplay, Pagination, Navigation]}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 20
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 25
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30
          }
        }}
      >
        {events.map(event => (
          <SwiperSlide key={event.id}>
            <div className="carousel-event-card">
                <Link to={`/user/event/${event.id}`}>
                <div className="carousel-event-image">
                <img
                  src={`http://127.0.0.1:8000/storage/${event.image}`}
                  alt={event.title}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
                  }}
                />
                <div className="event-overlay">
                  <span className="event-category">{event.categorie}</span>
                 
                </div>
                <div className="event-date">
                  {formatDate(event.date_debut)}
                </div>
              </div>
                </Link>
              
              
              
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

     
    </div>
  );
};

export default CarousselEvents;