import React, { useRef, useEffect, useState } from 'react';
import anime from 'animejs';

function ContactPage() {
  const formRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    anime({
      targets: formRef.current,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 700,
      easing: 'easeOutExpo'
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="container" style={{padding: '2rem 1rem'}}>
      <h1 style={{textAlign:'center', marginBottom:'1rem'}}>Contact Us</h1>
      <p style={{textAlign:'center', color:'var(--color-text-secondary)', marginBottom:'2rem'}}>
        Have questions or feedback? We'd love to hear from you.
      </p>
      <form ref={formRef} onSubmit={handleSubmit} className="glass-panel" style={{maxWidth:'720px', margin:'0 auto', padding:'1.5rem', borderRadius:'0.75rem'}}>
        <div className="form-group" style={{marginBottom:'1rem'}}>
          <label className="form-label">Name</label>
          <input type="text" className="form-input" placeholder="Your name" required />
        </div>
        <div className="form-group" style={{marginBottom:'1rem'}}>
          <label className="form-label">Email</label>
          <input type="email" className="form-input" placeholder="you@example.com" required />
        </div>
        <div className="form-group" style={{marginBottom:'1rem'}}>
          <label className="form-label">Message</label>
          <textarea className="form-input" rows="5" placeholder="Tell us how we can help" required />
        </div>
        <div style={{display:'flex', justifyContent:'flex-end'}}>
          <button type="submit" className="btn btn-primary">Send</button>
        </div>
        {submitted && (
          <div className="message-card message-card-success" role="alert" style={{marginTop:'1rem'}}>
            <p>Thanks! We'll get back to you soon.</p>
          </div>
        )}
      </form>
    </div>
  );
}

export default ContactPage;


