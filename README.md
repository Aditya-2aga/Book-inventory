# Book Inventory Builder

A modern, AI-powered book inventory management system designed for educators and librarians. Upload book cover photos and let AI extract book details automatically, or enter information manually.

## Features

### AI-Powered Extraction
- Upload book cover photos
- Automatic extraction of title, author, grade level, subject, and series
- Google Gemini Vision AI integration
- Manual review and editing of AI suggestions

### Complete Inventory Management
- Add, edit, and delete books
- Search and filter by multiple criteria
- Book status tracking (available, checked-out, maintenance, lost)
- Location and quantity management

### Modern Design
- Apple-level design aesthetics
- Responsive design for all devices
- Smooth animations and micro-interactions
- Intuitive user interface

### Secure and Reliable
- Encrypted API key storage
- MongoDB database with proper indexing
- Input validation and error handling
- Rate limiting and security headers

## Technology Stack

### Frontend
- React.js - Modern UI framework
- Tailwind CSS - Utility-first styling
- Framer Motion - Smooth animations
- Axios - HTTP client
- React Router - Client-side routing
- Lucide React - Beautiful icons

### Backend
- Node.js - Runtime environment
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM for MongoDB
- Google Gemini AI - Vision AI for book extraction
- Multer - File upload handling

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Google Gemini API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd book-inventory-builder
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm run install-deps

# Install frontend dependencies
cd ../frontend
npm run install-deps
```

### 3. Environment Configuration

#### Backend Environment
Create backend/.env file:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/book-inventory
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/book-inventory

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

#### Frontend Environment (Optional)
Create frontend/.env file:
```env
# API URL (only if different from default)
VITE_API_URL=http://localhost:5000/api
```

### 4. Database Setup
- Install MongoDB locally or create a MongoDB Atlas account
- The application will automatically create the database and collections
- No manual database setup required

### 5. Google Gemini API Key
1. Visit Google AI Studio (https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Configure it in the application settings (not in environment files)

### 6. Start the Application

#### Development Mode
```bash
# Start backend (from backend directory)
cd backend
npm run dev

# Start frontend (from frontend directory, in another terminal)
cd frontend
npm run dev
```

#### Production Mode
```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd ../backend
npm start
```

### 7. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

## Usage Guide

### Initial Setup
1. Open the application in your browser
2. Navigate to Settings
3. Enter your Google Gemini API key
4. Test and save the API key

### Adding Books
1. Click "Add Book" from the dashboard or navigation
2. Upload a book cover photo (optional but recommended)
3. Click "Extract with AI" to automatically extract book information
4. Review and edit the extracted information
5. Fill in any additional details
6. Save the book

### Managing Inventory
1. Navigate to "Library" to view all books
2. Use search and filters to find specific books
3. Click on any book to view detailed information
4. Edit or delete books as needed

### Dashboard Overview
- View total books, availability status
- See recent additions
- Monitor top subjects and grade levels
- Quick access to main functions

## Project Structure

```
book-inventory-builder/
├── backend/                 # Backend API
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── .env.example        # Backend environment template
│   ├── package.json        # Backend dependencies
│   └── server.js           # Main server file
├── frontend/               # Frontend React app
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   ├── index.html          # HTML template
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
└── README.md               # This file
```

## API Documentation

### Books API
- GET /api/books - Get all books with pagination and filters
- GET /api/books/:id - Get single book
- POST /api/books - Create new book
- PUT /api/books/:id - Update book
- DELETE /api/books/:id - Delete book
- GET /api/books/stats/overview - Get statistics

### AI API
- POST /api/ai/extract-book-info - Extract book info from image
- POST /api/ai/test - Test AI functionality

### Configuration API
- GET /api/config/:key - Get configuration value
- POST /api/config/:key - Set configuration value
- POST /api/config/test-api-key - Test API key validity

## Troubleshooting

### Common Issues

1. MongoDB Connection Error
   - Check if MongoDB is running locally
   - Verify connection string in backend/.env
   - Ensure network access for MongoDB Atlas

2. API Key Issues
   - Verify Google Gemini API key is valid
   - Check API quotas and limits
   - Ensure proper permissions

3. File Upload Issues
   - Check file size limits (10MB max)
   - Verify supported image formats
   - Ensure proper CORS configuration

4. Build Errors
   - Clear node_modules and reinstall dependencies
   - Check Node.js version compatibility
   - Verify all environment variables

### Performance Optimization
- Enable MongoDB indexing for better search performance
- Implement image compression for uploads
- Use CDN for static assets in production
- Enable gzip compression

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

Made by Aditya Modanwal