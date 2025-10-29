import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the auth hook
import anime from 'animejs'; // Import anime.js
import styles from './Navbar.module.css'; // We will create this CSS file

function Navbar() {
  const { isLoggedIn, username, logout } = useAuth();
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    // Animate navbar on load
    anime({
      targets: navRef.current,
      translateY: ['-100%', '0%'], // Slide in from top
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeOutExpo'
    });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/'); // Go to home page after logout
  };

  return (
    <nav ref={navRef} className={styles.navbar}>
      <div className={`${styles.navContent} container`}>
        <Link to="/" className={styles.navLogo}>
          Tripster
        </Link>
        <div className={styles.navLinks}>
          <Link to="/">Home</Link>
          <Link to="/places">Places</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/saved">My Trips</Link>
        </div>
        <div className={styles.navAuth}>
          {isLoggedIn ? (
            <>
              <span className={styles.navUsername}>Welcome, {username}!</span>
              <button onClick={handleLogout} className="btn btn-primary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;