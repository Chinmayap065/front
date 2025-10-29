import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // We will create this
import './index.css'; // This imports your global CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* Wraps the whole app to manage login state */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)