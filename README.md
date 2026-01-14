# 💰 Money & Career

**AI-powered assistant for young adults to manage finances, build careers, and stay organized**

## 🎯 One-Line Pitch

Money & Career is an AI-powered assistant that helps young adults manage their finances, build their careers, and stay organised—so they can make smarter decisions with less stress.

## 🌟 Why It Matters

Many young adults feel overwhelmed by money decisions, career planning, and daily responsibilities, often leading to stress and missed opportunities. By giving them clear guidance and personalised support, Money & Career helps them gain confidence, stay organised, and progress towards a more stable future.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git (optional)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the server:**
   ```bash
   npm start
   # or
   node app.js
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

### Alternative: Use Live Server (VS Code)
- Open `index.html` in VS Code
- Right-click and select "Open with Live Server"
- The site will open at `http://127.0.0.1:5500`

---

## 🎨 Color Palette

Our color scheme is designed for young adults—professional yet approachable, energetic yet trustworthy:

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Confident Blue** | `#2563EB` | Primary actions, trust elements |
| **Growth Green** | `#10B981` | Success states, progress indicators |
| **Energy Amber** | `#F59E0B` | Accent, call-to-actions |
| **Professional Dark** | `#1E293B` | Text, headers |
| **Clean Background** | `#F8FAFC` | Page background |
| **Readable Gray** | `#334155` | Body text |

---

## 🤖 AI Agent Modules

The application features six specialized modules, each with:
- ✅ Input processing and parsing
- 📊 Intelligent summarization
- 💡 Personalized recommendations
- 📋 Step-by-step action plans
- ✓ Interactive checklists

### 1. 💵 Finance Tracking
Track expenses, set budgets, and understand spending patterns with smart categorization.

**Features:**
- Expense categorization
- Budget analysis
- Savings recommendations
- Debt management guidance

### 2. 📈 Investing Coach
Learn investment basics, get personalized recommendations, and build a solid strategy.

**Features:**
- Risk tolerance assessment
- Investment education
- Portfolio recommendations
- Long-term planning

### 3. 🎯 Career Mapping
Define career goals, identify skill gaps, and create a roadmap to success.

**Features:**
- Goal setting framework
- Skills gap analysis
- Career pathway planning
- Professional development tracking

### 4. 💼 Interview Preparation
Practice questions, get feedback, and prepare winning answers.

**Features:**
- STAR method training
- Common questions database
- Mock interview scenarios
- Follow-up email templates

### 5. 📋 Task Prioritization
Organize to-dos, prioritize effectively, and stay on top of deadlines.

**Features:**
- Eisenhower Matrix categorization
- MIT (Most Important Tasks) identification
- Time blocking recommendations
- Weekly review planning

### 6. 📅 Meeting Follow-ups
Generate summaries, action items, and professional follow-up emails automatically.

**Features:**
- Meeting notes organization
- Action item extraction
- Email template generation
- Progress tracking

---

## 💻 JavaScript Features & Performance

### Modern JavaScript (ES6+)
- ✅ Classes and modules for code organization
- ✅ Arrow functions for cleaner syntax
- ✅ Async/await for better asynchronous handling
- ✅ Template literals for dynamic HTML generation
- ✅ Destructuring and spread operators

### Performance Optimizations
- ⚡ Event delegation for better memory usage
- ⚡ Debouncing for input handling
- ⚡ Lazy loading for images
- ⚡ LocalStorage for data persistence
- ⚡ Intersection Observer for viewport detection
- ⚡ CSS animations with GPU acceleration

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive enhancement approach

---

## 🎨 UX Design Principles

### Usability
1. **Clear Navigation**: Sticky header with accessible menu
2. **Progressive Disclosure**: Information revealed as needed
3. **Consistent Patterns**: Uniform button styles and interactions
4. **Feedback**: Loading indicators and success messages
5. **Error Prevention**: Input validation and helpful hints

### Accessibility (WCAG 2.1 Level AA)
- ♿ Semantic HTML5 elements
- ♿ ARIA labels and roles
- ♿ Keyboard navigation support
- ♿ Focus indicators
- ♿ Screen reader compatibility
- ♿ Color contrast ratios meet standards
- ♿ Skip to main content link
- ♿ Descriptive alt text

### Mobile-First Design
- 📱 Responsive grid layouts
- 📱 Touch-friendly button sizes (min 44x44px)
- 📱 Readable font sizes (min 16px)
- 📱 Optimized images
- 📱 Hamburger menu for mobile

### Visual Hierarchy
- Clear typographic scale
- Strategic use of white space
- Color coding for different elements
- Card-based layout for scanability

---

## 📁 Project Structure

```
FA_Rajeev/
├── index.html          # Main HTML file (HTML5 boilerplate)
├── app.js              # Node.js Express server
├── package.json        # npm configuration
├── .gitignore          # Git ignore rules
├── README.md           # This file
├── css/
│   └── styles.css      # Main stylesheet
├── js/
│   └── app.js          # Application JavaScript
└── .vscode/
    └── settings.json   # VS Code Live Server config
```

---

## 🔧 Configuration Files

### package.json
Contains project metadata and dependencies (Express.js for server).

### .gitignore
Excludes `node_modules/`, `.DS_Store`, and other build artifacts.

### .vscode/settings.json
Pre-configured Live Server settings for local development.

---

## 🚀 Deployment Options

### Option 1: Node.js Server (Production)
```bash
# Install dependencies
npm install

# Start server
npm start

# Server runs on port 3000
```

### Option 2: Static Hosting
Deploy `index.html`, `css/`, and `js/` folders to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### Option 3: Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🛠️ Development

### Running Locally
```bash
# Install dependencies
npm install

# Start development server
npm start

# Open browser to http://localhost:3000
```

### Making Changes
1. Edit HTML in `index.html`
2. Edit styles in `css/styles.css`
3. Edit JavaScript in `js/app.js`
4. Refresh browser to see changes

### Testing
- Test all modules by clicking module buttons
- Enter sample data in each module
- Verify output in Summary, Recommendations, Action Plan, and Checklist sections
- Test mobile responsiveness
- Check keyboard navigation
- Validate with screen reader (NVDA, JAWS, VoiceOver)

---

## 📊 Data Storage

The application uses **localStorage** to persist user data:
- Finance tracking history
- Investment preferences
- Career goals
- Interview notes
- Task lists
- Meeting summaries

**Note:** Data is stored locally in the browser. For production, consider implementing:
- Backend API for data persistence
- User authentication
- Cloud storage integration
- Data encryption

---

## 🔮 Future Enhancements

- [ ] Connect to real AI API (OpenAI, Claude, etc.)
- [ ] User authentication and profiles
- [ ] Data visualization with Chart.js
- [ ] Export to PDF
- [ ] Email integration for reminders
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Calendar integration
- [ ] Collaborative features

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For questions or support, please open an issue in the repository.

---

## 🎓 Learning Resources

**Finance:**
- "The Simple Path to Wealth" by JL Collins
- r/personalfinance on Reddit
- Khan Academy - Personal Finance

**Career:**
- "Designing Your Life" by Bill Burnett & Dave Evans
- LinkedIn Learning courses
- Career Contessa

**Productivity:**
- "Getting Things Done" by David Allen
- "Atomic Habits" by James Clear
- Todoist blog

---

**Built with ❤️ for young adults taking control of their future**
"# C240-FA" 
