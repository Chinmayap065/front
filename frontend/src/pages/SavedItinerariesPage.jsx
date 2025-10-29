import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import anime from 'animejs';
import styles from './SavedItinerariesPage.module.css';

const SavedItinerariesPage = () => {
  const [savedItineraries, setSavedItineraries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const pageRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // Load saved itineraries from localStorage
    const saved = JSON.parse(localStorage.getItem('savedItineraries') || '[]');
    setSavedItineraries(saved);
    setIsLoading(false);

    // Animate page entrance
    anime({
      targets: pageRef.current,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      easing: 'easeOutExpo'
    });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Animate cards
      anime({
        targets: cardsRef.current,
        opacity: [0, 1],
        translateY: [50, 0],
        scale: [0.9, 1],
        delay: anime.stagger(100, {start: 300}),
        duration: 600,
        easing: 'easeOutExpo'
      });
    }
  }, [isLoading]);

  const deleteItinerary = (id) => {
    const updated = savedItineraries.filter(itinerary => itinerary.id !== id);
    setSavedItineraries(updated);
    localStorage.setItem('savedItineraries', JSON.stringify(updated));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your saved itineraries...</p>
      </div>
    );
  }

  return (
    <div ref={pageRef} className={styles.savedItinerariesPage}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Your Saved Itineraries</h1>
          <p className={styles.subtitle}>
            Access and manage all your previously generated travel plans
          </p>
          {savedItineraries.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🗺️</div>
              <h3>No saved itineraries yet</h3>
              <p>Generate your first travel plan to see it here!</p>
              <Link to="/" className="btn btn-primary">
                Create New Itinerary
              </Link>
            </div>
          )}
        </div>

        {/* Itineraries Grid */}
        {savedItineraries.length > 0 && (
          <div className={styles.itinerariesGrid}>
            {savedItineraries.map((itinerary, index) => (
              <div
                key={itinerary.id}
                ref={el => cardsRef.current[index] = el}
                className={styles.itineraryCard}
              >
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{itinerary.destination}</h3>
                  <div className={styles.cardActions}>
                    <button
                      onClick={() => deleteItinerary(itinerary.id)}
                      className={styles.deleteButton}
                      title="Delete itinerary"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div className={styles.cardContent}>
                  <div className={styles.itineraryInfo}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Duration:</span>
                      <span className={styles.infoValue}>{itinerary.numberOfDays} days</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Budget:</span>
                      <span className={styles.infoValue}>₹{itinerary.budget?.toLocaleString()}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Created:</span>
                      <span className={styles.infoValue}>{formatDate(itinerary.createdAt)}</span>
                    </div>
                  </div>

                  {itinerary.travelOptions && (
                    <div className={styles.travelOptions}>
                      <h4>Travel Options:</h4>
                      <div className={styles.travelGrid}>
                        {Object.entries(itinerary.travelOptions).map(([type, option]) => (
                          <div key={type} className={styles.travelOption}>
                            <span className={styles.travelType}>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                            <span className={styles.travelDuration}>{option.duration}</span>
                            <span className={styles.travelPrice}>{option.price_range}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={styles.cardActions}>
                    <button
                      onClick={() => {
                        // Store itinerary data and navigate to itinerary page
                        localStorage.setItem('currentItinerary', JSON.stringify(itinerary));
                        window.location.href = '/itinerary';
                      }}
                      className="btn btn-primary"
                      style={{width: '100%'}}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        {savedItineraries.length > 0 && (
          <div className={styles.ctaSection}>
            <h2 className={styles.ctaTitle}>Need a New Adventure?</h2>
            <p className={styles.ctaSubtitle}>
              Create another amazing travel itinerary
            </p>
            <Link to="/" className="btn btn-primary" style={{fontSize: '1.1rem', padding: '0.8rem 2rem'}}>
              Plan New Trip
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedItinerariesPage;
