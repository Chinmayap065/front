import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ItineraryPage from './pages/ItineraryPage';
import PlacesPage from './pages/PlacesPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import SavedItinerariesPage from './pages/SavedItinerariesPage';
import Navbar from './components/Navbar';

function App() {
  // This state will hold the AI's response and pass it to the Itinerary page
  const [itineraryData, setItineraryData] = useState(null);
  const navigate = useNavigate(); // Hook to change pages

  // This function is passed to HomePage, which passes it to SearchBar.
  // SearchBar calls this on a successful API response.
  const handleItineraryGenerated = (data) => {
    console.log("Itinerary data received by App:", data);
    if (data && data.dailyPlans) {
      // Save itinerary to localStorage
      const itineraryToSave = {
        ...data,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        destination: data.destination || 'Unknown',
        numberOfDays: data.numberOfDays || data.dailyPlans.length,
        budget: data.budget || 0
      };
      
      const savedItineraries = JSON.parse(localStorage.getItem('savedItineraries') || '[]');
      savedItineraries.unshift(itineraryToSave); // Add to beginning
      localStorage.setItem('savedItineraries', JSON.stringify(savedItineraries));
      
      setItineraryData(data); // Save the data
      navigate('/itinerary');  // Navigate to the itinerary page
    } else {
      // Handle cases where the backend sent an error
      console.error("Invalid itinerary data received:", data);
      // The error is already shown on the HomePage, so just log it here.
    }
  };

  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          {/* Pass the handler function down to HomePage */}
          <Route 
            path="/" 
            element={<HomePage onItineraryGenerated={handleItineraryGenerated} />} 
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* Pass the saved data down to ItineraryPage */}
          <Route 
            path="/itinerary" 
            element={<ItineraryPage itineraryData={itineraryData} />} 
          />
          
          {/* Beautiful pages for navbar links */}
          <Route path="/places" element={<PlacesPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/saved" element={<SavedItinerariesPage />} />
          
          <Route path="*" element={<div className="container" style={{textAlign: 'center', padding: '2rem'}}><h1 style={{fontSize: '2rem', fontWeight: '700'}}>404 Not Found</h1></div>} />
        </Routes>
      </main>
      
       <footer style={{backgroundColor: 'var(--color-bg-dark)', padding: '2rem', marginTop: '4rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem', borderTop: '1px solid var(--color-border)'}}>
         © {new Date().getFullYear()} Tripster. All rights reserved.
       </footer>
    </div>
  );
}

export default App;