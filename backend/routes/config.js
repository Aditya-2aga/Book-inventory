const express = require('express');
const router = express.Router();
const Config = require('../models/Config');
const { authenticate } = require('../middleware/auth');
router.use(authenticate);

// Get configuration value
router.get('/:key', async (req, res) => {
  try {
    const config = await Config.findOne({ key: req.params.key });
    if (!config) {
      return res.status(404).json({ 
        success: false,
        message: 'Configuration not found',
        hasValue: false
      });
    }
    
    // Don't return the actual value for security, just confirm it exists
    res.json({ 
      success: true,
      hasValue: !!config.value,
      key: req.params.key,
      encrypted: config.encrypted || false,
      updatedAt: config.updatedAt
    });
  } catch (error) {
    console.error('Config get error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get configuration',
      error: error.message 
    });
  }
});

// Set configuration value
router.post('/:key', async (req, res) => {
  try {
    const { value, encrypted = false } = req.body;
    
    if (!value) {
      return res.status(400).json({
        success: false,
        message: 'Configuration value is required'
      });
    }
    
    const config = await Config.findOneAndUpdate(
      { key: req.params.key },
      { value, encrypted },
      { upsert: true, new: true }
    );
    
    res.json({ 
      success: true,
      message: 'Configuration saved successfully',
      key: req.params.key,
      encrypted: config.encrypted
    });
  } catch (error) {
    console.error('Config set error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to save configuration',
      error: error.message 
    });
  }
});

// Test API key
router.post('/test-api-key', async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        valid: false,
        message: 'API key is required and must be a non-empty string' 
      });
    }

    // Test the API key with Google Gemini
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Simple test prompt with timeout
    const testPromise = model.generateContent('Test connection - please respond with "OK"');
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 10000)
    );
    
    const result = await Promise.race([testPromise, timeoutPromise]);
    const response = await result.response;
    
    if (response && response.text) {
      res.json({ 
        success: true,
        valid: true, 
        message: 'API key is valid and working',
        testResponse: response.text()
      });
    } else {
      res.json({ 
        success: false,
        valid: false, 
        message: 'API key test failed - no valid response received' 
      });
    }
  } catch (error) {
    console.error('API key test error:', error);
    
    let errorMessage = 'Invalid API key or service unavailable';
    if (error.message.includes('API_KEY_INVALID')) {
      errorMessage = 'Invalid API key provided';
    } else if (error.message.includes('PERMISSION_DENIED')) {
      errorMessage = 'API key does not have required permissions';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Request timeout - please check your connection';
    }
    
    res.json({ 
      success: false,
      valid: false, 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete configuration
router.delete('/:key', async (req, res) => {
  try {
    const result = await Config.findOneAndDelete({ key: req.params.key });
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Configuration not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Configuration deleted successfully',
      key: req.params.key
    });
  } catch (error) {
    console.error('Config delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete configuration',
      error: error.message
    });
  }
});

module.exports = router;