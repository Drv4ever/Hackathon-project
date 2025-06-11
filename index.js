require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
const upload = multer({ dest: 'uploads/' });

const extractTextFromFile = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  if (path.extname(filePath) === '.pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  } else {
    return buffer.toString();
  }
};

const generateQuestions = async (resumeText) => {
  const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [
          {
            text: `Here is a resume:

${resumeText}

Please do the following:
1. Provide 3-5 mock interview questions based on the resume.
2. Provide 2-3 suggestions to improve the resume.

⚠️ Use the format below exactly:
### Interview Questions:
1. ...
2. ...
...

### Resume Feedback:
- ...
- ...`,
          },
        ],
      },
    ],
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const result = await response.json();
 const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
 console.log('📄 Raw Gemini response:\n', text);

if (!text) throw new Error('AI response could not be parsed — structure mismatch.');

// Match sections
const questionsMatch = text.match(/### Interview Questions:\s*([\s\S]*?)### Resume Feedback:/i);
const feedbackMatch = text.match(/### Resume Feedback:\s*([\s\S]*)/i);

const questionsBlock = questionsMatch?.[1] || '';
const feedbackBlock = feedbackMatch?.[1] || '';

  return {
    questions: questionsBlock
      .split('\n')
      .filter((line) => line.trim().startsWith('-') || line.trim().match(/^[0-9]+\./))
      .map((line) => line.replace(/^[-0-9.\s]+/, '').trim()),
    feedback: feedbackBlock || 'No feedback found.',
  };
};

app.post('/process-resume', upload.single('resume'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const resumeText = await extractTextFromFile(filePath);
    const result = await generateQuestions(resumeText);
    fs.unlinkSync(filePath);
    res.json(result);
  } catch (error) {
    console.error('❌ Error processing resume:', error);
    res.status(500).json({ message: 'Failed to process resume.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
