import { openaiTts } from "../services/openaiTtsService.js";
import OpenAI from "openai";
import axios from "axios";
import InterviewSession from "../models/InterviewSession.js";

// Initialize OpenAI client
const getOpenAIClient = () => {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
};

// @desc    Generate interview question using OpenAI
// @route   POST /api/ai/generate-question
// @access  Private
const generateQuestion = async (req, res, next) => {
  try {
    const { role, difficulty, interviewId } = req.body;

    // Validate input
    if (!role || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'Please provide role and difficulty'
      });
    }

    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: 'Difficulty must be easy, medium, or hard'
      });
    }

    const openai = getOpenAIClient();

    const difficultyDescriptions = {
      easy: 'basic and straightforward, suitable for entry-level candidates',
      medium: 'moderately challenging, suitable for mid-level professionals',
      hard: 'complex and in-depth, suitable for senior-level candidates'
    };

    const prompt = `You are an expert technical interviewer. Generate a single, realistic interview question for a ${role} position. 
The difficulty level should be ${difficulty} (${difficultyDescriptions[difficulty]}).

Requirements:
- The question should be specific and practical
- It should test relevant skills for the role
- Include any necessary context or scenario
- Do not include the answer

Return ONLY the interview question, nothing else.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical interviewer who creates realistic, role-specific interview questions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.8
    });

    const question = completion.choices[0].message.content.trim();

    // If interviewId provided, update the session
    let interview = null;
    if (interviewId) {
      interview = await InterviewSession.findById(interviewId);
      
      if (interview && interview.userId.toString() === req.user._id.toString()) {
        interview.question = question;
        await interview.save();
      }
    }

    res.status(200).json({
      success: true,
      data: {
        question,
        role,
        difficulty,
        interviewId: interview ? interview._id : null
      }
    });
  } catch (error) {
    console.error('OpenAI Error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({
        success: false,
        message: 'AI service temporarily unavailable. Please try again later.'
      });
    }
    
    next(error);
  }
};

// @desc    Analyze user's answer and provide feedback
// @route   POST /api/ai/analyze-answer
// @access  Private
const analyzeAnswer = async (req, res, next) => {
  try {
    const { question, userAnswer, interviewId } = req.body;

    // Validate input
    if (!question || !userAnswer) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both question and userAnswer'
      });
    }

    if (userAnswer.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a more detailed answer (at least 10 characters)'
      });
    }

    const openai = getOpenAIClient();

    const prompt = `return only valid json. no markdown. no extra text.

    schema:
    {
      "spoken": string,
      "strengths": string,
      "improvements": string,
      "suggestion": string,
      "overall": string
    }
    
    interview question: ${JSON.stringify(question)}
    candidate answer: ${JSON.stringify(userAnswer)}
    
    requirements:
    - spoken should be a 15-25 second natural summary suitable for text-to-speech
    - keep each field concise but specific
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert interview coach who provides detailed, constructive feedback on interview answers. Be encouraging but honest.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7
    });

    const raw = completion.choices[0].message.content.trim();

    let feedback;
    try {
      feedback = JSON.parse(raw);
    } catch (e) {
      // fallback so you never crash even if the model returns plain text
      feedback = {
        spoken: raw,
        strengths: "",
        improvements: "",
        suggestion: "",
        overall: raw
      };
    }

    // If interviewId provided, update the session
    let interview = null;
    if (interviewId) {
      interview = await InterviewSession.findById(interviewId);
      
      if (interview && interview.userId.toString() === req.user._id.toString()) {
        interview.userAnswer = userAnswer;
        interview.feedback = feedback;
        await interview.save();
      }
    }

    res.status(200).json({
      success: true,
      data: {
        feedback,
        question,
        interviewId: interview ? interview._id : null
      }
    });
  } catch (error) {
    console.error('OpenAI Error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({
        success: false,
        message: 'AI service temporarily unavailable. Please try again later.'
      });
    }
    
    next(error);
  }
};

// @desc    Generate audio from text using ElevenLabs
// @route   POST /api/ai/generate-audio
// @access  Private
const generateAudio = async (req, res, next) => {
  console.log("generateAudio hit", req.body);
  const TTS_PROVIDER = process.env.TTS_PROVIDER || "elevenlabs";
  console.log("TTS PROVIDER:", TTS_PROVIDER);
  try {
    const { text, interviewId } = req.body;

    // Validate input
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Please provide text to convert to audio'
      });
    }

    if (text.length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Text is too long. Maximum 5000 characters allowed.'
      });
    }

    // Default voice ID (Rachel - professional female voice)
    const voiceId = 'EXAVITQu4vr4xnSDxMaL';

    let audioBuffer;

    if (TTS_PROVIDER === "openai") {
      audioBuffer = await openaiTts(text);
    } else {
      const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
      if (!ELEVENLABS_API_KEY) {
        return res.status(503).json({
          success: false,
          message: 'ElevenLabs audio service not configured'
        });
      }
      // ⬇️ YOUR EXISTING ELEVENLABS CODE ⬇️
      const response = await axios({
        method: 'POST',
        url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        data: {
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        },
        responseType: 'arraybuffer'
      });


      audioBuffer = response.data;
    }


    // If interviewId provided, update the session
    let interview = null;
    if (interviewId) {
      interview = await InterviewSession.findById(interviewId);
      
      if (interview && interview.userId.toString() === req.user._id.toString()) {
        // Store a reference (in production, you'd upload to cloud storage)
        interview.audioUrl = `audio_generated_${Date.now()}`;
        await interview.save();
      }
    }
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length
    });
    
    res.status(200).send(audioBuffer);
  } catch (error) {
    console.error('TTS Error:', {
      provider: TTS_PROVIDER,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      return res.status(503).json({
        success: false,
        message: 'Audio service authentication failed'
      });
    }
    
    if (error.response?.status === 429) {
      return res.status(503).json({
        success: false,
        message: 'Audio service rate limit exceeded. Please try again later.'
      });
    }
    
    next(error);
  }
};

export {
  generateQuestion,
  analyzeAnswer,
  generateAudio
};

