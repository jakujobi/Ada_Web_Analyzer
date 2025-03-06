# Getting Started

Welcome to the Ada Web Analyzer project! This document will guide you through setting up your development environment and getting the project up and running.

## Prerequisites

Before you begin, make sure you have the following installed:

*   **Python:** Version 3.8 or higher. You can download it from [python.org](https://www.python.org/downloads/).
*   **pip:** Python package installer. It usually comes with Python.
*   **virtualenv:** A tool for creating isolated Python environments. You can install it using pip install virtualenv.

## Setting Up the Development Environment

1.  **Create a virtual environment:**

    `ash
    virtualenv venv
    `

2.  **Activate the virtual environment:**

    *   On Windows:

        `ash
        venv\Scripts\activate
        `

    *   On macOS and Linux:

        `ash
        source venv/bin/activate
        `

3.  **Install the project dependencies:**

    `ash
    pip install -r requirements.txt
    `

## Setting Up the Database

The project uses SQLite by default. You need to run the database migrations to create the necessary tables.

`ash
python manage.py migrate
`

## Running the Development Server

To start the development server, run the following command:

`ash
python manage.py runserver
`

This will start the server on http://127.0.0.1:8000/. You can then access the Ada Web Analyzer in your browser.

## Next Steps

*   Explore the project structure and familiarize yourself with the different components.
*   Read the other onboarding documents to learn more about the project.
*   Start contributing to the project by picking up a task from the issue tracker.
