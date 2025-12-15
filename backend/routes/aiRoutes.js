import express from "express";
import {
  generateQuestion,
  analyzeAnswer,
  generateAudio
} from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.post("/generate-question", generateQuestion);
router.post("/analyze-answer", analyzeAnswer);
router.post("/generate-audio", generateAudio);

export default router;
