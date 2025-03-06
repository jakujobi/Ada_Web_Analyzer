# Ada Web Analyzer

## Project Overview

Ada Web Analyzer is a web-based tool designed to analyze Ada programming language source code. It provides developers with powerful tools for lexical analysis, syntax parsing, and visualization of Ada code structure. The application helps users identify syntax errors, understand code organization, and visualize relationships through parse trees.

**Live Demo**: [ada.jakujobi.com](https://ada.jakujobi.com)  
**Repository**: [github.com/jakujobi/Ada_Web_Analyzer](https://github.com/jakujobi/Ada_Web_Analyzer)

## Purpose and Goals

The Ada programming language is widely used in mission-critical systems, aerospace, defense, and other high-reliability applications. Ada Web Analyzer aims to:

1. Provide an accessible, browser-based tool for Ada code analysis
2. Help developers identify and fix syntax errors in Ada code
3. Visualize code structure through parse trees and token listings
4. Serve as an educational tool for learning Ada syntax and structure
5. Offer a platform-independent solution that works across operating systems

## Technical Architecture

### Tech Stack

- **Backend**: Django (Python web framework)
- **Frontend**: HTML, CSS, JavaScript
- **UI Framework**: Bootstrap 5
- **Code Editor**: CodeMirror
- **Visualization**: D3.js
- **Deployment**: Render.com
- **Static File Serving**: WhiteNoise
- **Database**: PostgreSQL (in production)

### Core Components

1. **Lexical Analyzer**: Tokenizes Ada source code into lexical units
2. **Recursive Descent Parser**: Builds a parse tree from tokens
3. **Web Interface**: Provides file upload and code pasting capabilities
4. **Visualization Engine**: Renders parse trees in a human-readable format

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

## Features Implemented

### Core Functionality

1. **Code Input Methods**:
   - File upload for .ada files
   - Direct code pasting with syntax highlighting
   - Drag-and-drop file upload

2. **Analysis Capabilities**:
   - Lexical analysis (tokenization)
   - Syntax analysis (parsing)
   - Parse tree generation
   - Error detection and reporting

3. **User Interface**:
   - Responsive design using Bootstrap 5
   - Tabbed interface for different result views
   - Syntax-highlighted code editor
   - Progress indicators and processing status
   - System logs display

4. **Results Visualization**:
   - Token list display
   - Hierarchical parse tree visualization
   - Error highlighting and reporting

### Technical Implementations

1. **Frontend Enhancements**:
   - CodeMirror integration for code editing
   - AJAX form submissions for asynchronous processing
   - Progress bar for processing status
   - System logs display for transparency
   - Reload application button for user convenience
   - Comprehensive error handling and user feedback

2. **Backend Improvements**:
   - Robust error handling and logging
   - CSRF protection for form submissions
   - Optimized code processing pipeline
   - Detailed logging throughout the processing flow
   - Exception handling with informative error messages

3. **Deployment Optimizations**:
   - WhiteNoise integration for static file serving
   - Production-ready settings configuration
   - Comprehensive logging for debugging
   - Environment variable management
   - Procfile and runtime.txt for Render deployment

## Development Milestones

### Phase 1: Initial Setup and Core Functionality

- [x] Set up Django project structure
- [x] Implement basic lexical analyzer for Ada
- [x] Create recursive descent parser
- [x] Develop web interface for code input
- [x] Implement file upload functionality
- [x] Add code pasting capability
- [x] Create basic results display

### Phase 2: Enhanced User Experience

- [x] Integrate CodeMirror for syntax highlighting
- [x] Implement drag-and-drop file upload
- [x] Create tabbed interface for results
- [x] Add token list visualization
- [x] Implement parse tree visualization
- [x] Improve error reporting and display
- [x] Add responsive design with Bootstrap 5

### Phase 3: Production Deployment

- [x] Configure static files for production
- [x] Implement WhiteNoise for static file serving
- [x] Set up Render.com deployment
- [x] Configure environment variables
- [x] Add production-ready settings
- [x] Implement CSRF protection
- [x] Create Procfile and runtime.txt

### Phase 4: User Experience Improvements

- [x] Add progress bar for processing status
- [x] Implement system logs display
- [x] Add reload application button
- [x] Enhance error handling and user feedback
- [x] Improve AJAX request handling
- [x] Add comprehensive logging
- [ ] Implement interactive parse tree visualization (In Progress)

## Challenges Overcome

### Technical Challenges

1. **Parser Implementation**:
   - Developed a recursive descent parser for Ada's complex syntax
   - Implemented error recovery mechanisms
   - Created a hierarchical parse tree structure

2. **Frontend-Backend Integration**:
   - Established seamless AJAX communication
   - Implemented proper CSRF token handling
   - Created robust error handling between layers

3. **Deployment Issues**:
   - Resolved static file serving in production
   - Fixed CSRF token issues in production environment
   - Implemented proper logging for production debugging
   - Configured WhiteNoise for efficient static file serving

4. **User Experience**:
   - Balanced technical output with user-friendly presentation
   - Implemented progress indicators for long-running operations
   - Added system logs visibility for transparency

## Recent Enhancements

### UI Improvements

1. **Progress Bar**:
   - Added a visual progress indicator
   - Implemented status updates during processing
   - Created a more responsive user experience

2. **System Logs Display**:
   - Added a toggle to show/hide system logs
   - Implemented real-time log updates
   - Styled logs for better readability

3. **Application Reload**:
   - Added a button to reset the application state
   - Implemented clean state reset functionality
   - Improved user workflow for multiple analyses

### Backend Enhancements

1. **Improved Logging**:
   - Configured comprehensive logging system
   - Added detailed logs throughout the processing pipeline
   - Implemented log file and console output

2. **Error Handling**:
   - Enhanced exception handling
   - Added more informative error messages
   - Implemented graceful failure modes

3. **Performance Optimizations**:
   - Improved code processing efficiency
   - Optimized static file serving
   - Enhanced AJAX request handling

## Future Roadmap

### Short-term Goals

1. **Interactive Parse Tree**:
   - Implement D3.js for interactive visualization
   - Add zoom and pan capabilities
   - Create collapsible tree nodes

2. **Enhanced Error Reporting**:
   - Add line and column references for errors
   - Implement in-editor error highlighting
   - Create more descriptive error messages

3. **User Preferences**:
   - Add theme switching (light/dark mode)
   - Implement editor preferences saving
   - Create customizable UI layouts

### Long-term Vision

1. **Semantic Analysis**:
   - Add type checking capabilities
   - Implement variable tracking
   - Create scope analysis

2. **Code Generation**:
   - Add simple code generation features
   - Implement basic optimization
   - Create educational visualizations of generated code

3. **Collaborative Features**:
   - Implement code sharing functionality
   - Add commenting and annotation
   - Create user accounts for saving analyses

## Technical Details

### Lexical Analyzer

The lexical analyzer tokenizes Ada source code into a stream of tokens, identifying:

- Keywords (e.g., `procedure`, `begin`, `end`)
- Identifiers (variable and function names)
- Literals (numbers, strings)
- Operators and punctuation
- Comments

Implementation is based on a state machine approach with comprehensive error handling.

### Recursive Descent Parser

The parser implements Ada's grammar using recursive descent parsing techniques:

- Top-down parsing approach
- Predictive parsing for efficiency
- Error recovery mechanisms
- Parse tree construction during parsing

### Web Interface

The web interface provides:

- File upload with drag-and-drop support
- Code editor with syntax highlighting
- Tabbed results view
- Progress indication
- System logs display
- Error reporting

## Deployment Information

The application is deployed on Render.com with the following configuration:

- **Web Service**: Python application
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn ada_web_analyzer.wsgi:application`
- **Python Version**: 3.11.0
- **Environment Variables**: Configured for production settings

## Contributors

- **John Akujobi** - Project Lead and Main Developer

## Conclusion

Ada Web Analyzer has evolved from a basic code analysis tool to a comprehensive web application for Ada code processing. The project has successfully implemented lexical and syntax analysis capabilities, wrapped in a user-friendly web interface with modern features like progress indication and system logs display.

The application continues to be improved with a focus on enhancing user experience, expanding analysis capabilities, and optimizing performance. Future development will focus on interactive visualizations, semantic analysis, and collaborative features.

---

*Last Updated: March 6, 2025*
