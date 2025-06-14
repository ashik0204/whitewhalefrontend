import React from 'react';
import './PricingSection.css';
import './common.css';

const PricingSection = () => {
  return (
    <section className="section" id="pricing">
      <div className="container">
        <h2>Pricing Plans</h2>
        <div className="Pricing-plans">
          <div className="Pricing-plan">
            <h3>Starter</h3>
            <div className="price">$99<span style={{ fontSize: '0.5em', fontWeight: 'normal' }}>/month</span></div>
            <p>Ideal for small teams beginning their journey.</p>
            <h4>Includes</h4>
            <ul className="Pricing-features-list">
              <li><span className="Pricing-features-item-plus">✓</span> AI-powered lead qualification</li>
              <li><span className="Pricing-features-item-plus">✓</span> Basic cold outreach</li>
              <li><span className="Pricing-features-item-plus">✓</span> Onboarding automation</li>
              <li><span className="Pricing-features-item-plus">✓</span> Omnichannel marketing</li>
              <li><span className="Pricing-features-item-plus">✓</span> Customer support</li>
            </ul>
            <div className="pricing-cta">
              <a href="#contact" className="cta">Get Started</a>
            </div>
          </div>
          <div className="Pricing-plan">
            <h3>Professional</h3>
            <div className="price">$299<span style={{ fontSize: '0.5em', fontWeight: 'normal' }}>/month</span></div>
            <p>Perfect for growing businesses.</p>
            <h4>Includes all Starter features +</h4>
            <ul className="Pricing-features-list">
              <li><span className="Pricing-features-item-plus">✓</span> Advanced lead scoring</li>
              <li><span className="Pricing-features-item-plus">✓</span> Enhanced outreach tools</li>
              <li><span className="Pricing-features-item-plus">✓</span> Custom workflows</li>
              <li><span className="Pricing-features-item-plus">✓</span> Priority support</li>
              <li><span className="Pricing-features-item-plus">✓</span> Analytics dashboard</li>
            </ul>
            <div className="pricing-cta">
              <a href="#contact" className="cta">Get Started</a>
            </div>
          </div>
          <div className="Pricing-plan">
            <h3>Enterprise</h3>
            <div className="price">$799<span style={{ fontSize: '0.5em', fontWeight: 'normal' }}>/month</span></div>
            <p>For large teams with advanced needs.</p>
            <h4>Includes all Professional features +</h4>
            <ul className="Pricing-features-list">
              <li><span className="Pricing-features-item-plus">✓</span> White labeling</li>
              <li><span className="Pricing-features-item-plus">✓</span> Team onboarding</li>
              <li><span className="Pricing-features-item-plus">✓</span> Dedicated account manager</li>
              <li><span className="Pricing-features-item-plus">✓</span> Custom integrations</li>
              <li><span className="Pricing-features-item-plus">✓</span> 24/7 support</li>
            </ul>
            <div className="pricing-cta">
              <a href="#contact" className="cta">Get Started</a>
            </div>
          </div>
          <div className="Pricing-plan">
            <h3>Enterprise Plus</h3>
            <div className="price">Contact Us</div>
            <p>Tailored solutions for unique requirements.</p>
            <h4>Includes all Enterprise features +</h4>
            <ul className="Pricing-features-list">
              <li><span className="Pricing-features-item-plus">✓</span> Bespoke solutions</li>
              <li><span className="Pricing-features-item-plus">✓</span> Full API access</li>
              <li><span className="Pricing-features-item-plus">✓</span> Custom SLA</li>
              <li><span className="Pricing-features-item-plus">✓</span> Dedicated support team</li>
              <li><span className="Pricing-features-item-plus">✓</span> Strategic consulting</li>
            </ul>
            <div className="pricing-cta">
              <a href="#contact" className="cta">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;