import React, { useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import styles from './ItineraryPage.module.css'; // We will create this
import anime from 'animejs';

function ItineraryPage({ itineraryData }) { // Receive data as a prop from App.jsx
  const location = useLocation();
  const navigate = useNavigate();

  // Use the data passed from App.jsx, or from location.state as a fallback, or from localStorage
  const data = itineraryData || location.state?.itineraryData || JSON.parse(localStorage.getItem('currentItinerary') || 'null'); 

  const pageRef = useRef(null);

  useEffect(() => {
    // Scroll to top and animate the page fade-in
    window.scrollTo(0, 0);
    anime({
      targets: pageRef.current,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      easing: 'easeOutExpo'
    });
    
    // Animate the day cards staggering in
    anime({
        targets: `.${styles.dayCard}`, // Use the CSS module class
        opacity: [0, 1],
        translateY: [30, 0],
        delay: anime.stagger(150, {start: 300}), // Staggered delay
        easing: 'easeOutExpo'
    });
  }, [data]); // Rerun if data changes

  if (!data || !data.dailyPlans) {
    // If no data, show an error and link back home
    return (
        <div className="container" style={{textAlign: 'center', padding: '2rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-error)'}}>Error: No Itinerary Data</h2>
            <p style={{color: 'var(--color-text-secondary)', margin: '1rem 0'}}>
              It looks like you haven't generated an itinerary, or you navigated here directly.
            </p>
            <button onClick={() => navigate('/')} className="btn btn-primary">
                Go to Home
            </button>
        </div>
    );
  }

  const { dailyPlans, weatherInfo, airQualityInfo, travelOptions } = data;

  return (
    <div ref={pageRef} className={`${styles.itineraryPage} container`}>
      <h2 className={styles.itineraryTitle}>Your Personalized Itinerary</h2>
      
      {/* Context Box (Weather & AQI) */}
      {data.budgetBreakdown && (
        <div className={styles.contextBox}>
          <h3 className={styles.contextTitle}>Budget Breakdown</h3>
          <div className={styles.contextGrid}>
            <div>
              <p><strong>Members:</strong> {data.budgetBreakdown.members}</p>
              {data.budgetBreakdown.dietaryPreference && (
                <p><strong>Diet:</strong> {data.budgetBreakdown.dietaryPreference}</p>
              )}
            </div>
            <div>
              {typeof data.budgetBreakdown.approxHotelNightly === 'number' && (
                <p><strong>Hotel (approx/night):</strong> ₹{Math.round(data.budgetBreakdown.approxHotelNightly).toLocaleString()}</p>
              )}
            </div>
            <div>
              {typeof data.budgetBreakdown.foodApprox === 'number' && (
                <p><strong>Food (approx):</strong> ₹{Math.round(data.budgetBreakdown.foodApprox).toLocaleString()}</p>
              )}
              {typeof data.budgetBreakdown.localTransportApprox === 'number' && (
                <p><strong>Local Transport (approx):</strong> ₹{Math.round(data.budgetBreakdown.localTransportApprox).toLocaleString()}</p>
              )}
            </div>
            <div>
              {typeof data.budgetBreakdown.activitiesApprox === 'number' && (
                <p><strong>Activities (approx):</strong> ₹{Math.round(data.budgetBreakdown.activitiesApprox).toLocaleString()}</p>
              )}
              {typeof data.budgetBreakdown.approxTotal === 'number' && (
                <p><strong>Approx Total:</strong> ₹{Math.round(data.budgetBreakdown.approxTotal).toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Context Box (Weather & AQI) */}
      <div className={styles.contextBox}>
        <h3 className={styles.contextTitle}>Trip Context</h3>
        <div className={styles.contextGrid}>
          <div>
            <h4>Weather Forecast:</h4>
            <p>{weatherInfo || 'Not available'}</p>
          </div>
           <div>
            <h4>Air Quality:</h4>
            <p>{airQualityInfo || 'Not available'}</p>
          </div>
        </div>
      </div>

      {/* Travel Options */}
      {travelOptions && (
        <div className={styles.travelOptionsBox}>
          <h3 className={styles.contextTitle}>Travel Options</h3>
          <div className={styles.travelOptionsGrid}>
            {/* Flight Option removed per requirements */}

            {/* Train Option */}
            {travelOptions.train && (
              <div className={styles.travelOptionCard}>
                <h4 className={styles.travelOptionTitle}>🚂 Train</h4>
                <div className={styles.travelOptionDetails}>
                  <p><strong>Description:</strong> {travelOptions.train.description}</p>
                  {travelOptions.train.booking_links && (
                    <div className={styles.itemLinks} style={{marginTop: '0.5rem'}}>
                      <a href={travelOptions.train.booking_links.search_url} target="_blank" rel="noopener noreferrer">Search Trains</a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bus Option */}
            {travelOptions.bus && (
              <div className={styles.travelOptionCard}>
                <h4 className={styles.travelOptionTitle}>🚌 Bus</h4>
                <div className={styles.travelOptionDetails}>
                  <p><strong>Description:</strong> {travelOptions.bus.description}</p>
                  {travelOptions.bus.booking_links && (
                    <div className={styles.itemLinks} style={{marginTop: '0.5rem'}}>
                      <a href={travelOptions.bus.booking_links.search_url} target="_blank" rel="noopener noreferrer">Search Buses</a>
                      {travelOptions.bus.booking_links.google_search_url && (
                        <a href={travelOptions.bus.booking_links.google_search_url} target="_blank" rel="noopener noreferrer">Google</a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hotel Booking */}
      {data.hotelBooking && data.hotelBooking.available && (
        <div className={styles.travelOptionsBox}>
          <h3 className={styles.contextTitle}>🏨 Hotel Options</h3>
          <div className={styles.travelOptionsGrid}>
            {data.hotelBooking.hotels.map((hotel, index) => (
              <div key={index} className={styles.travelOptionCard}>
                <h4 className={styles.travelOptionTitle}>{hotel.name}</h4>
                <div className={styles.travelOptionDetails}>
                  <p><strong>Price:</strong> {hotel.price}</p>
                  <p><strong>Rating:</strong> {hotel.rating}/10</p>
                </div>
              </div>
            ))}
            {data.hotelBooking.booking_links && (
              <div className={styles.travelOptionCard}>
                <h4 className={styles.travelOptionTitle}>Book Hotels</h4>
                <div className={styles.travelOptionDetails}>
                  <div className={styles.itemLinks}>
                    <a href={data.hotelBooking.booking_links.search_url} target="_blank" rel="noopener noreferrer">Search All Hotels</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Daily Plans Loop */}
      <div className={styles.plansContainer}>
        {dailyPlans.map((dayPlan) => (
          <div key={dayPlan.day} className={styles.dayCard}>
            <div className={styles.dayCardHeader}>
              <h3 className={styles.dayCardTitle}>Day {dayPlan.day}</h3>
            </div>
            <div className={styles.dayCardBody}>
              <p className={styles.dayCardNarrative}>{dayPlan.narrative}</p>

              {/* Suggested Hotel (if AI added it) */}
              {dayPlan.suggested_hotel && (
                <div className={styles.itemSection}>
                  <h4 className={styles.itemTitle}>🏨 Suggested Hotel:</h4>
                  <ul className={styles.itemList}>
                    <li className={styles.itemListItem}>
                      <span>{dayPlan.suggested_hotel.name}</span>
                      {dayPlan.suggested_hotel.links && (
                         <div className={styles.itemLinks}>
                           {dayPlan.suggested_hotel.links.search_url && (
                             <a href={dayPlan.suggested_hotel.links.search_url} target="_blank" rel="noopener noreferrer">Map</a>
                           )}
                           {dayPlan.suggested_hotel.links.google_search_url && (
                             <a href={dayPlan.suggested_hotel.links.google_search_url} target="_blank" rel="noopener noreferrer">Info</a>
                           )}
                         </div>
                      )}
                    </li>
                  </ul>
                </div>
              )}

              {/* Activities */}
              {dayPlan.activities && dayPlan.activities.length > 0 && (
                <div className={styles.itemSection}>
                  <h4 className={styles.itemTitle}>Activities:</h4>
                  <ul className={styles.itemList}>
                    {dayPlan.activities.map((activity, actIndex) => (
                      <li key={actIndex} className={styles.itemListItem}>
                        <span>{activity.name}</span>
                        {activity.links && (
                           <div className={styles.itemLinks}>
                             {activity.links.search_url && (
                               <a href={activity.links.search_url} target="_blank" rel="noopener noreferrer">Map</a>
                             )}
                             {activity.links.directions_url && (
                               <a href={activity.links.directions_url} target="_blank" rel="noopener noreferrer">Directions</a>
                             )}
                           </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Restaurants */}
              {dayPlan.restaurants && dayPlan.restaurants.length > 0 && (
                <div className={styles.itemSection}>
                  <h4 className={styles.itemTitle}>Dining Suggestions:</h4>
                  <ul className={styles.itemList}>
                     {dayPlan.restaurants.map((resto, restoIndex) => (
                      <li key={restoIndex} className={styles.itemListItem}>
                        <span>{resto.name}</span>
                         {resto.links && (
                           <div className={styles.itemLinks}>
                             {resto.links.search_url && (
                               <a href={resto.links.search_url} target="_blank" rel="noopener noreferrer">Map</a>
                             )}
                             {resto.links.directions_url && (
                               <a href={resto.links.directions_url} target="_blank" rel="noopener noreferrer">Directions</a>
                             )}
                           </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Transport */}
              {dayPlan.transport_suggestion && (
                 <div className={styles.itemSection}>
                   <h4 className={styles.itemTitle} style={{fontSize: '1.1rem'}}>Transport:</h4>
                   <p className={styles.transportText}>{dayPlan.transport_suggestion}</p>
                 </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItineraryPage;