"use client";
import React from 'react';
import { useWindowSize } from '../../hooks/useWindowSize';
import './Contact.css';

const Contact: React.FC = () => {
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  return (
    <footer id="contact" className="contact-footer">
      <div className="contact-inner">

        {/* Main Footer Content */}
        <div className="contact-grid">

          {/* Column 1: Brand & Tagline */}
          <div className="contact-brand">
            <a href="#hero" className="contact-brand-link">
              <span className="contact-logo-winds">WIND</span>
              <span className="contact-logo-tour">TOURS.</span>
            </a>
            <p className="contact-brand-tagline">
              Your local compass in Vietnam. Specializing in authentic storytelling, cultural immersions, and uncovering hidden gems you won't find in guidebooks.
            </p>
          </div>

          {/* Column 2: Contact Info */}
          <div>
            <h4 className="contact-heading">Contact Info</h4>
            <p className="contact-text">
              <strong>Email:</strong><br />
              <a href="mailto:guide@huyentour.com" className="contact-link">guide@huyentour.com</a>
            </p>
            <p className="contact-text">
              <strong>WhatsApp:</strong><br />
              +84 364399290
            </p>
            <p className="contact-text">
              <strong>Location:</strong><br />
              Ho Chi Minh City, Vietnam
            </p>
          </div>

          {/* Column 3: Quick Links */}
          {!isMobile && <div>
            <h4 className="contact-heading">Quick Links</h4>
            <a href="#hero" className="footer-link">Home</a>
            <a href="#about" className="footer-link">About Me</a>
            <a href="#services" className="footer-link">Tours</a>
            <a href="#gallery" className="footer-link">Journal</a>
          </div>}

          {/* Column 4: Support Links */}
          <div>
            <h4 className="contact-heading">Support</h4>
            <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>FAQ</a>
            <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>Booking Policy</a>
            <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
          </div>

          {/* Column 5: Newsletter */}
          <div className="newsletter-section">
            <h4 className="contact-heading">Join the Journey</h4>
            <p className="newsletter-desc">
              Subscribe to get exclusive travel tips and updates on new hidden destinations.
            </p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <button className="btn-accent newsletter-btn">
                Subscribe
              </button>
            </div>

            {/* Social Icons */}
            <div className="social-container">
              <a href="#" className="social-icon" onClick={(e) => e.preventDefault()}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
              </a>
              <a href="#" className="social-icon" onClick={(e) => e.preventDefault()}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a href="#" className="social-icon" onClick={(e) => e.preventDefault()}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21.583 6.997c-.777.345-1.614.58-2.493.684.896-.537 1.583-1.385 1.908-2.395a8.21 8.21 0 01-2.607.997A4.086 4.086 0 0015.34 5a4.095 4.095 0 00-4.09 4.091c0 .321.036.634.106.935C7.95 9.855 4.918 8.23 2.89 5.76c-.352.603-.553 1.306-.553 2.056 0 1.418.721 2.668 1.819 3.402a4.07 4.07 0 01-1.85-.511v.051c0 1.981 1.409 3.633 3.28 4.01a4.082 4.082 0 01-1.848.07c.52 1.624 2.03 2.806 3.818 2.839A8.221 8.221 0 010 19.539a11.56 11.56 0 006.29 1.843c7.547 0 11.675-6.252 11.675-11.675 0-.178-.004-.355-.012-.53A8.348 8.348 0 0022 6.136a8.234 8.234 0 01-2.353.645c.848-.508 1.498-1.31 1.805-2.268z" /></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="contact-bottom-bar">
          <p className="contact-copyright">
            &copy; {new Date().getFullYear()} Huyen Tour. All rights reserved.
          </p>
          <div className="contact-bottom-links">
            <a href="#" className="contact-bottom-link" onClick={(e) => e.preventDefault()}>Terms of Service</a>
            <a href="#" className="contact-bottom-link" onClick={(e) => e.preventDefault()}>Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
