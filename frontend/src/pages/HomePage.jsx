import React, { useState, useRef, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import anime from 'animejs';
import styles from './HomePage.module.css';
import { API_URL } from '../config/api';

// Quick Plan Modal Component
const QuickPlanModal = ({ isOpen, onClose, onGenerate, isLoading }) => {
  const [startDate, setStartDate] = useState('');
  const [budget, setBudget] = useState('');
  const [originCity, setOriginCity] = useState('Delhi');
  const [numberOfMembers, setNumberOfMembers] = useState(1);
  const [dietaryPreference, setDietaryPreference] = useState('');
  const [hotelPreference, setHotelPreference] = useState('');
  const [tripType, setTripType] = useState('standard');
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const place = localStorage.getItem('selectedPlace');
      if (place) {
        setSelectedPlace(JSON.parse(place));
        localStorage.removeItem('selectedPlace');
      }
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (startDate && budget && selectedPlace) {
      onGenerate({
        destination: selectedPlace.name,
        startDate: startDate,
        budget: parseFloat(budget),
        originCity: originCity,
        preferences: selectedPlace.highlights,
        numberOfMembers: parseInt(numberOfMembers || 1),
        dietaryPreference: dietaryPreference,
        hotelPreference: hotelPreference,
        tripType: tripType
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>🚀 Quick Plan for {selectedPlace?.name}</h3>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label className="form-label">Origin City</label>
            <select
              value={originCity}
              onChange={(e) => setOriginCity(e.target.value)}
              className="form-input"
              required
            >
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Ahmedabad">Ahmedabad</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className="form-label">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-input"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className="form-label">Budget (INR)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="form-input"
              placeholder="e.g., 20000"
              min="1000"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className="form-label">Members</label>
            <input
              type="number"
              value={numberOfMembers}
              onChange={(e) => setNumberOfMembers(e.target.value)}
              className="form-input"
              placeholder="e.g., 2"
              min="1"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className="form-label">Diet</label>
            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value)}
              className="form-input"
            >
              <option value="">No preference</option>
              <option value="veg">Veg</option>
              <option value="non-veg">Non-veg</option>
              <option value="both">Both veg + non-veg</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className="form-label">Hotel Preference</label>
            <select
              value={hotelPreference}
              onChange={(e) => setHotelPreference(e.target.value)}
              className="form-input"
            >
              <option value="">Any</option>
              <option value="budget">Budget</option>
              <option value="mid">Mid-range</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className="form-label">Trip Type</label>
            <select
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
              className="form-input"
            >
              <option value="budget">Budget-friendly</option>
              <option value="standard">Standard</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? '🔄 Generating...' : 'Generate Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; // We will create this

// Reusable Message Component
const MessageCard = ({ message, type = 'info' }) => {
  if (!message) return null;
  const typeClass = `message-card-${type}`;
  return (
    <div className={`message-card ${typeClass}`} role="alert">
      <p>{message}</p>
    </div>
  );
};

function HomePage({ onItineraryGenerated }) { // Receive prop from App.jsx
  const { token, isLoggedIn, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showQuickPlan, setShowQuickPlan] = useState(false);
  
  const heroTitleRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    // Check if user came from Places page with selected place
    const selectedPlace = localStorage.getItem('selectedPlace');
    if (selectedPlace) {
      setShowQuickPlan(true);
    }

    // Animate hero text on load
    anime.timeline({ easing: 'easeOutExpo' })
      .add({
        targets: heroTitleRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800
      })
      .add({
        targets: heroSubtitleRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800
      }, '-=600'); // Start 600ms before previous animation ends
  }, []);

  const handleQuickPlanGenerate = async (planData) => {
    if (!isLoggedIn) {
      setErrorMessage('Please log in or sign up to generate an itinerary. Click here to login.');
      // Close the modal and redirect to login
      setShowQuickPlan(false);
      window.location.href = '/login';
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Create request data for the API
      const requestData = {
        destination: planData.destination,
        numberOfDays: 5, // Fixed to 5 days for quick plan
        budget: planData.budget,
        preferences: planData.preferences,
        numberOfMembers: planData.numberOfMembers,
        dietaryPreference: planData.dietaryPreference,
        originCity: planData.originCity || 'Delhi',
        startDate: planData.startDate,
        hotelPreference: planData.hotelPreference,
        tripType: planData.tripType || 'standard'
      };

      console.log('Quick Plan - Request Data:', requestData);
      console.log('Quick Plan - Token exists:', !!token);
      console.log('Quick Plan - Token preview:', token ? `${token.substring(0, 20)}...` : 'No token');
      console.log('Quick Plan - isLoggedIn:', isLoggedIn);

      // Make the API call to generate itinerary
      const response = await axios.post(`${API_URL}/itinerary/generate`, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // Pass the actual itinerary data to the parent component
      onItineraryGenerated(response.data);

    } catch (error) {
      console.error("Quick plan generation failed:", error);
      
      // If we get a 401 error, the token is invalid - logout the user
      if (error.response && error.response.status === 401) {
        console.log('401 error detected, logging out user');
        logout();
        setErrorMessage('Your session has expired. Please log in again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }
      
      let msg = 'Plan generation failed. Please check your connection.';
      if (error.response && error.response.data && (error.response.data.error || error.response.data.message)) {
        msg = `Plan generation failed: ${error.response.data.error || error.response.data.message}`;
      } else if (error.message) {
        msg = `Plan generation failed: ${error.message}`;
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <div
        className={styles.heroSection}
        // Replace with your beautiful Taj Mahal image URL from the PPT
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5371e?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className={styles.heroOverlay}></div>
        <div className={`${styles.heroContent} container`}>
          <h1 ref={heroTitleRef} className={styles.heroTitle}>
            Life Is Adventure
            <br />
            Make The Best Of It
          </h1>
          <p ref={heroSubtitleRef} className={styles.heroSubtitle}>
            Your AI-powered travel partner for personalized, budget-friendly, and optimized itineraries.
            {!isLoggedIn && (
              <span style={{display: 'block', marginTop: '1rem', fontSize: '0.9rem', color: '#fbbf24'}}>
                ⚠️ Please log in to generate travel plans
              </span>
            )}
          </p>
          <SearchBar 
            onSearchStart={() => {
              setIsLoading(true);
              setErrorMessage(null);
            }}
            onSearchSuccess={onItineraryGenerated} // Pass data up to App.jsx
            onSearchError={(msg) => {
              setIsLoading(false);
              setErrorMessage(msg);
            }}
          />
          <div className={styles.messageContainer}>
            {isLoading && <MessageCard message="Generating your trip... This may take a moment." type="info" />}
            {errorMessage && <MessageCard message={errorMessage} type="error" />}
          </div>
        </div>
      </div>

      {/* Features/Icons Section (From PPT) */}
      <div ref={featuresRef} className={`${styles.featuresSection} container`}>
        {[
          { title: "Find Your Dream Stay", icon: "🏨" },
          { title: "Cheap Holiday Packages", icon: "✈️" },
          { title: "Effortless Check-in", icon: "✅" },
          { title: "Explore Places", icon: "🗺️" }
        ].map((item) => (
          <div key={item.title} className={styles.featureCard}>
            <div className={styles.featureIcon}>{item.icon}</div>
            <h3 className={styles.featureTitle}>{item.title}</h3>
            <p className={styles.featureText}>Discover unique accommodations and experiences.</p>
          </div>
        ))}
      </div>
      
      {/* Featured Trips Section (From PPT) */}
      <div className={styles.featuredSection}>
         <div className="container">
           <h2 className={styles.sectionTitle}>Featured Trips</h2>
           <p className={styles.sectionSubtitle}>
              Explore our featured journeys through India's most iconic destinations.
            </p>
           <div className={styles.featuredGrid}>
             {/* Example Card 1 */}
             <div className={styles.tripCard}>
               <img src="https://placehold.co/600x400/333/FFF?text=Gokarna+Beach" alt="Gokarna" />
               <div className={styles.tripCardContent}>
                 <h3 className={styles.tripCardTitle}>GOKARNA</h3>
                 <p className={styles.tripCardText}>A serene 3-day escape along the beaches and temples...</p>
                 <button className="btn btn-primary" style={{width: '100%'}}>View Trip Details</button>
               </div>
             </div>
             {/* Example Card 2 */}
             <div className={styles.tripCard}>
               <img src="https://placehold.co/600x400/444/FFF?text=Varkala+Cliffs" alt="Varkala" />
               <div className={styles.tripCardContent}>
                 <h3 className={styles.tripCardTitle}>VARKALA, KERLA</h3>
                 <p className={styles.tripCardText}>A coastal escape where cliffs meet the ocean in Varkala...</p>
                 <button className="btn btn-primary" style={{width: '100%'}}>View Trip Details</button>
               </div>
             </div>
             {/* Example Card 3 */}
             <div className={styles.tripCard}>
               <img src="https://placehold.co/600x400/555/FFF?text=Meghalaya+Falls" alt="Meghalaya" />
               <div className={styles.tripCardContent}>
                 <h3 className={styles.tripCardTitle}>Meghalaya</h3>
                 <p className={styles.tripCardText}>A serene 3-day escape in the misty hills of Meghalaya...</p>
                 <button className="btn btn-primary" style={{width: '100%'}}>View Trip Details</button>
               </div>
             </div>
           </div>
         </div>
       </div>

      {/* Quick Plan Modal */}
      <QuickPlanModal 
        isOpen={showQuickPlan}
        onClose={() => setShowQuickPlan(false)}
        onGenerate={handleQuickPlanGenerate}
        isLoading={isLoading}
      />

    </div>
  );
}

export default HomePage;