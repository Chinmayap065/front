import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './AuthForm.module.css'; // Shared styles for login/signup
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';

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

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed. Please check credentials.');
      }
      
      login(data.accessToken, username); // Store token and username
      navigate('/'); // Redirect to homepage
      
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h2 className={styles.authTitle}>Login to Tripster</h2>
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div>
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text" name="username" id="username" required
              className="form-input"
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="form-label">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <button type="submit" disabled={isLoading} className="btn btn-primary" style={{width: '100%'}}>
              {isLoading ? <span className="spinner"></span> : 'Sign in'}
            </button>
          </div>
          {errorMessage && <MessageCard message={errorMessage} type="error" />}
        </form>
        <p className={styles.authLink}>
          Don't have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;