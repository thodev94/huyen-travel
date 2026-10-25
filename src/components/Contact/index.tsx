"use client";
import React, { useState } from 'react';
import './Contact.css';

const CONTACT_EMAIL = 'xuanhuyenbui@gmail.com';
const WHATSAPP_URL = 'https://wa.me/84364399290';

const Contact: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    note: '',
  });
  const [submitMessage, setSubmitMessage] = useState('');

  const updateField = (field: 'email' | 'note') => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm(previous => ({ ...previous, [field]: event.target.value }));
  };

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const body = [
      'New travel inquiry:',
      '',
      form.email,
      form.note,
    ].join('\n');

    const subject = 'New travel inquiry from WithHuyen website';
    const gmailUrl =
      'https://mail.google.com/mail/?view=cm&fs=1&to=' +
      encodeURIComponent(CONTACT_EMAIL) +
      '&su=' +
      encodeURIComponent(subject) +
      '&body=' +
      encodeURIComponent(body);
    const mailto =
      'mailto:' +
      CONTACT_EMAIL +
      '?subject=' +
      encodeURIComponent(subject) +
      '&body=' +
      encodeURIComponent(body);
    const opened = window.open(gmailUrl, '_blank', 'noopener,noreferrer');

    if (!opened) {
      window.location.href = mailto;
    }

    setSubmitMessage('Opening your email app...');
  };

  return (
    <footer id="contact" className="contact-footer">
      <div className="contact-glow contact-glow-one" aria-hidden="true" />
      <div className="contact-glow contact-glow-two" aria-hidden="true" />

      <div className="contact-inner">
        <div className="contact-main">
          <div className="contact-intro">
            <span className="contact-kicker">Plan your journey</span>
            <a href="#hero" className="contact-brand-link">
              <span className="contact-logo-winds">WithHuyen</span>
              <span className="contact-logo-dot">.</span>
            </a>

            <h2>Let’s create a Vietnam experience that feels personal.</h2>
            <p className="contact-brand-tagline">
              Share what you are curious about, when you are visiting and who you are traveling with.
              Huyen will reply with suitable ideas and current availability.
            </p>

            <div className="contact-direct-list">
              <a className="contact-direct-item" href={'mailto:' + CONTACT_EMAIL}>
                <span className="contact-direct-icon" aria-hidden="true">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </span>
                <span>
                  <small>Email</small>
                  <strong>{CONTACT_EMAIL}</strong>
                </span>
              </a>

              <a className="contact-direct-item" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <span className="contact-direct-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.47-1.761-1.643-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                    <path d="M12.05 21.785a9.87 9.87 0 0 1-5.034-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26C2.168 6.443 6.613 2.01 12.065 2.01c2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.896 9.884Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </span>
                <span>
                  <small>WhatsApp</small>
                  <strong>+84 364 399 290</strong>
                </span>
              </a>

              <div className="contact-direct-item">
                <span className="contact-direct-icon" aria-hidden="true">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </span>
                <span>
                  <small>Based in</small>
                  <strong>Ho Chi Minh City, Vietnam</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="newsletter-section">
            <div className="newsletter-heading">
              <div>
                <span>Start with a hello</span>
                <h3>Tell me about your trip.</h3>
              </div>
              <span className="newsletter-number">01</span>
            </div>

            <p className="newsletter-desc">
              A few details are enough to begin. Huyen will personally reply with ideas and availability.
            </p>

            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <label className="newsletter-field">
                <span>Your email</span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="newsletter-input"
                  value={form.email}
                  onChange={updateField('email')}
                  onFocus={() => setSubmitMessage('')}
                  required
                />
              </label>

              <label className="newsletter-field">
                <span>Your travel wishes</span>
                <textarea
                  placeholder="Travel date, group size and places you would love to discover..."
                  className="newsletter-input newsletter-textarea"
                  value={form.note}
                  rows={5}
                  onChange={updateField('note')}
                  onFocus={() => setSubmitMessage('')}
                  required
                />
              </label>

              <button type="submit" className="newsletter-btn">
                <span>Send inquiry</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              {submitMessage && <p className="newsletter-status">{submitMessage}</p>}
            </form>
          </div>
        </div>

        <div className="contact-navigation">
          <div>
            <span className="contact-nav-label">Explore</span>
            <div className="contact-nav-links">
              <a href="#hero">Home</a>
              <a href="#about">About Huyen</a>
              <a href="#services">Tours</a>
              <a href="#gallery">Gallery</a>
            </div>
          </div>

          <div>
            <span className="contact-nav-label">Helpful</span>
            <div className="contact-nav-links">
              <a href="#before-you-go">Before you go</a>
              <a href="https://www.withlocals.com/host/huyenbc46ed92ab/" target="_blank" rel="noopener noreferrer">Traveler reviews</a>
              <a href={'mailto:' + CONTACT_EMAIL}>Email Huyen</a>
            </div>
          </div>

          <p className="contact-navigation-note">
            Authentic local stories, meaningful conversations and memorable days across southern Vietnam.
          </p>
        </div>

        <div className="contact-bottom-bar">
          <p className="contact-copyright">
            &copy; {new Date().getFullYear()} WithHuyen. All rights reserved.
          </p>
          <p className="contact-location">Ho Chi Minh City · Vietnam</p>
        </div>
      </div>
    </footer>
  );
};

export default Contact;