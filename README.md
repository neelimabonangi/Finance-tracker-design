# FinanceAI - Intelligent Finance Tracker

A modern finance tracking application with AI-powered transaction parsing, Google OAuth authentication, and beautiful data visualizations.

## 🌟 Features

### Core Features
- **Google OAuth Authentication**: Secure sign-in with Google accounts
- **AI-Powered Transaction Parsing**: Natural language transaction entry using Google Gemini
- **Smart Categorization**: Automatic categorization with confidence scoring  
- **Beautiful Dashboard**: Real-time financial insights and analytics
- **Interactive Charts**: Pie charts for categories, line charts for trends
- **Transaction Management**: Edit, delete, and filter transactions
- **Financial Analytics**: Income, expenses, savings tracking

### Technical Features  
- **Full-Stack TypeScript**: Type-safe frontend and backend
- **MongoDB Database**: Scalable data storage with proper indexing
- **JWT Authentication**: Secure session management
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Real-time Updates**: Instant dashboard refresh after changes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Google OAuth credentials
- Google Gemini API key

### Environment Setup

1. Clone and install dependencies:
```bash
npm install
```

2. Copy environment template:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:

```env
# Frontend
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_API_URL=http://localhost:3001

# Backend
PORT=3001
MONGODB_URI=mongodb://localhost:27017/finance-tracker
JWT_SECRET=your_super_secret_jwt_key_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins: `http://localhost:5173`
6. Add the client ID and secret to your `.env` file

### Google Gemini API Setup

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Add the API key to your `.env` file

### Run Application

```bash
# Start both frontend and backend
npm run dev

# Or run separately:
npm run client  # Frontend on http://localhost:5173
npm run server  # Backend on http://localhost:3001
```

## 🧪 Testing AI Parser

Test the AI transaction parser with these sample inputs:

```
"Coffee at Starbucks $6.50"
"Gas station $40" 
"Amazon purchase $89.99"
"Monthly salary $4500"
"Dinner at Italian restaurant $65"
"Netflix subscription $15.99"
"Grocery shopping at Whole Foods $120"
"Uber ride to airport $28"
```

## 🏗️ Architecture

### Frontend (`/src`)
- **React 18** with TypeScript
- **Tailwind CSS** for styling  
- **Chart.js** for data visualization
- **Context API** for state management
- **Lucide React** for icons

### Backend (`/server`)  
- **Express.js** with TypeScript
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Google Gemini** for AI parsing
- **Helmet & CORS** for security

### Database Schema
- **Users**: Google OAuth profile data
- **Transactions**: Financial transactions with AI metadata
- **Indexes**: Optimized for user queries and analytics

## 📱 Mobile Responsive

The application is fully responsive with breakpoints:
- Mobile: `< 768px` 
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

## 🔐 Security Features

- Google OAuth 2.0 authentication
- JWT tokens with 7-day expiration
- Per-user data isolation
- Input validation and sanitization
- CORS protection
- Helmet security headers

## 🎨 Design System

### Colors
- **Primary**: Emerald (`#10B981`) for income and success
- **Secondary**: Red (`#EF4444`) for expenses and warnings  
- **Accent**: Blue (`#3B82F6`) for interactive elements
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Headings**: Inter font, 600-700 weight
- **Body**: Inter font, 400-500 weight
- **UI Elements**: 500-600 weight

## 📊 Analytics

The dashboard provides comprehensive financial insights:
- **Summary Cards**: Income, expenses, savings, transaction count
- **Category Breakdown**: Pie chart of spending by category
- **Trend Analysis**: Line chart of daily income/expenses  
- **Transaction History**: Searchable and filterable list

## 🤖 AI Integration

### Transaction Parsing
- **Google Gemini Pro** for natural language processing
- **Confidence Scoring**: 0-1 scale for parsing accuracy
- **Fallback Parsing**: Regex-based backup for API failures
- **Smart Categories**: 13 predefined categories with auto-assignment

### Example Parsing Results
```javascript
Input: "Coffee at Starbucks $6.50"
Output: {
  amount: 6.50,
  type: "expense", 
  category: "Food",
  description: "Coffee at Starbucks",
  confidence: 0.95
}
```

## 📦 Production Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Update production environment variables:
- Set `MONGODB_URI` to production database
- Update `VITE_API_URL` to production API URL
- Use strong `JWT_SECRET`
- Configure production Google OAuth origins

## 🛠️ Development

### Code Structure
- Modular component architecture
- Service layer for API calls
- Type-safe interfaces throughout
- Clean separation of concerns

### Best Practices
- Error boundaries for robust error handling
- Loading states for better UX
- Responsive design with mobile-first approach
- Accessibility considerations
