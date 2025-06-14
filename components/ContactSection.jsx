import React from 'react';
import './ContactSection.css';
import './common.css';

const ContactSection = () => {
  return (
    <section className="section" id="contact">
      <div className="container" style={{ textAlign: 'center' }}>
        <h2>Want to be part of it?</h2>
        <p>Reach out at <a className="mailto" href="mailto:hello@whitewhaling.com">hello@whitewhaling.com</a></p>
        <p>Follow us for behind-the-scenes stories, hiring updates, and our upcoming launch.</p>
        <div className="social-links">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="cta">LinkedIn</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="cta">Twitter</a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;