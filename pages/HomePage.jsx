import React from 'react';
import Header from '../components/Header';
import Hunt from '../components/Hunt';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import FeaturesSection from '../components/FeaturesSection';
import PricingSection from '../components/PricingSection';
import BlogSection from '../components/BlogSection';
import ContactSection from '../components/ContactSection';
import BeliefsSection from '../components/BeliefsSection';

const HomePage = () => {
  return (
    <>
      <Header />
      <Hunt/>
      <HeroSection />
      <FeaturesSection />
      <BeliefsSection />
      <PricingSection />
      <BlogSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </>
  );
};

export default HomePage;
