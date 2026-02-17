# AI-Based College Placement Preparation Platform

A modern, AI-powered frontend application built with React.js for college placement preparation. This platform provides students with comprehensive tools for DSA practice, aptitude tests, mock interviews, and performance analytics.

## 🚀 Features

### Student Features
- **AI Smart Tests**: Adaptive testing with personalized difficulty levels
- **Mock Interviews**: Practice with AI interviewer for real-world experience  
- **Performance Analytics**: Track progress with detailed insights and charts
- **Study Plans**: AI-generated personalized learning roadmaps
- **Leaderboard**: Compare performance with peers
- **Dashboard**: Comprehensive overview of placement readiness

### Admin Features
- **Student Progress Tracking**: Monitor all students' performance
- **Question Management**: Add, edit, and delete test questions
- **Analytics Dashboard**: Overview of platform usage and student performance

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite)
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Chart.js + React-Chartjs-2
- **Data**: Mock JSON data (no backend required)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── StatCard.jsx
│   ├── Button.jsx
│   └── AIAvatar.jsx
├── pages/              # Main application pages
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── StudentDashboard.jsx
│   ├── AITestSetup.jsx
│   ├── TestPage.jsx
│   ├── MockInterviewSetup.jsx
│   ├── MockInterview.jsx
│   ├── Analytics.jsx
│   ├── StudyPlan.jsx
│   ├── Leaderboard.jsx
│   ├── AdminDashboard.jsx
│   ├── StudentProgress.jsx
│   └── QuestionManagement.jsx
├── data/               # Mock data files
│   ├── mockStudents.json
│   ├── mockQuestions.json
│   └── mockResults.json
├── routes/             # Routing configuration
│   └── AppRoutes.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## 🎨 Design Features

- **Dark Mode First**: Modern dark theme with glassmorphism effects
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion powered micro-interactions
- **AI-First UI**: Futuristic design with AI avatar integration
- **Professional Styling**: Clean, modern interface suitable for college/corporate use

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd college-placement-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 👥 User Roles & Login

### Student Login
- **Email**: Any email
- **Password**: Any password
- **Role**: Student
- **Access**: Student dashboard, tests, interviews, analytics

### Admin Login  
- **Email**: Any email
- **Password**: Any password
- **Role**: Placement Head
- **Access**: Admin dashboard, student management, question management

*Note: This is a frontend-only application with mock authentication*

## 📊 Key Pages Overview

### Landing Page
- Hero section with AI avatar
- Feature highlights
- Call-to-action buttons

### Student Dashboard
- Placement readiness score (circular progress)
- Subject-wise progress cards (DSA, Aptitude, Core)
- Recent test results
- Quick action buttons

### AI Test Setup
- Step-by-step test configuration
- Subject and topic selection
- Difficulty and question count options
- Test summary before starting

### Mock Interview
- Job role selection
- AI avatar with speaking animations
- Voice input simulation
- Real-time transcript
- Interview evaluation

### Analytics
- Subject-wise accuracy charts
- Interview score trends
- Strengths and weaknesses analysis
- Recent activity tracking

## 🎯 Mock Data

The application uses comprehensive mock data including:
- Student profiles and scores
- Test questions (DSA, Aptitude, Coding)
- Interview questions by role and type
- Performance analytics
- Study plan templates

## 🔧 Customization

### Adding New Questions
1. Navigate to Admin → Question Management
2. Select question type (DSA/Aptitude/Coding)
3. Click "Add Question"
4. Fill in question details and save

### Modifying Themes
- Update `tailwind.config.js` for color schemes
- Modify `index.css` for custom styles
- Adjust glassmorphism effects in component classes

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🚀 Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for smooth animations
- Chart.js for beautiful charts
- All open-source contributors

---

**Built with ❤️ for college placement preparation**