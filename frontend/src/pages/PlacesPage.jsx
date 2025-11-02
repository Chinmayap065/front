import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import anime from 'animejs';
import styles from './PlacesPage.module.css';

const PlacesPage = () => {
  const { isLoggedIn } = useAuth();
  const pageRef = useRef(null);
  const cardsRef = useRef([]);
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic places data that refreshes
  const allPlaces = [
    {
      id: 1,
      name: "Goa",
      image: "https://stock.adobe.com/search?k=goa", // Basilica of Bom Jesus, Goa
      description: "Sun-kissed beaches, vibrant nightlife, and Portuguese heritage",
      highlights: ["Beaches", "Nightlife", "Heritage Sites"],
      bestTime: "Nov - Mar",
      duration: "3-5 days",
      budget: "₹15,000 - ₹25,000"
    },
    {
      id: 2,
      name: "Kerala",
      image: "https://w0.peakpx.com/wallpaper/355/655/HD-wallpaper-kettuvallam-houseboat-kerala-india-asia-k-kerala-india-india-asia-kerala-landscape.jpg", // Kerala backwaters
      description: "Backwaters, hill stations, and rich cultural experiences",
      highlights: ["Backwaters", "Hill Stations", "Ayurveda"],
      bestTime: "Oct - Mar",
      duration: "5-7 days",
      budget: "₹20,000 - ₹35,000"
    },
    {
      id: 3,
      name: "Rajasthan",
      image: "https://www.wallpaperflare.com/search?wallpaper=rajasthan", // Hawa Mahal, Jaipur
      description: "Royal palaces, desert landscapes, and colorful festivals",
      highlights: ["Palaces", "Desert", "Festivals"],
      bestTime: "Oct - Mar",
      duration: "7-10 days",
      budget: "₹25,000 - ₹40,000"
    },
    {
      id: 4,
      name: "Himachal Pradesh",
      image: "https://www.gettyimages.in/photos/himachal-pradesh",
      description: "Snow-capped mountains, adventure sports, and serene valleys",
      highlights: ["Mountains", "Adventure", "Temples"],
      bestTime: "Apr - Jun, Sep - Nov",
      duration: "5-8 days",
      budget: "₹18,000 - ₹30,000"
    },
    {
      id: 5,
      name: "Karnataka",
      image: "https://stock.adobe.com/search?k=karnataka", // Hampi, Karnataka
      description: "Ancient temples, coffee plantations, and tech hubs",
      highlights: ["Temples", "Coffee", "Wildlife"],
      bestTime: "Oct - Mar",
      duration: "4-6 days",
      budget: "₹12,000 - ₹22,000"
    },
    {
      id: 6,
      name: "Tamil Nadu",
      image: "https://www.shutterstock.com/video/search/tamil-nadu-drawing", // Meenakshi Amman Temple, Madurai
      description: "Dravidian architecture, classical dance, and coastal beauty",
      highlights: ["Temples", "Dance", "Coast"],
      bestTime: "Oct - Mar",
      duration: "6-8 days",
      budget: "₹15,000 - ₹28,000"
    },
    {
      id: 7,
      name: "Ladakh",
      image: "https://www.istockphoto.com/photos/leh-ladakh",
      description: "High-altitude desert, Buddhist monasteries, and stunning landscapes",
      highlights: ["Monasteries", "Lakes", "Adventure"],
      bestTime: "May - Sep",
      duration: "6-10 days",
      budget: "₹30,000 - ₹50,000"
    },
    {
      id: 8,
      name: "Sikkim",
      image: "https://stock.adobe.com/search?k=sikkim", // Sikkim landscape
      description: "Himalayan beauty, Buddhist culture, and pristine nature",
      highlights: ["Mountains", "Culture", "Nature"],
      bestTime: "Mar - May, Sep - Nov",
      duration: "5-7 days",
      budget: "₹20,000 - ₹35,000"
    }
  ];

  // Function to shuffle and refresh places
  const refreshPlaces = () => {
    setIsLoading(true);
    setTimeout(() => {
      const shuffled = [...allPlaces].sort(() => Math.random() - 0.5);
      setPlaces(shuffled.slice(0, 6)); // Show 6 random places
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    // Initial load with random places
    refreshPlaces();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isLoading) {
      // Page entrance animation
      anime({
        targets: pageRef.current,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        easing: 'easeOutExpo'
      });

      // Staggered card animations
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

  const handlePlanIt = (place) => {
    if (!isLoggedIn) {
      // If not logged in, redirect to login page
      alert('Please log in to generate a travel plan!');
      window.location.href = '/login';
      return;
    }
    
    // Store selected place in localStorage for the plan generation
    localStorage.setItem('selectedPlace', JSON.stringify(place));
    // Navigate to home page where user can generate plan
    window.location.href = '/';
  };

  return (
    <div ref={pageRef} className={styles.placesPage}>
      <div className="container">
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <h1 className={styles.heroTitle}>Discover Amazing Places</h1>
          <p className={styles.heroSubtitle}>
            Explore India's most beautiful destinations with our curated travel experiences
          </p>
          <button 
            onClick={refreshPlaces} 
            className="btn btn-secondary"
            style={{marginTop: '1rem'}}
            disabled={isLoading}
          >
            {isLoading ? '🔄 Refreshing...' : '🔄 Refresh Places'}
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Discovering new destinations...</p>
          </div>
        )}

        {/* Places Grid */}
        {!isLoading && (
          <div className={styles.placesGrid}>
            {places.map((place, index) => (
              <div
                key={place.id}
                ref={el => cardsRef.current[index] = el}
                className={styles.placeCard}
              >
                <div className={styles.cardImage}>
                  <img src={place.image} alt={place.name} />
                  <div className={styles.cardOverlay}>
                    <div className={styles.cardBadges}>
                      <span className={styles.badge}>{place.bestTime}</span>
                      <span className={styles.badge}>{place.duration}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{place.name}</h3>
                  <p className={styles.cardDescription}>{place.description}</p>
                  <div className={styles.budgetInfo}>
                    <span className={styles.budgetLabel}>Budget Range:</span>
                    <span className={styles.budgetAmount}>{place.budget}</span>
                  </div>
                  <div className={styles.cardHighlights}>
                    {place.highlights.map((highlight, idx) => (
                      <span key={idx} className={styles.highlight}>
                        {highlight}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => handlePlanIt(place)}
                    className="btn btn-primary" 
                    style={{width: '100%', marginTop: '1rem'}}
                  >
                    🚀 Plan It Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Ready for Your Next Adventure?</h2>
          <p className={styles.ctaSubtitle}>
            Let our AI create a personalized itinerary for any destination
          </p>
          <Link to="/" className="btn btn-primary" style={{fontSize: '1.1rem', padding: '0.8rem 2rem'}}>
            Start Planning
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlacesPage;
