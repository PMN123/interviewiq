import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { interviewAPI, aiAPI } from '../services/api';
import './InterviewDetailPage.css';

const InterviewDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');

  useEffect(() => {
    fetchInterview();
  }, [id]);

  const fetchInterview = async () => {
    try {
      setLoading(true);
      const response = await interviewAPI.getOne(id);
      const data = response.data.data;
      setInterview(data);
      setUserAnswer(data.userAnswer || '');
      setError('');
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Interview session not found');
      } else if (err.response?.status === 403) {
        setError('You do not have access to this interview session');
      } else {
        setError('Failed to load interview session');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await aiAPI.analyzeAnswer({
        question: interview.question,
        userAnswer: userAnswer,
        interviewId: id
      });

      // Update local state with new feedback
      setInterview(prev => ({
        ...prev,
        userAnswer,
        feedback: response.data.data.feedback
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegenerateQuestion = async () => {
    setIsRegenerating(true);
    setError('');

    try {
      const response = await aiAPI.generateQuestion({
        role: interview.role,
        difficulty: interview.difficulty,
        interviewId: id
      });

      setInterview(prev => ({
        ...prev,
        question: response.data.data.question,
        userAnswer: '',
        feedback: ''
      }));
      setUserAnswer('');
      setAudioUrl('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate new question');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleGenerateAudio = async (text) => {
    setIsGeneratingAudio(true);
    setError('');

    try {
      const response = await aiAPI.generateAudio({
        text,
        interviewId: id
      });

      setAudioUrl(response.data.data.audioUrl);
      
      // Auto-play the audio
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      }, 100);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate audio');
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this interview session?')) {
      return;
    }

    try {
      await interviewAPI.delete(id);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to delete interview session');
    }
  };

  const formatFeedback = (feedback) => {
    if (!feedback) return null;
    
    // Split by markdown-style headers
    const sections = feedback.split(/(?=\d\.\s\*\*|\*\*[^*]+\*\*:)/);
    
    return sections.map((section, index) => {
      const trimmed = section.trim();
      if (!trimmed) return null;
      
      return (
        <p key={index} className="feedback-paragraph">
          {trimmed}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="interview-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading interview session...</p>
        </div>
      </div>
    );
  }

  if (error && !interview) {
    return (
      <div className="interview-detail-page">
        <div className="error-container">
          <div className="error-icon-large">✕</div>
          <h2>{error}</h2>
          <Link to="/dashboard" className="back-btn">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="interview-detail-page">
      <div className="detail-container">
        <header className="detail-header fade-in">
          <Link to="/dashboard" className="back-link">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Dashboard
          </Link>
          
          <div className="header-content">
            <div className="header-info">
              <div className="header-badges">
                <span className={`difficulty-badge ${interview.difficulty}`}>
                  {interview.difficulty}
                </span>
                <span className="role-badge">{interview.role}</span>
              </div>
              <h1>Interview Session</h1>
            </div>
            
            <button onClick={handleDelete} className="delete-session-btn">
              Delete Session
            </button>
          </div>
        </header>

        {error && (
          <div className="error-banner fade-in">
            <span className="error-icon">!</span>
            {error}
          </div>
        )}

        <section className="question-section fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="section-header">
            <h2>
              <span className="section-icon">◇</span>
              Interview Question
            </h2>
            <div className="section-actions">
              <button 
                onClick={() => handleGenerateAudio(interview.question)}
                disabled={isGeneratingAudio || !interview.question}
                className="audio-btn"
              >
                {isGeneratingAudio ? (
                  <>
                    <span className="btn-spinner-small"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3V13M8 3L12 7M8 3L4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(90 8 8)"/>
                    </svg>
                    Listen
                  </>
                )}
              </button>
              <button 
                onClick={handleRegenerateQuestion}
                disabled={isRegenerating}
                className="regenerate-btn"
              >
                {isRegenerating ? (
                  <>
                    <span className="btn-spinner-small"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8C2 4.68629 4.68629 2 8 2C10.2208 2 12.1599 3.26557 13.1973 5.1M14 8C14 11.3137 11.3137 14 8 14C5.77915 14 3.84012 12.7344 2.80269 10.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    New Question
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="question-content">
            {interview.question ? (
              <p>{interview.question}</p>
            ) : (
              <p className="no-question">
                No question generated yet. Click "New Question" to generate one.
              </p>
            )}
          </div>

          {audioUrl && (
            <div className="audio-player">
              <audio ref={audioRef} controls src={audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </section>

        <section className="answer-section fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="section-header">
            <h2>
              <span className="section-icon">✎</span>
              Your Answer
            </h2>
          </div>
          
          <div className="answer-input-wrapper">
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here... Take your time to structure your response."
              disabled={isSubmitting || !interview.question}
              rows={6}
            />
            <div className="answer-footer">
              <span className="char-count">
                {userAnswer.length} characters
              </span>
              <button 
                onClick={handleSubmitAnswer}
                disabled={isSubmitting || !userAnswer.trim() || !interview.question}
                className="submit-answer-btn"
              >
                {isSubmitting ? (
                  <>
                    <span className="btn-spinner-small"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <span>✦</span>
                    Get AI Feedback
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {interview.feedback && (
          <section className="feedback-section fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="section-header">
              <h2>
                <span className="section-icon">★</span>
                AI Feedback
              </h2>
              <button 
                onClick={() => handleGenerateAudio(interview.feedback)}
                disabled={isGeneratingAudio}
                className="audio-btn"
              >
                {isGeneratingAudio ? (
                  <>
                    <span className="btn-spinner-small"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3V13M8 3L12 7M8 3L4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(90 8 8)"/>
                    </svg>
                    Listen
                  </>
                )}
              </button>
            </div>
            
            <div className="feedback-content">
              {formatFeedback(interview.feedback)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default InterviewDetailPage;

