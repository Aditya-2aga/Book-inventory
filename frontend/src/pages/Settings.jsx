import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Key, 
  Save, 
  AlertCircle, 
  CheckCircle, 
  Eye, 
  EyeOff,
  ExternalLink,
  Loader,
  Trash2,
  TestTube
} from 'lucide-react';
import { configAPI, aiAPI } from '../utils/api';

const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [aiStatus, setAiStatus] = useState(null);

  useEffect(() => {
    checkApiKeyConfiguration();
    checkAiStatus();
  }, []);

  const checkApiKeyConfiguration = async () => {
    try {
      const response = await configAPI.get('gemini_api_key');
      setApiKeyConfigured(response.data.hasValue || false);
    } catch (error) {
      console.error('Error checking API key configuration:', error);
      setApiKeyConfigured(false);
    }
  };

  const checkAiStatus = async () => {
    try {
      const response = await aiAPI.getStatus();
      setAiStatus(response.data.status);
    } catch (error) {
      console.error('Error checking AI status:', error);
      setAiStatus(null);
    }
  };

  const testApiKey = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    setTesting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await configAPI.testApiKey(apiKey);
      if (response.data.valid) {
        setSuccess(`API key is valid! ${response.data.testResponse || ''}`);
      } else {
        setError(response.data.message || 'Invalid API key');
      }
    } catch (error) {
      console.error('API key test error:', error);
      setError(error.response?.data?.message || 'Failed to test API key');
    } finally {
      setTesting(false);
    }
  };

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await configAPI.set('gemini_api_key', {
        value: apiKey.trim(),
        encrypted: true
      });
      
      if (response.data.success) {
        setApiKeyConfigured(true);
        setSuccess('API key saved successfully!');
        setApiKey('');
        await checkAiStatus(); // Refresh AI status
      } else {
        setError(response.data.message || 'Failed to save API key');
      }
    } catch (error) {
      console.error('Save API key error:', error);
      setError(error.response?.data?.message || 'Failed to save API key');
    } finally {
      setSaving(false);
    }
  };

  const deleteApiKey = async () => {
    if (!window.confirm('Are you sure you want to delete the API key? This will disable AI features.')) {
      return;
    }

    setDeleting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await configAPI.delete('gemini_api_key');
      
      if (response.data.success) {
        setApiKeyConfigured(false);
        setSuccess('API key deleted successfully');
        setApiKey('');
        await checkAiStatus(); // Refresh AI status
      } else {
        setError(response.data.message || 'Failed to delete API key');
      }
    } catch (error) {
      console.error('Delete API key error:', error);
      setError(error.response?.data?.message || 'Failed to delete API key');
    } finally {
      setDeleting(false);
    }
  };

  const testAiConnection = async () => {
    setTesting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await aiAPI.test();
      
      if (response.data.success) {
        setSuccess(`AI connection successful! Response: ${response.data.response}`);
      } else {
        setError(response.data.message || 'AI connection test failed');
      }
    } catch (error) {
      console.error('AI test error:', error);
      setError(error.response?.data?.message || 'AI connection test failed');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center lg:text-left">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900"
        >
          Settings
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 mt-2"
        >
          Configure your Book Inventory Builder
        </motion.p>
      </div>

      {/* AI Service Status */}
      {aiStatus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">AI Service Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Service</p>
              <p className="font-medium">{aiStatus.service}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Model</p>
              <p className="font-medium">{aiStatus.model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">API Key Status</p>
              <p className={`font-medium ${aiStatus.apiKeyConfigured ? 'text-green-600' : 'text-red-600'}`}>
                {aiStatus.apiKeyConfigured ? 'Configured' : 'Not Configured'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Features</p>
              <p className="font-medium">{aiStatus.features?.join(', ')}</p>
            </div>
          </div>
          
          {apiKeyConfigured && (
            <div className="mt-4">
              <button
                onClick={testAiConnection}
                disabled={testing}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {testing ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <TestTube className="h-4 w-4 mr-2" />
                    Test AI Connection
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* API Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-sm"
      >
        <div className="flex items-center mb-6">
          <Key className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">API Configuration</h2>
        </div>

        {/* Current Status */}
        <div className="mb-6 p-4 rounded-xl border">
          <div className="flex items-center">
            {apiKeyConfigured ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <h3 className="font-medium text-green-900">API Key Configured</h3>
                  <p className="text-sm text-green-700">
                    Google Gemini AI is ready for AI-powered book extraction
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-amber-600 mr-3" />
                <div>
                  <h3 className="font-medium text-amber-900">API Key Required</h3>
                  <p className="text-sm text-amber-700">
                    Configure your Google Gemini API key to enable AI features
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4"
          >
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <p className="text-sm text-green-700 mt-1">{success}</p>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4"
          >
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Google Gemini API Key */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder={apiKeyConfigured ? 'Enter new API key to update' : 'Enter your Google Gemini API key'}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={testApiKey}
              disabled={testing || !apiKey.trim()}
              className="flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {testing ? (
                <>
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="h-5 w-5 mr-2" />
                  Test API Key
                </>
              )}
            </button>
            
            <button
              onClick={saveApiKey}
              disabled={saving || !apiKey.trim()}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save API Key
                </>
              )}
            </button>

            {apiKeyConfigured && (
              <button
                onClick={deleteApiKey}
                disabled={deleting}
                className="flex items-center justify-center px-6 py-3 border border-red-600 text-red-600 rounded-xl font-medium hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {deleting ? (
                  <>
                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-5 w-5 mr-2" />
                    Delete API Key
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-blue-50 rounded-xl">
          <h3 className="font-semibold text-blue-900 mb-3">How to get your Google Gemini API Key:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>
              Visit the{' '}
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 underline"
              >
                Google AI Studio
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </li>
            <li>Sign in with your Google account</li>
            <li>Click "Create API Key" and select a project</li>
            <li>Copy the generated API key</li>
            <li>Paste it in the field above and click "Save API Key"</li>
          </ol>
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Note:</strong> Your API key is stored securely and encrypted. 
              Google Gemini offers a generous free tier for testing and development.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Application Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-8 shadow-sm"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">About</h2>
        
        <div className="space-y-4 text-gray-600">
          <div>
            <h3 className="font-semibold text-gray-900">Book Inventory Builder</h3>
            <p>Version 1.0.0</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">Features</h3>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>AI-powered book information extraction from photos</li>
              <li>Complete inventory management system</li>
              <li>Search and filtering capabilities</li>
              <li>Responsive design for all devices</li>
              <li>Secure API key storage</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">Technology Stack</h3>
            <p>React.js, Node.js, Express.js, MongoDB, Google Gemini AI</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;