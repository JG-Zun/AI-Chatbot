console.log('-> Script is starting...');

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/chat', async (req, res) => {
  const { message } = req.body ?? {};

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const stream = await ai.models.generateContentStream({
      model: 'gemini-3.8-flash',
      contents: message.trim(),
      config: {
        systemInstruction:
          'Answer directly and precisely. Use the fewest words needed. Avoid filler and repetition.',
        maxOutputTokens: 256,
        temperature: 0.3,
      },
    });

    res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    for await (const chunk of stream) {
      if (chunk.text) {
        res.write(`${JSON.stringify({ text: chunk.text })}\n`);
      }
    }

    res.end();
  } catch (error) {
    console.error('Error handling request:', error);

    if (res.headersSent) {
      res.write(`${JSON.stringify({ error: 'AI generation failed.' })}\n`);
      return res.end();
    }

    res.status(500).json({ error: 'Failed to communicate with AI model.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
});