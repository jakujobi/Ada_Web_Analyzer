# Ada Web Analyzer - Project Overview

## Introduction

Ada Web Analyzer is a comprehensive web-based tool designed to analyze Ada programming language source code. This document provides a high-level overview of the project's purpose, architecture, and components.

## Purpose

The Ada programming language is widely used in mission-critical systems, aerospace, defense, and other high-reliability applications. Ada Web Analyzer aims to:

1. Provide an accessible, browser-based tool for Ada code analysis
2. Help developers identify and fix syntax errors in Ada code
3. Visualize code structure through parse trees and token listings
4. Serve as an educational tool for learning Ada syntax and structure
5. Offer a platform-independent solution that works across operating systems

## Target Users

- **Ada Developers**: Professional developers working with Ada code
- **Students**: Learning the Ada programming language
- **Educators**: Teaching Ada programming concepts
- **Code Reviewers**: Analyzing Ada code structure and quality

## System Architecture

Ada Web Analyzer follows a client-server architecture:

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│             │       │             │       │             │
│  Web Browser│ ─────▶│  Django Web │ ─────▶│ Ada Analysis│
│  (Frontend) │       │  Server     │       │  Modules    │
│             │       │             │       │             │
└─────────────┘       └─────────────┘       └─────────────┘
       ▲                     │                     │
       │                     ▼                     │
       │              ┌─────────────┐              │
       │              │             │              │
       └──────────────│   JSON      │◀─────────────┘
                      │  Response   │
                      │             │
                      └─────────────┘
```

### Key Components

1. **Frontend (Client)**:
   - HTML/CSS/JavaScript web interface
   - Form handling for file uploads and code pasting
   - Results visualization
   - User interaction handling

2. **Web Server (Django)**:
   - Request handling and routing
   - Static file serving
   - View rendering
   - API endpoints

3. **Analysis Modules**:
   - Lexical Analyzer (tokenization)
   - Recursive Descent Parser
   - Parse Tree Generator
   - Error Detection and Reporting

4. **Data Flow**:
   - User submits Ada code (file or text)
   - Server processes the code through analysis modules
   - Results are returned as JSON
   - Frontend renders the results in appropriate formats

## Technology Stack

### Backend

- **Django**: Python web framework for handling requests and responses
- **Python**: Core programming language for backend logic
- **WhiteNoise**: Static file serving in production
- **Gunicorn**: WSGI HTTP server for production deployment

### Frontend

- **HTML5/CSS3**: Structure and styling
- **JavaScript**: Client-side interactivity
- **Bootstrap 5**: Responsive UI framework
- **CodeMirror**: Code editor with syntax highlighting
- **D3.js**: Data visualization library (for parse tree visualization)

### Deployment

- **Render.com**: Cloud hosting platform
- **PostgreSQL**: Database for production (if needed)
- **Git**: Version control system

## Project Structure

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

## Core Features

### 1. Code Input Methods

- **File Upload**: Users can upload .ada files for analysis
- **Code Pasting**: Direct input of Ada code with syntax highlighting
- **Drag-and-Drop**: Intuitive file upload via drag-and-drop

### 2. Analysis Capabilities

- **Lexical Analysis**: Tokenization of Ada source code
- **Syntax Analysis**: Parsing of tokens into a structured format
- **Parse Tree Generation**: Visual representation of code structure
- **Error Detection**: Identification of syntax errors with detailed messages

### 3. Results Visualization

- **Token List**: Display of all tokens with their types and lexemes
- **Parse Tree**: Hierarchical visualization of the code structure
- **Error Reporting**: Clear display of syntax errors with context
- **System Logs**: Detailed logs of the analysis process

### 4. User Experience Features

- **Progress Indication**: Visual feedback during processing
- **Responsive Design**: Works on various screen sizes and devices
- **Error Handling**: User-friendly error messages
- **Application Reset**: Easy way to start a new analysis

## Analysis Pipeline

The Ada code analysis follows this pipeline:

1. **Input Processing**:
   - Code is received from file upload or text input
   - Input is sanitized and prepared for analysis

2. **Lexical Analysis**:
   - Code is tokenized into lexical units (tokens)
   - Each token is classified (keywords, identifiers, literals, etc.)
   - Lexical errors are identified and recorded

3. **Syntax Analysis**:
   - Tokens are parsed according to Ada grammar rules
   - A parse tree is constructed
   - Syntax errors are identified and recorded

4. **Results Preparation**:
   - Tokens, parse tree, and errors are formatted for display
   - JSON response is prepared

5. **Visualization**:
   - Results are rendered in the web interface
   - Parse tree is displayed in a hierarchical format
   - Errors are highlighted for easy identification

## Development Approach

The project follows these development principles:

1. **Feature-Based Development**: New features are developed in dedicated branches
2. **Iterative Improvement**: Continuous enhancement of existing functionality
3. **User-Centered Design**: Focus on usability and user experience
4. **Robust Error Handling**: Comprehensive error detection and reporting
5. **Performance Optimization**: Efficient processing of Ada code

## Current Status and Future Directions

### Current Status

The application currently provides:

- Complete lexical analysis of Ada code
- Recursive descent parsing with parse tree generation
- Web interface for code input and results display
- Deployment to production environment
- Progress indication and system logs display

### Future Directions

Planned enhancements include:

1. **Interactive Parse Tree**: Using D3.js for dynamic visualization
2. **Semantic Analysis**: Beyond syntax checking to include type checking
3. **Code Formatting**: Automatic formatting of Ada code
4. **User Accounts**: Save and share analyses
5. **Advanced Visualization**: More detailed and interactive visualizations

## Conclusion

Ada Web Analyzer provides a powerful, accessible tool for Ada code analysis through a web interface. The project combines modern web technologies with language processing techniques to create a valuable resource for Ada developers, students, and educators.

---

For more detailed information, please refer to:
- [Getting Started Guide](./getting-started.md)
- [Developer Guide](./developer-guide.md)
- [Frontend Guide](./frontend-guide.md)
- [Backend Guide](./backend-guide.md)
