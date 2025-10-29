import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './AuthForm.module.css'; // Shared styles for login/signup
import { useNavigate } from 'react-router-dom';

const API_URL = "http://127.0.0.1:5000/api";

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
            <label htmlFor="password"className="form-label">Password</label>
            <input
              type="password" name="password" id="password" required
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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