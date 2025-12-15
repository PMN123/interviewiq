import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI, aiAPI } from '../services/api';
import './CreateInterviewForm.css';

const CreateInterviewForm = () => {
  const [formData, setFormData] = useState({
    role: '',
    difficulty: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [generatingQuestion, setGeneratingQuestion] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const roles = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'Product Manager',
    'UX Designer',
    'DevOps Engineer',
    'Machine Learning Engineer',
    'Mobile Developer',
    'QA Engineer',
    'Technical Lead'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      setError('Please select or enter a role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // First, create the interview session
      const createResponse = await interviewAPI.create({
        role: formData.role,
        difficulty: formData.difficulty
      });

      const interviewId = createResponse.data.data._id;

      // Then, generate a question
      setGeneratingQuestion(true);
      
      try {
        await aiAPI.generateQuestion({
          role: formData.role,
          difficulty: formData.difficulty,
          interviewId
        });
      } catch (aiError) {
        console.error('AI question generation failed:', aiError);
        // Continue even if AI fails - user can still use the session
      }

      navigate(`/interview/${interviewId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create interview session');
      setLoading(false);
      setGeneratingQuestion(false);
    }
  };

  return (
    <div className="create-interview-page">
      <div className="create-form-container fade-in">
        <div className="form-header">
          <h1>New Interview Session</h1>
          <p>Configure your practice interview and let AI generate tailored questions</p>
        </div>

        <form onSubmit={handleSubmit} className="create-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">!</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="role">Target Role</label>
            <div className="role-input-wrapper">
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Enter or select a role"
                list="role-suggestions"
                disabled={loading}
              />
              <datalist id="role-suggestions">
                {roles.map(role => (
                  <option key={role} value={role} />
                ))}
              </datalist>
            </div>
            <span className="input-hint">
              Choose from suggestions or type your own
            </span>
          </div>

          <div className="form-group">
            <label>Difficulty Level</label>
            <div className="difficulty-options">
              {['easy', 'medium', 'hard'].map(level => (
                <label 
                  key={level}
                  className={`difficulty-option ${formData.difficulty === level ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="difficulty"
                    value={level}
                    checked={formData.difficulty === level}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span className="option-content">
                    <span className={`option-indicator ${level}`}></span>
                    <span className="option-label">{level}</span>
                    <span className="option-description">
                      {level === 'easy' && 'Entry-level questions'}
                      {level === 'medium' && 'Mid-level challenges'}
                      {level === 'hard' && 'Senior-level depth'}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                {generatingQuestion ? 'Generating Question...' : 'Creating Session...'}
              </>
            ) : (
              <>
                <span className="btn-icon">✦</span>
                Start Interview
              </>
            )}
          </button>
        </form>

        <div className="form-footer">
          <p>
            <strong>Tip:</strong> Choose a difficulty that matches your experience level for the most relevant practice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateInterviewForm;

