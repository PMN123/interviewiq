import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content fade-in">
            <div className="hero-badge">
              <span className="badge-icon">✦</span>
              AI-Powered Interview Prep
            </div>
            <h1 className="hero-title">
              Master Your Interviews with{' '}
              <span className="gradient-text">Intelligent Practice</span>
            </h1>
            <p className="hero-description">
              Get personalized interview questions, real-time AI feedback, and spoken 
              responses to help you prepare for your dream job with confidence.
            </p>
            <div className="hero-actions">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary">
                    Start Practicing Free
                  </Link>
                  <Link to="/login" className="btn btn-secondary">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="hero-visual fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="visual-card">
              <div className="visual-header">
                <span className="visual-dot"></span>
                <span className="visual-dot"></span>
                <span className="visual-dot"></span>
              </div>
              <div className="visual-content">
                <div className="visual-question">
                  <span className="visual-label">Question</span>
                  <p>Explain how you would design a scalable microservices architecture...</p>
                </div>
                <div className="visual-feedback">
                  <span className="visual-label">AI Feedback</span>
                  <p>Strong technical foundation. Consider mentioning service discovery...</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-decoration">
          <div className="deco-circle deco-1"></div>
          <div className="deco-circle deco-2"></div>
          <div className="deco-line deco-3"></div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <div className="features-header fade-in">
            <h2>Everything you need to ace your interview</h2>
            <p>Powerful AI tools designed to give you the competitive edge</p>
          </div>

          <div className="features-grid">
            <div className="feature-card fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="feature-icon">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 3.5V24.5M14 3.5L21 10.5M14 3.5L7 10.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Role-Specific Questions</h3>
              <p>AI generates realistic interview questions tailored to your target role and experience level.</p>
            </div>

            <div className="feature-card fade-in" style={{ animationDelay: '0.15s' }}>
              <div className="feature-icon">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M9.33333 14L12.8333 17.5L18.6667 10.5M24.5 14C24.5 19.799 19.799 24.5 14 24.5C8.20101 24.5 3.5 19.799 3.5 14C3.5 8.20101 8.20101 3.5 14 3.5C19.799 3.5 24.5 8.20101 24.5 14Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Instant AI Feedback</h3>
              <p>Receive detailed analysis of your answers with strengths, improvements, and actionable suggestions.</p>
            </div>

            <div className="feature-card fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="feature-icon">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 8.16667V14L17.5 17.5M24.5 14C24.5 19.799 19.799 24.5 14 24.5C8.20101 24.5 3.5 19.799 3.5 14C3.5 8.20101 8.20101 3.5 14 3.5C19.799 3.5 24.5 8.20101 24.5 14Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Voice Responses</h3>
              <p>Listen to questions and feedback with natural-sounding AI voices for a realistic experience.</p>
            </div>

            <div className="feature-card fade-in" style={{ animationDelay: '0.25s' }}>
              <div className="feature-icon">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M10.5 5.83333H8.16667C6.69391 5.83333 5.5 7.02724 5.5 8.5V22.1667C5.5 23.6394 6.69391 24.8333 8.16667 24.8333H19.8333C21.3061 24.8333 22.5 23.6394 22.5 22.1667V8.5C22.5 7.02724 21.3061 5.83333 19.8333 5.83333H17.5M10.5 5.83333C10.5 7.30609 11.6939 8.5 13.1667 8.5H14.8333C16.3061 8.5 17.5 7.30609 17.5 5.83333M10.5 5.83333C10.5 4.36057 11.6939 3.16667 13.1667 3.16667H14.8333C16.3061 3.16667 17.5 4.36057 17.5 5.83333" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Progress Tracking</h3>
              <p>Keep track of all your practice sessions and monitor your improvement over time.</p>
            </div>

            <div className="feature-card fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="feature-icon">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M4.66667 14H23.3333M4.66667 7H23.3333M4.66667 21H14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Difficulty Levels</h3>
              <p>Choose from easy, medium, or hard questions to match your experience and push your limits.</p>
            </div>

            <div className="feature-card fade-in" style={{ animationDelay: '0.35s' }}>
              <div className="feature-icon">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M12.8333 4.66667L4.66667 14H14L12.8333 23.3333L21 14H12L12.8333 4.66667Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Powered by GPT</h3>
              <p>Leveraging OpenAI's advanced language models for intelligent, contextual responses.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container fade-in">
          <div className="cta-content">
            <h2>Ready to ace your next interview?</h2>
            <p>Join thousands of professionals who've improved their interview skills with InterviewIQ.</p>
            {isAuthenticated ? (
              <Link to="/interview/new" className="btn btn-primary btn-large">
                Start a Practice Session
              </Link>
            ) : (
              <Link to="/register" className="btn btn-primary btn-large">
                Get Started for Free
              </Link>
            )}
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="brand-icon">◆</span>
            <span>InterviewIQ</span>
          </div>
          <p className="footer-text">
            Built for CS390 Capstone Project • Powered by OpenAI & ElevenLabs
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

