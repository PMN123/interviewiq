const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true,
    maxlength: [200, 'Role cannot exceed 200 characters']
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required'],
    enum: {
      values: ['easy', 'medium', 'hard'],
      message: 'Difficulty must be easy, medium, or hard'
    }
  },
  question: {
    type: String,
    default: ''
  },
  userAnswer: {
    type: String,
    default: ''
  },
  feedback: {
    type: String,
    default: ''
  },
  audioUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries by userId
interviewSessionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);

