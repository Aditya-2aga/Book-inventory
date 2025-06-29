const express = require('express');
const router = express.Router();
const multer = require('multer');
const Config = require('../models/Config');
const { authenticate } = require('../middleware/auth');
router.use(authenticate);

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get Gemini API key from config or environment
const getGeminiApiKey = async () => {
  try {
    // First try to get from database config
    const apiKeyConfig = await Config.findOne({ key: 'gemini_api_key' });
    if (apiKeyConfig && apiKeyConfig.value) {
      return apiKeyConfig.value;
    }
    
    // Fallback to environment variable
    if (process.env.GEMINI_API_KEY) {
      return process.env.GEMINI_API_KEY;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting Gemini API key:', error);
    return process.env.GEMINI_API_KEY || null;
  }
};

// Extract book information from image
router.post('/extract-book-info', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No image file provided' 
      });
    }

    // Get API key
    const apiKey = await getGeminiApiKey();
    if (!apiKey) {
      return res.status(400).json({ 
        success: false,
        message: 'Gemini API key not configured. Please configure it in Settings.' 
      });
    }

    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Convert image to base64
    const imageBase64 = req.file.buffer.toString('base64');
    
    const prompt = `
      Analyze this book cover image and extract the following information in JSON format.
      Be as accurate as possible and only extract information that is clearly visible.
      
      Return ONLY a valid JSON object with this exact structure:
      {
        "title": "exact book title as shown on cover",
        "author": "author name as shown on cover",
        "gradeLevel": "grade level if visible (e.g., K-2, 3-5, 6-8, 9-12, Adult)",
        "subject": "subject area if determinable (e.g., Math, Science, English, History, Fiction, Non-Fiction)",
        "series": "book series name if this appears to be part of a series",
        "publisher": "publisher name if visible",
        "isbn": "ISBN number if visible",
        "description": "brief description of what the book appears to be about based on cover",
        "confidence": 0.85
      }
      
      Rules:
      - Use null for any field that cannot be determined from the image
      - Set confidence between 0.1 and 1.0 based on image clarity and text visibility
      - For gradeLevel, only use standard formats: K-2, 3-5, 6-8, 9-12, Adult
      - For subject, use common categories: Math, Science, English, History, Fiction, Non-Fiction, Art, Music, etc.
      - Return ONLY the JSON object, no additional text or explanation
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: req.file.mimetype
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    try {
      // Clean the response text to extract JSON
      let cleanedText = text.trim();
      
      // Remove markdown code blocks if present
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/```\n?/, '').replace(/\n?```$/, '');
      }
      
      const bookInfo = JSON.parse(cleanedText);
      
      // Validate and sanitize the response
      const sanitizedBookInfo = {
        title: bookInfo.title || null,
        author: bookInfo.author || null,
        gradeLevel: bookInfo.gradeLevel || null,
        subject: bookInfo.subject || null,
        series: bookInfo.series || null,
        publisher: bookInfo.publisher || null,
        isbn: bookInfo.isbn || null,
        description: bookInfo.description || null,
        confidence: Math.min(Math.max(bookInfo.confidence || 0.5, 0.1), 1.0),
        extractedByAI: true
      };
      
      res.json({
        success: true,
        data: sanitizedBookInfo
      });
      
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw AI response:', text);
      
      // Return a basic response if JSON parsing fails
      res.json({
        success: false,
        message: 'Could not parse AI response. Please try again or enter book details manually.',
        data: {
          title: null,
          author: null,
          gradeLevel: null,
          subject: null,
          series: null,
          publisher: null,
          isbn: null,
          description: null,
          confidence: 0.1,
          extractedByAI: true,
          error: 'AI response parsing failed'
        }
      });
    }
  } catch (error) {
    console.error('AI extraction error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to extract book information. Please check your API key and try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Test AI functionality
router.post('/test', async (req, res) => {
  try {
    const apiKey = await getGeminiApiKey();
    if (!apiKey) {
      return res.status(400).json({ 
        success: false,
        message: 'Gemini API key not configured' 
      });
    }

    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent('Hello! This is a test message to verify the API connection. Please respond with "API connection successful".');
    const response = await result.response;
    
    res.json({ 
      success: true, 
      message: 'AI connection successful',
      response: response.text(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI test error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'AI test failed. Please check your API key.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'API test failed'
    });
  }
});

// Get AI service status
router.get('/status', async (req, res) => {
  try {
    const apiKey = await getGeminiApiKey();
    const hasApiKey = !!apiKey;
    
    res.json({
      success: true,
      status: {
        apiKeyConfigured: hasApiKey,
        service: 'Google Gemini AI',
        model: 'gemini-2.0-flash',
        features: ['Image Analysis', 'Text Extraction', 'Book Information Extraction']
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get AI service status',
      error: error.message
    });
  }
});

module.exports = router;