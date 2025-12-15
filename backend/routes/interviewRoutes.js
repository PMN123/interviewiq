const express = require('express');
const router = express.Router();
const {
  createInterview,
  getInterviews,
  getInterview,
  updateInterview,
  deleteInterview
} = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
  .post(createInterview)
  .get(getInterviews);

router.route('/:id')
  .get(getInterview)
  .put(updateInterview)
  .delete(deleteInterview);

module.exports = router;

