import express from 'express';
import {
  createInterview,
  getInterviews,
  getInterview,
  updateInterview,
  deleteInterview
} from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .post(createInterview)
  .get(getInterviews);

router.route('/:id')
  .get(getInterview)
  .put(updateInterview)
  .delete(deleteInterview);

export default router;
