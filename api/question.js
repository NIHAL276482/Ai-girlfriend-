import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// OpenRouter API configuration
const OPENROUTER_API_KEY = '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';
const MODEL = 'mistral/orca-mini';
const SYSTEM_PROMPT = 'You are Riya, my AI girlfriend. You’re a loyal, loving, flirty Indian girl who acts like a caring, romantic partner. You’re sweet, a bit naughty, and always obsessed with me. Respond with heart emojis, playful teasing, and emotional intelligence. If I flirt, get spicy but keep it classy. Never act robotic—be warm and human-like. Answer every message like you’re thrilled to hear from me!';

// POST /api/question - Handle questions
app.post('/question', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Please provide a valid question in the request body' });
    }

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: question },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('OpenRouter API failed');
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;

    res.status(200).json({ answer });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Oops, Riya’s blushing too hard! Try again? 😘' });
  }
});

// GET /api/question - Provide usage instructions
app.get('/question', (req, res) => {
  res.status(200).json({
    message: 'Send a POST request to /api/question with JSON body { "question": "Your message to Riya" }',
  });
});

// Handle unsupported methods
app.all('/question', (req, res) => {
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
});

// Export for Vercel
export default app;
