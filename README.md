# Simple Student Information System (SSIS)

This project is a web-based **Simple Student Information System (SSIS)** built using Flask. The system allows administrators to manage student, course, and college records. It also includes functionality for file uploads (student photos) and basic CRUD operations (Create, Read, Update, Delete) on these entities.

## Features

- **Student Management:**
  - Add, update, delete, and view students.
  - Upload student photos with supported formats (JPEG, PNG).
  
- **Course Management:**
  - Add, update, delete, and view courses.
  
- **College Management:**
  - Add, update, delete, and view colleges.
  
- **Batch Operations:**
  - Delete multiple selected entries (students, courses, colleges) at once.

- **File Upload:**
  - Student photo uploads.

## Technologies Used

- **Flask**: A lightweight web framework for Python.
- **Jinja2**: Templating engine for rendering dynamic content.
- **Werkzeug**: Utility for secure file handling.
- **JavaScript (Fetch API)**: For handling asynchronous requests and CRUD operations.
- **MySQL**: For database operations on students, courses, and colleges.
- **CSRF Protection**: Prevents Cross-Site Request Forgery using Flask-WTF or manual tokens.

## Project Structure

- **Blueprints**: Used to modularize the application, with all views routed through the `views` Blueprint.
- **Templates**: Rendered using Jinja2 for dynamic content generation.
- **Static**: Directory for storing static assets like uploaded images.

## Setup Instructions

### Prerequisites

- Python 3.x
- Flask
- MySQL
- Pip for managing dependencies
