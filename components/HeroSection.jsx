import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="container">
        <h1>Not every lead is worth chasing.<br />But some? They're your white whale.</h1>
        <p className="tagline">
          "Growth isn't about chasing more. It's about chasing right."
        </p>
        <a href="#contact" className="cta">Get Started</a>
      </div>
    </section>
  );
};

export default HeroSection;