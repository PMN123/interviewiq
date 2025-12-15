const OpenAI = require('openai');
const axios = require('axios');
const InterviewSession = require('../models/InterviewSession');

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

    const prompt = `You are an expert interview coach providing constructive feedback.

Interview Question: "${question}"

Candidate's Answer: "${userAnswer}"

Please analyze this answer and provide structured feedback including:

1. **Strengths**: What the candidate did well
2. **Areas for Improvement**: What could be better
3. **Suggested Approach**: How to improve the answer
4. **Overall Assessment**: Brief summary (1-2 sentences)

Be specific, constructive, and encouraging. Focus on both content and communication style.`;

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

    const feedback = completion.choices[0].message.content.trim();

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

    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    
    if (!ELEVENLABS_API_KEY) {
      return res.status(503).json({
        success: false,
        message: 'Audio service not configured'
      });
    }

    // Default voice ID (Rachel - professional female voice)
    const voiceId = 'EXAVITQu4vr4xnSDxMaL';

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

    // Convert audio buffer to base64
    const audioBase64 = Buffer.from(response.data).toString('base64');
    const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;

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

    res.status(200).json({
      success: true,
      data: {
        audioUrl,
        interviewId: interview ? interview._id : null
      }
    });
  } catch (error) {
    console.error('ElevenLabs Error:', error.response?.data || error.message);
    
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

module.exports = {
  generateQuestion,
  analyzeAnswer,
  generateAudio
};

