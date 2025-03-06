# Getting Started with Ada Web Analyzer

This guide will walk you through setting up your development environment and running the Ada Web Analyzer project locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11+** - The main programming language used for the backend
- **Git** - For version control and cloning the repository
- **A code editor** - We recommend Visual Studio Code with Python extensions
- **Basic knowledge of command line** - For running commands and managing the environment

## Installation Steps

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/jakujobi/Ada_Web_Analyzer.git
cd Ada_Web_Analyzer
```

### 2. Create a Virtual Environment

It's recommended to use a virtual environment to isolate project dependencies:

#### On Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

#### On macOS/Linux:

```bash
python -m venv venv
source venv/bin/activate
```

You should see `(venv)` appear at the beginning of your command prompt, indicating that the virtual environment is active.

### 3. Install Dependencies

Install all required packages using pip:

```bash
pip install -r requirements.txt
```

This will install Django, WhiteNoise, and all other dependencies listed in the requirements.txt file.

### 4. Apply Database Migrations

Initialize the database with:

```bash
python manage.py migrate
```

This will create the necessary database tables for the application.

### 5. Collect Static Files (Optional for Development)

If you want to test static file serving with WhiteNoise:

```bash
python manage.py collectstatic
```

### 6. Run the Development Server

Start the Django development server:

```bash
python manage.py runserver
```

The server will start at http://127.0.0.1:8000/. Open this URL in your browser to access the application.

## Project Verification

To verify that everything is working correctly:

1. Navigate to http://127.0.0.1:8000/ in your browser
2. You should see the Ada Web Analyzer interface with options to upload a file or paste code
3. Try uploading a sample Ada file or pasting Ada code to test the analysis functionality

## Sample Ada Code for Testing

Here's a simple Ada code snippet you can use for testing:

```ada
procedure Hello is
begin
   Put_Line("Hello, World!");
end Hello;
```

## Development Workflow

1. Make changes to the code
2. Test your changes locally
3. Commit your changes to a feature branch
4. Push your changes to GitHub
5. Create a pull request for review

## Common Issues and Solutions

### Issue: Module Not Found Errors

If you encounter "Module not found" errors, ensure your virtual environment is activated and all dependencies are installed:

```bash
pip install -r requirements.txt
```

### Issue: Static Files Not Loading

If static files aren't loading properly:

1. Check that `DEBUG = True` in settings.py for development
2. Run `python manage.py collectstatic`
3. Ensure WhiteNoise is properly configured in settings.py

### Issue: Database Errors

For database-related errors:

1. Delete the db.sqlite3 file (if using SQLite)
2. Run `python manage.py migrate` again

## Next Steps

Once you have the project running locally, you might want to:

1. Explore the [Project Structure](./project-overview.md) to understand the codebase
2. Check out the [Developer Guide](./developer-guide.md) for more detailed information
3. Look at the [Frontend Guide](./frontend-guide.md) or [Backend Guide](./backend-guide.md) depending on your interests

## Need Help?

If you encounter any issues not covered in this guide:

- Check the [Troubleshooting](./troubleshooting.md) guide
- Reach out to the project lead or team members
- Create an issue on GitHub

---

Happy coding! 🚀
