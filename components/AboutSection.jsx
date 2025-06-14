import React, { useState } from 'react';
import './common.css';
import './AboutSection.css';

const AboutSection = () => {
  // Defining all content sections
  const sections = {
    default: {
      title: "About Us White Whaling",
      content: "Hunt big. Close bigger. Let AI do the chasing."
    },
    whoWeAre: {
      title: "Who We Are",
      content: "We're not just chasing growth—we're chasing greatness. At White Whaling, we believe that smart automation can unlock massive wins for B2B teams. Inspired by the relentless pursuit in Moby Dick, our name reflects our mission: to hunt down inefficiencies and convert them into opportunity.\n\nWe're a team of builders, dreamers, data scientists, and sales renegades who were tired of chasing leads manually. So we built something better: a powerful AI engine that does the chasing—while you focus on closing."
    },
    whyWeExist: {
      title: "Why We Exist",
      content: "B2B sales hasn't evolved fast enough. Outreach is noisy. Leads go cold. CRMs are bloated. We built White Whaling to flip the script. Our platform turns cold contacts into conversations, and conversations into conversions.\n\nNo more spray and pray. No more tab overload. No more one-size-fits-all cadences. Just hyper-personalized, AI-driven growth at scale."
    },
    whatWeBelieve: {
      title: "What We Believe",
      content: "• Humans close. AI chases. We believe reps should build relationships, not burn out on copy/paste.\n\n• Focus is a superpower. That's why we automate the 80% that wastes your time.\n\n• Design matters. Simplicity and clarity win.\n\n• Transparency builds trust. In our product, our pricing, and our partnerships."
    },
    meetTheCrew: {
      title: "Meet The Crew",
      content: "We're startup-tested, enterprise-proven, and globally distributed. Our founders have led GTM at unicorns, engineered AI at scale, and sold millions in SaaS. The sea might be rough—but we know how to steer the ship.\n\nLet's hunt big. Close bigger.\n\n👉 Ready to see what we're building? Book a demo or join the waitlist."
    }
  };

  // State to track which content to display
  const [activeSection, setActiveSection] = useState('default');

  // Function to handle panel hover
  const handlePanelHover = (sectionKey) => {
    setActiveSection(sectionKey);
  };
  
  // Function to handle mouse leave
  const handleMouseLeave = () => {
    setActiveSection('default');
  };

  return(
    <section className="section" id="about">
      <div className="about-container" onMouseLeave={handleMouseLeave} >
        <div className="about-sidebar left" >
          <div 
            className={`about-panel top-left ${activeSection === 'whoWeAre' ? 'active' : ''}`}
            onMouseEnter={() => handlePanelHover('whoWeAre')}
          >
            <h3>Who We Are</h3>
          </div>
          <div 
            className={`about-panel bottom-left ${activeSection === 'whyWeExist' ? 'active' : ''}`}
            onMouseEnter={() => handlePanelHover('whyWeExist')}
          >
            <h3>Why We Exist</h3>
          </div>
        </div>

        <div className="about-center" >
          <h2>{sections[activeSection].title}</h2>
          <div className="about-content">
            {sections[activeSection].content.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="about-sidebar right">
          <div 
            className={`about-panel top-right ${activeSection === 'whatWeBelieve' ? 'active' : ''}`}
            onMouseEnter={() => handlePanelHover('whatWeBelieve')}
          >
            <h3>What We Believe</h3>
          </div>
          <div 
            className={`about-panel bottom-right ${activeSection === 'meetTheCrew' ? 'active' : ''}`}
            onMouseEnter={() => handlePanelHover('meetTheCrew')}
          >
            <h3>Meet The Crew</h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;