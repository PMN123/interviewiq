import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { interviewAPI } from '../services/api';
import InterviewSessionCard from '../components/InterviewSessionCard';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const response = await interviewAPI.getAll();
      setInterviews(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load interview sessions');
      console.error('Error fetching interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await interviewAPI.delete(id);
      setInterviews(prev => prev.filter(interview => interview._id !== id));
    } catch (err) {
      setError('Failed to delete interview session');
      console.error('Error deleting interview:', err);
    }
  };

  const getStats = () => {
    const total = interviews.length;
    const completed = interviews.filter(i => i.feedback).length;
    const inProgress = interviews.filter(i => i.question && !i.feedback).length;
    return { total, completed, inProgress };
  };

  const stats = getStats();

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header fade-in">
          <div className="welcome-section">
            <h1>
              Welcome back, <span className="highlight">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p>Track your progress and continue practicing</p>
          </div>
          <Link to="/interview/new" className="new-interview-btn">
            <span className="btn-icon">+</span>
            New Interview
          </Link>
        </header>

        <div className="stats-grid fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="stat-card">
            <div className="stat-icon total">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Sessions</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon progress">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.inProgress}</span>
              <span className="stat-label">In Progress</span>
            </div>
          </div>
        </div>

        <section className="interviews-section fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="section-header">
            <h2>Your Interview Sessions</h2>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading your sessions...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={fetchInterviews} className="retry-btn">
                Try Again
              </button>
            </div>
          ) : interviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">◇</div>
              <h3>No interview sessions yet</h3>
              <p>Start your first practice session and get AI-powered feedback</p>
              <Link to="/interview/new" className="start-btn">
                Start Practicing
              </Link>
            </div>
          ) : (
            <div className="interviews-grid">
              {interviews.map((interview, index) => (
                <div 
                  key={interview._id} 
                  className="card-wrapper"
                  style={{ animationDelay: `${0.05 * index}s` }}
                >
                  <InterviewSessionCard 
                    interview={interview} 
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

