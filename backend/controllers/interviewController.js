import InterviewSession from '../models/InterviewSession.js';

// @desc    Create new interview session
// @route   POST /api/interviews
// @access  Private
const createInterview = async (req, res, next) => {
  try {
    const { role, difficulty, question, userAnswer, feedback, audioUrl } = req.body;

    // Validate required fields
    if (!role || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'Please provide role and difficulty'
      });
    }

    const interview = await InterviewSession.create({
      userId: req.user._id,
      role,
      difficulty,
      question: question || '',
      userAnswer: userAnswer || '',
      feedback: feedback || null,
      audioUrl: audioUrl || ''
    });

    res.status(201).json({
      success: true,
      message: 'Interview session created',
      data: interview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all interview sessions for current user
// @route   GET /api/interviews
// @access  Private
const getInterviews = async (req, res, next) => {
  try {
    const interviews = await InterviewSession.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single interview session
// @route   GET /api/interviews/:id
// @access  Private (owner only)
const getInterview = async (req, res, next) => {
  try {
    const interview = await InterviewSession.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found'
      });
    }

    // Check ownership
    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this interview session'
      });
    }

    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update interview session
// @route   PUT /api/interviews/:id
// @access  Private (owner only)
const updateInterview = async (req, res, next) => {
  try {
    let interview = await InterviewSession.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found'
      });
    }

    // Check ownership
    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this interview session'
      });
    }

    // Only allow updating specific fields
    const allowedUpdates = ['role', 'difficulty', 'question', 'userAnswer', 'feedback', 'audioUrl'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    interview = await InterviewSession.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Interview session updated',
      data: interview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete interview session
// @route   DELETE /api/interviews/:id
// @access  Private (owner only)
const deleteInterview = async (req, res, next) => {
  try {
    const interview = await InterviewSession.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found'
      });
    }

    // Check ownership
    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this interview session'
      });
    }

    await InterviewSession.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Interview session deleted',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

export {
  createInterview,
  getInterviews,
  getInterview,
  updateInterview,
  deleteInterview
};
