import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import anime from 'animejs';
import styles from './SearchBar.module.css';

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

function SearchBar({ onSearchStart, onSearchSuccess, onSearchError }) {
  const { token, isLoggedIn, logout } = useAuth(); // Get token and login state
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [preferences, setPreferences] = useState('');
  const [numberOfMembers, setNumberOfMembers] = useState(1);
  const [dietaryPreference, setDietaryPreference] = useState('');
  const [hotelPreference, setHotelPreference] = useState(''); // budget | mid | luxury
  const [tripType, setTripType] = useState('standard'); // budget | standard | luxury
  const [isLoading, setIsLoading] = useState(false);
  
  const formRef = useRef(null);

  // Animate the search bar on load
  useEffect(() => {
    anime({
      targets: formRef.current,
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 1000,
      delay: 400, // Delay to let title fade in
      easing: 'easeOutExpo'
    });
  }, []);

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const date1 = new Date(start);
    const date2 = new Date(end);
    if (isNaN(date1) || isNaN(date2) || date2 < date1) return 0;
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include start day
    return diffDays;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    onSearchError(null); 

    if (!isLoggedIn) {
      onSearchError('Please log in or sign up to generate an itinerary. Click here to login.');
      // Redirect to login page
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return;
    }

    const numberOfDays = calculateDays(startDate, endDate);
    if (numberOfDays <= 0) {
      onSearchError("Please select a valid date range (end date must be on or after start date).");
      return;
    }
    if (!destination.trim()) {
      onSearchError("Please enter a destination.");
      return;
    }
    
    const budgetNum = parseFloat(budget) || 0;
    const prefArray = preferences.split(',').map(pref => pref.trim()).filter(pref => pref.length > 0);

    const requestBody = {
      destination: destination,
      numberOfDays: numberOfDays,
      budget: budgetNum,
      preferences: prefArray,
      numberOfMembers: parseInt(numberOfMembers || 1),
      dietaryPreference: dietaryPreference,
      hotelPreference: hotelPreference,
      tripType: tripType
    };

    setIsLoading(true);
    onSearchStart(); 

    try {
      console.log('SearchBar - Request Body:', requestBody);
      console.log('SearchBar - Token exists:', !!token);
      console.log('SearchBar - Token preview:', token ? `${token.substring(0, 20)}...` : 'No token');
      console.log('SearchBar - isLoggedIn:', isLoggedIn);
      
      // Use Axios for the API call
      const response = await axios.post(`${API_URL}/itinerary/generate`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Send the JWT token
        }
      });
      
      // Axios puts the data directly in `response.data`
      onSearchSuccess(response.data);

    } catch (error) {
      console.error("Search failed:", error);
      
      // If we get a 401 error, the token is invalid - logout the user
      if (error.response && error.response.status === 401) {
        console.log('401 error detected in SearchBar, logging out user');
        logout();
        onSearchError('Your session has expired. Please log in again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }
      
      let msg = 'Search failed. Please check your connection.';
      if (error.response && error.response.data && (error.response.data.error || error.response.data.message)) {
        // Use the specific error from our Flask backend
        msg = `Search failed: ${error.response.data.error || error.response.data.message}`;
      } else if (error.message) {
        msg = `Search failed: ${error.message}`;
      }
      onSearchError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form ref={formRef} onSubmit={handleSearch} className={styles.searchBar}>
      {/* Destination (matches PPT 'Where') */}
      <div className={styles.inputGroup} style={{flexGrow: 2}}>
        <label htmlFor="destination" className="form-label">Where</label>
        <input
          type="text" id="destination" value={destination} onChange={(e) => setDestination(e.target.value)}
          placeholder="Search destinations"
          className="form-input"
          required
        />
      </div>

      {/* Dates (matches PPT 'When') */}
      <div className={`${styles.inputGroup} ${styles.dateGroup}`} style={{flexGrow: 1.5}}>
        <div>
            <label htmlFor="start-date" className="form-label">When (Start)</label>
            <input
              type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="form-input"
              min={today} required
            />
        </div>
        <div>
             <label htmlFor="end-date" className="form-label">When (End)</label>
            <input
              type="date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="form-input"
              min={startDate || today} required
            />
        </div>
      </div>

      {/* Budget (matches PPT) */}
      <div className={styles.inputGroup} style={{flexGrow: 0.75}}>
        <label htmlFor="budget" className="form-label">Budget (INR)</label>
        <input
          type="number" id="budget" value={budget} onChange={(e) => setBudget(e.target.value)}
          placeholder="e.g., 15000" min="0"
          className="form-input"
        />
      </div>
      
      {/* Preferences (Extra field) */}
      <div className={styles.inputGroup} style={{flexGrow: 1}}>
        <label htmlFor="preferences" className="form-label">Preferences</label>
        <input
          type="text" id="preferences" value={preferences} onChange={(e) => setPreferences(e.target.value)}
          placeholder="history, food, beach"
          className="form-input"
        />
      </div>

      {/* Members */}
      <div className={styles.inputGroup} style={{flexGrow: 0.5}}>
        <label htmlFor="members" className="form-label">Members</label>
        <input
          type="number" id="members" value={numberOfMembers}
          onChange={(e) => setNumberOfMembers(e.target.value)}
          className="form-input" min="1" placeholder="1"
          required
        />
      </div>

      {/* Diet */}
      <div className={styles.inputGroup} style={{flexGrow: 0.75}}>
        <label htmlFor="diet" className="form-label">Diet</label>
        <select id="diet" value={dietaryPreference} onChange={(e) => setDietaryPreference(e.target.value)} className="form-input">
          <option value="">No preference</option>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-veg</option>
          <option value="both">Both veg + non-veg</option>
        </select>
      </div>

      {/* Hotel Preference */}
      <div className={styles.inputGroup} style={{flexGrow: 0.75}}>
        <label htmlFor="hotelPref" className="form-label">Hotel Preference</label>
        <select id="hotelPref" value={hotelPreference} onChange={(e) => setHotelPreference(e.target.value)} className="form-input">
          <option value="">Any</option>
          <option value="budget">Budget</option>
          <option value="mid">Mid-range</option>
          <option value="luxury">Luxury</option>
        </select>
      </div>

      {/* Trip Type */}
      <div className={styles.inputGroup} style={{flexGrow: 0.75}}>
        <label htmlFor="tripType" className="form-label">Trip Type</label>
        <select id="tripType" value={tripType} onChange={(e) => setTripType(e.target.value)} className="form-input">
          <option value="budget">Budget-friendly</option>
          <option value="standard">Standard</option>
          <option value="luxury">Luxury</option>
        </select>
      </div>

      {/* Submit Button (matches PPT 'Browse Trip') */}
      <button type="submit" disabled={isLoading} className={`btn btn-primary ${styles.searchButton}`}>
        {isLoading ? <span className="spinner"></span> : "Browse Trip"}
      </button>
    </form>
  );
}

export default SearchBar;