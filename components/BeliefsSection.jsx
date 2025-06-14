import React from 'react';
import './BeliefsSection.css';
import './common.css';
import growthImage from '../assets/growth.jpg';
import teammateImage from '../assets/teammate.jpeg';
import teamworkImage from '../assets/teamwork.jpeg';

const BeliefsSection = () => {
  return (
    <section className="section dark">
      <div className="container">
        <h2>Here's what we believe:</h2>
        <div className="belief-item">
          <div className="belief-arrow">→</div>
          <div className="belief-content">
            <div className="belief-title">The best growth is focused and frictionless</div>
            <div className="belief-description">
              <div className="belief-expanded-content">
                <img src={growthImage} alt="Growth" className="belief-image" />
                <div className="belief-text">
                  <p>We believe in quality over quantity. Our platform uses AI to identify high-value targets that align with your business goals, eliminating wasted effort on low-potential leads.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="belief-item">
          <div className="belief-arrow">→</div>
          <div className="belief-content">
            <div className="belief-title">AI should be your teammate, not a black box</div>
            <div className="belief-description">
              <div className="belief-expanded-content">
                <img src={teammateImage} alt="AI Teammate" className="belief-image" />
                <div className="belief-text">
                  <p>Our AI isn't designed to replace human intuition but to enhance it. We provide transparent insights that help your team make better decisions with confidence.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="belief-item">
          <div className="belief-arrow">→</div>
          <div className="belief-content">
            <div className="belief-title">Great teams win when they're free to focus on the right things</div>
            <div className="belief-description">
              <div className="belief-expanded-content">
                <img src={teamworkImage} alt="Teamwork" className="belief-image" />
                <div className="belief-text">
                  <p>By automating repetitive tasks and highlighting high-impact opportunities, we free your team to apply their creativity and expertise where it matters most.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeliefsSection;

