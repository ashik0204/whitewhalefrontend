import React from 'react';
import './Hunt.css';

const slides = [
  {
    image: 'https://webflow-prod-assets.s3.amazonaws.com/image-generation-assets/6b66c0b8-505a-493b-b0ba-350a4020cf11.avif', // Replace with your actual path
    alt: 'AI Network Visual',
  },
  {
    image: 'https://webflow-prod-assets.s3.amazonaws.com/image-generation-assets/658ecd01-1a5c-4d5e-87d5-edae0b45a8a7.avif',
    alt: 'Team Collaboration',
  },
  {
    image: 'https://webflow-prod-assets.s3.amazonaws.com/image-generation-assets/6842d643-a3d5-4c5c-bc03-b28cc30ba4ef.avif',
    alt: 'Dashboard Analytics',
  },
];

const Hunt = () => {
  return (
    <section className="hunt-section">
      <div className="hunt-container">
        <div className="hunt-left">
          <h1>
            Hunt big. Close bigger.
            <br />
            Let AI do the chasing.
          </h1>
          <p>AI-powered automation from lead to onboarding.</p>
          <div className="hunt-buttons">
            <button className="trial-btn">Start Free Trial</button>
            <button className="demo-btn">Book Demo</button>
          </div>
        </div>
        <div className="hunt-right">
          {slides.map((slide, idx) => (
            <div key={idx} className="hunt-card">
              <img src={slide.image} alt={slide.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hunt;
