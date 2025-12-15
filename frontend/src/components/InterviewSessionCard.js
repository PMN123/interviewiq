import React from 'react';
import { Link } from 'react-router-dom';
import './InterviewSessionCard.css';

const InterviewSessionCard = ({ interview, onDelete }) => {
  const { _id, role, difficulty, question, feedback, createdAt } = interview;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDifficultyClass = (diff) => {
    switch (diff) {
      case 'easy': return 'difficulty-easy';
      case 'medium': return 'difficulty-medium';
      case 'hard': return 'difficulty-hard';
      default: return '';
    }
  };

  const getStatusInfo = () => {
    if (feedback) {
      return { label: 'Completed', class: 'status-completed' };
    } else if (question) {
      return { label: 'In Progress', class: 'status-progress' };
    }
    return { label: 'Not Started', class: 'status-pending' };
  };

  const status = getStatusInfo();

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this interview session?')) {
      onDelete(_id);
    }
  };

  return (
    <Link to={`/interview/${_id}`} className="interview-card">
      <div className="card-header">
        <div className="card-meta">
          <span className={`difficulty-badge ${getDifficultyClass(difficulty)}`}>
            {difficulty}
          </span>
          <span className={`status-badge ${status.class}`}>
            {status.label}
          </span>
        </div>
        <span className="card-date">{formatDate(createdAt)}</span>
      </div>

      <h3 className="card-role">{role}</h3>

      {question && (
        <p className="card-question">
          {question.length > 120 ? `${question.substring(0, 120)}...` : question}
        </p>
      )}

      <div className="card-footer">
        <span className="view-details">
          View Details
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <button 
          className="delete-btn" 
          onClick={handleDelete}
          aria-label="Delete interview"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4H14M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M12 4V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4H12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </Link>
  );
};

export default InterviewSessionCard;

