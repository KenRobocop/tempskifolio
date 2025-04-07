import React from "react";
import { Link } from "react-router-dom";
import '../styles.css';

const Homepage = () => {
  return (
    <div className="home-wrapper">
      
      {/* Top Navigation */}
      <header className="top-header">
        <h1 className="site-logo">Ski-Folio</h1>

        {/* <div className="action-btns">
          <Link to="/select">
            <button className="main-btn">Get Started</button>
          </Link>
        </div> */}
      </header>

      {/* Hero Section */}
      <main className="hero-section1">
        <h2 className="hero-title">Welcome to Ski-Folio</h2>
        <p className="hero-description">
          Your personalized platform for finding jobs and building your professional portfolio. 
          Whether you're an applicant looking for opportunities or an employer seeking top talent, 
          Ski-Folio connects you with the right match.
        </p>

        <div className="cta-container">
          <Link to="/select">
            <button className="main-btn">Get Started</button>
          </Link>
          <Link to="/about-us">
            <button className="alt-btn">Learn More</button>
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-content">
          <h3 className="features-title">Why Choose Ski-Folio?</h3>
          <ul className="features-list">
            <li> Showcase your skills with a dynamic portfolio.</li>
            <li> Find and apply for jobs that match your expertise.</li>
            <li> Employers can post jobs and connect with applicants.</li>
            <li> Enhance your career with a professional, user-friendly platform.</li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        © {new Date().getFullYear()} Ski-Folio. All rights reserved.
      </footer>
    </div>
  );
};

export default Homepage;
