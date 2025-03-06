# Ada Web Analyzer - Junior Developer Onboarding Guide

## Welcome to the Team! 👋

We're excited to have you join the Ada Web Analyzer project! This comprehensive guide will help you understand the project, set up your development environment, and start contributing effectively. Let's get started!

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Getting Started](#2-getting-started)
3. [Project Structure](#3-project-structure)
4. [Core Features and Workflow](#4-core-features-and-workflow)
5. [Development Workflow](#5-development-workflow)
6. [Frontend Development](#6-frontend-development)
7. [Backend Development](#7-backend-development)
8. [Testing](#8-testing)
9. [Deployment](#9-deployment)
10. [Recent Enhancements](#10-recent-enhancements)
11. [Current Challenges and Roadmap](#11-current-challenges-and-roadmap)
12. [Getting Help](#12-getting-help)
13. [Your First Tasks](#13-your-first-tasks)

---

## 1. Project Overview

### What is Ada Web Analyzer?

Ada Web Analyzer is a web-based tool designed to analyze Ada programming language source code. The application provides:

- **Lexical analysis** (tokenization)
- **Syntax analysis** (parse tree generation)
- **Error reporting and debugging**
- **Interactive visualization of parse trees**

### Why We Built It

Ada is a structured, statically typed programming language that's used in mission-critical systems. Our analyzer helps developers understand Ada code structure, identify syntax errors, and visualize code relationships through parse trees.

### Tech Stack

- **Backend**: Django (Python web framework)
- **Frontend**: HTML, CSS, JavaScript
- **Libraries**:
  - Bootstrap 5 (UI framework)
  - CodeMirror (code editor)
  - D3.js (visualization)
- **Deployment**: Render.com

---

## 2. Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11+**
- **Git**
- **A code editor** (VS Code recommended)
- **Basic knowledge of HTML, CSS, JavaScript, and Python**

### Setting Up Your Development Environment

1. **Clone the repository**:

   ```bash
   git clone https://github.com/jakujobi/Ada_Web_Analyzer.git
   cd Ada_Web_Analyzer
   ```
2. **Create a virtual environment**:

   ```bash
   python -m venv venv

   # On Windows
   venv\Scripts\activate

   # On macOS/Linux
   source venv/bin/activate
   ```
3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```
4. **Apply database migrations**:

   ```bash
   python manage.py migrate
   ```
5. **Run the development server**:

   ```bash
   python manage.py runserver
   ```
6. **Access the application**:
   Open your browser and navigate to `http://127.0.0.1:8000/`

---

## 3. Project Structure

### Directory Layout

```
Ada_Web_Analyzer/
│── ada_web_analyzer/       # Main Django project directory
│   ├── settings.py         # Project settings
│   ├── urls.py             # Main URL routing
│   ├── wsgi.py             # WSGI configuration
│   └── asgi.py             # ASGI configuration
│
│── analysis/               # Main Django app
│   ├── static/             # Static assets
│   │   ├── analysis/     
│   │   │   ├── css/        # CSS files
│   │   │   ├── js/         # JavaScript files
│   │   │   └── images/     # Image assets
│   ├── templates/          # HTML templates
│   │   └── analysis/     
│   │       ├── upload_code.html  # Main page template
│   ├── views.py            # View functions
│   ├── urls.py             # App-specific URL routing
│   └── models.py           # Database models
│
│── Modules/                # Core analyzer modules
│   ├── LexicalAnalyzer.py  # Tokenization logic
│   ├── RDParser.py         # Recursive descent parser
│   └── Definitions.py      # Token definitions
│
│── staticfiles/            # Collected static files (for production)
│── manage.py               # Django management script
│── requirements.txt        # Python dependencies
│── Procfile                # Deployment configuration for Render
└── runtime.txt             # Python version for deployment
```

### Key Files Explained

- **upload_code.html**: The main interface where users upload or paste Ada code
- **main.js**: Handles form submissions, AJAX requests, and results display
- **views.py**: Contains the backend logic for processing code and returning results
- **LexicalAnalyzer.py**: Tokenizes Ada code into lexical units
- **RDParser.py**: Builds a parse tree from tokens

---

## 4. Core Features and Workflow

### User Interface

The application has a simple, intuitive interface:

1. **Upload Section**: Users can upload .ada files or paste code directly
2. **Results Section**: Displays tokens, parse tree, and logs/errors
3. **Progress Section**: Shows processing status and system logs

### Processing Pipeline

When a user submits code:

1. **Frontend**: JavaScript collects the code and sends it to the backend
2. **Backend**:
   - Code is tokenized by the lexical analyzer
   - Tokens are processed by the parser to build a parse tree
   - Results are returned as JSON
3. **Frontend**: Results are displayed in the appropriate tabs

### Key Components

- **Lexical Analyzer**: Identifies tokens like keywords, identifiers, operators
- **Parser**: Builds a hierarchical structure (parse tree) from tokens
- **Visualization**: Renders the parse tree in a human-readable format

---

## 5. Development Workflow

### Git Workflow

We follow a feature-branch workflow:

1. **Main Branch**: Production-ready code
2. **Feature Branches**: For new features (`feature/feature-name`)
3. **Bugfix Branches**: For bug fixes (`bugfix/bug-name`)

### Making Changes

1. **Create a branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Make your changes**
3. **Test locally**:

   ```bash
   python manage.py runserver
   ```
4. **Commit your changes**:

   ```bash
   git add .
   git commit -m "Add descriptive message about your changes"
   ```
5. **Push to GitHub**:

   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a pull request** for review

### Code Style

- **Python**: Follow PEP 8 guidelines
- **JavaScript**: Use camelCase for variables and functions
- **HTML/CSS**: Use descriptive class names with hyphens (e.g., `progress-bar`)

---

## 6. Frontend Development

### Key Files

- **upload_code.html**: Main template with the UI structure
- **main.js**: Core JavaScript functionality
- **style.css**: Custom styling

### JavaScript Architecture

The main.js file is organized into sections:

1. **DOM Elements**: References to important HTML elements
2. **Event Listeners**: Handles user interactions
3. **AJAX Functions**: Communicates with the backend
4. **UI Update Functions**: Updates the interface based on results

### Adding UI Features

To add new UI elements:

1. Add HTML markup to the appropriate section in upload_code.html
2. Add CSS styles in style.css
3. Add JavaScript functionality in main.js
4. Test the feature thoroughly

---

## 7. Backend Development

### Django Views

The main views are:

- **upload_code_view**: Renders the main page
- **process_code_view**: Processes submitted code and returns results

### Core Modules

- **LexicalAnalyzer**: Tokenizes the input code
- **RDParser**: Builds the parse tree
- **Definitions**: Contains token definitions and utilities

### Adding Backend Features

To add new backend functionality:

1. Modify the appropriate module in the Modules directory
2. Update views.py to use the new functionality
3. Ensure the frontend can handle any new data formats
4. Add tests for the new functionality

---

## 8. Testing

### Manual Testing

For now, we rely on manual testing:

1. Test file uploads with various .ada files
2. Test code pasting with different code snippets
3. Verify results in all tabs (tokens, parse tree, logs)
4. Check error handling with invalid code

### Test Files

Sample Ada files for testing are available in the `test_files` directory.

---

## 9. Deployment

### Deployment Process

We deploy to Render.com:

1. Changes pushed to the main branch trigger automatic deployment
2. Static files are collected and served by WhiteNoise
3. The application runs with Gunicorn in production

### Environment Variables

Production uses these environment variables:

- `DEBUG`: Set to False in production
- `ALLOWED_HOSTS`: List of allowed hostnames
- `SECRET_KEY`: Django secret key

---

## 10. Recent Enhancements

We've recently added:

1. **Progress Bar**: Shows processing status
2. **System Logs Display**: Shows backend processing details
3. **Reload Button**: Allows users to reset the application
4. **Improved Error Handling**: Better feedback for users

---

## 11. Current Challenges and Roadmap

### Current Challenges

- Ensuring consistent behavior between development and production
- Handling large Ada files efficiently
- Improving parse tree visualization

### Future Roadmap

1. **Enhanced Visualization**: Interactive D3.js parse tree
2. **Code Formatting**: Automatic Ada code formatting
3. **Semantic Analysis**: Beyond syntax checking
4. **User Accounts**: Save and share analyses

---

## 12. Getting Help

### Resources

- **Project Documentation**: Available in the `docs` folder
- **Ada Language Reference**: [Ada Reference Manual](https://www.adaic.org/resources/add_content/standards/12rm/html/RM-TOC.html)
- **Django Documentation**: [Django Docs](https://docs.djangoproject.com/)

### Team Communication

- **Weekly Meetings**: Tuesdays at 10 AM
- **Code Reviews**: Required for all pull requests
- **Questions**: Feel free to ask in our team chat

---

## 13. Your First Tasks

Here are some beginner-friendly tasks to get you started:

1. **Add a simple feature**: Implement a "Copy to Clipboard" button for code
2. **Fix a small bug**: Check the GitHub issues labeled "good first issue"
3. **Improve documentation**: Add comments to a section of code you're learning about
4. **Write a test case**: Create a test for an existing feature

---

## Conclusion

We're thrilled to have you on the team! This project offers great opportunities to learn about web development, language processing, and building useful developer tools. Don't hesitate to ask questions and share your ideas.

**Remember**: Everyone was a beginner once. Take your time to understand the codebase, ask questions, and enjoy the learning process!

---

## Contact Information

- **Project Lead**: John Akujobi (jakujobi@gmail.com)
- **Website**: [ada.jakujobi.com](https://ada.jakujobi.com)
- **GitHub Repository**: [github.com/jakujobi/Ada_Web_Analyzer](https://github.com/jakujobi/Ada_Web_Analyzer)

---

*Happy coding!* 🚀
