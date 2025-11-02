import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css'; // Shared styles
import axios from 'axios';
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

function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Use Axios for this one as an example
      const response = await axios.post(`${API_URL}/auth/signup`, {
        username: username,
        email: email,
        password: password
      });
      
      setSuccessMessage(response.data.message || 'Account created! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error("Signup error:", error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || 'Signup failed. Please try again.');
      } else {
        setErrorMessage('Signup failed. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h2 className={styles.authTitle}>Create your Tripster Account</h2>
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div>
            <label htmlFor="username-signup" className="form-label">Username</label>
            <input
              type="text" id="username-signup" required
              className="form-input"
              placeholder="choose_a_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
           <div>
            <label htmlFor="email-signup" className="form-label">Email address</label>
            <input
              type="email" id="email-signup" required
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password-signup" className="form-label">Password</label>
            <input
              type="password" id="password-signup" required
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" disabled={isLoading} className="btn btn-primary" style={{width: '100%'}}>
              {isLoading ? <span className="spinner"></span> : 'Create Account'}
            </button>
          </div>
          {errorMessage && <MessageCard message={errorMessage} type="error" />}
          {successMessage && <MessageCard message={successMessage} type="success" />}
        </form>
         <p className={styles.authLink}>
          Already have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;