import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import anime from 'animejs';
import styles from './ServicesPage.module.css';

const ServicesPage = () => {
  const pageRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    // Page entrance animation
    anime({
      targets: pageRef.current,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      easing: 'easeOutExpo'
    });

    // Staggered section animations
    anime({
      targets: sectionsRef.current,
      opacity: [0, 1],
      translateY: [50, 0],
      delay: anime.stagger(150, {start: 300}),
      duration: 600,
      easing: 'easeOutExpo'
    });
  }, []);

  const services = [
    {
      icon: "🤖",
      title: "AI-Powered Itinerary Planning",
      description: "Our advanced AI creates personalized travel plans based on your preferences, budget, and interests.",
      features: ["Personalized recommendations", "Budget optimization", "Real-time weather integration", "Local insights"]
    },
    {
      icon: "🏨",
      title: "Smart Accommodation Booking",
      description: "Find the perfect stay with our intelligent hotel and accommodation recommendations.",
      features: ["Best price guarantee", "Location-based suggestions", "Reviews & ratings", "Instant booking"]
    },
    {
      icon: "🍽️",
      title: "Culinary Experiences",
      description: "Discover authentic local cuisine and dining experiences tailored to your taste.",
      features: ["Local restaurant guides", "Food tour recommendations", "Dietary preferences", "Cultural dining"]
    },
    {
      icon: "📱",
      title: "24/7 Travel Support",
      description: "Round-the-clock assistance for all your travel needs and emergencies.",
      features: ["24/7 helpline", "Emergency assistance", "Local guides", "Multilingual support"]
    }
  ];

  const features = [
    {
      title: "Personalized Planning",
      description: "Every itinerary is crafted specifically for you using advanced AI algorithms.",
      icon: "🎯"
    },
    {
      title: "Real-time Updates",
      description: "Get live weather, traffic, and event updates to optimize your journey.",
      icon: "⚡"
    },
    {
      title: "Budget Optimization",
      description: "Smart algorithms help you get the best value for your money.",
      icon: "💰"
    },
    {
      title: "Local Expertise",
      description: "Access to local insights and hidden gems in every destination.",
      icon: "🗺️"
    }
  ];

  return (
    <div ref={pageRef} className={styles.servicesPage}>
      <div className="container">
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <h1 className={styles.heroTitle}>Our Services</h1>
          <p className={styles.heroSubtitle}>
            Comprehensive travel solutions powered by AI to make your journey unforgettable
          </p>
        </div>

        {/* Services Grid */}
        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <div
              key={index}
              ref={el => sectionsRef.current[index] = el}
              className={styles.serviceCard}
            >
              <div className={styles.serviceIcon}>{service.icon}</div>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
              <ul className={styles.serviceFeatures}>
                {service.features.map((feature, idx) => (
                  <li key={idx} className={styles.feature}>
                    <span className={styles.checkmark}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>Why Choose Tripster?</h2>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section - Free Forever */}
        <div className={styles.pricingSection}>
          <h2 className={styles.sectionTitle}>Free Forever</h2>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <h3 className={styles.pricingTitle}>All Features</h3>
              <div className={styles.pricingPrice}>
                <span className={styles.currency}>₹</span>
                <span className={styles.amount}>0</span>
                <span className={styles.period}>/month</span>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>✓ Unlimited itinerary planning</li>
                <li>✓ Advanced AI recommendations</li>
                <li>✓ Weather & air quality integration</li>
                <li>✓ Travel and accommodation suggestions</li>
              </ul>
              <Link to="/" className="btn btn-primary" style={{width: '100%'}}>
                Start Planning — It’s Free
              </Link>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Ready to Start Your Journey?</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of travelers who trust Tripster for their perfect vacation
          </p>
          <div style={{display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap'}}>
            <Link to="/" className="btn btn-primary" style={{fontSize: '1.1rem', padding: '0.8rem 2rem'}}>
              Plan Your Trip Now
            </Link>
            <Link to="/contact" className="btn btn-secondary" style={{fontSize: '1.1rem', padding: '0.8rem 2rem'}}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
