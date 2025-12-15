const express = require('express');
const router = express.Router();
const {
  generateQuestion,
  analyzeAnswer,
  generateAudio
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.post('/generate-question', generateQuestion);
router.post('/analyze-answer', analyzeAnswer);
router.post('/generate-audio', generateAudio);

module.exports = router;

