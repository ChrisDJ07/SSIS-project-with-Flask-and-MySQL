from flask import Blueprint, render_template, request, redirect, url_for, flash
from ..views import uploadPhoto
from ..models import Courses, Students

student = Blueprint('student', __name__)

@student.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        
        id = request.form.get('student-id')
        id = id.replace(" ", "").upper()
        first_name = request.form.get('first-name')
        last_name = request.form.get('last-name')
        course_code = request.form.get('courses')
        year_level = request.form.get('year')
        gender = request.form.get('gender')
        photo_url = ''
        
        # make sure year_level is int
        year_level = int(year_level)
        
        # Handle student photo
        ALLOWED_EXTENSIONS = set(['jpg', 'png', 'jpeg'])
        uploadError = ''
        if 'file' not in request.files:
            flash(f"Operation Failed: file part missing", category="error")
            return redirect(url_for('student.home'))
        file = request.files['file']
        
        print('FILENAMEMEMEMEMEM:')
        print(file.filename)
        
        if '.' not in file.filename or file.filename.rsplit('.', 1)[1].lower() not in ALLOWED_EXTENSIONS:
            flash(f"Operation Failed: media not supported", category="error")
            return redirect(url_for('student.home'))
        elif file.filename == '':
            photo_url = '../static/temp-images/bird-thumbnail.jpg'
            # flash(f"Operation Failed: media not provided", category="error")
        elif file:
            photo_url = uploadPhoto(file, id)
        else:
            flash(f"Operation Failed: missing file", category="error")
            return redirect(url_for('student.home'))
            
        
        # Add the course and check the returned status
        status, error_message = Students.addStudent(id, first_name, last_name, course_code, year_level, gender, photo_url)
        
        if error_message:
            flash(f"Operation Failed: {error_message}", category="error")
        else:
            flash("Student added successfully!", category="success")
        
        return redirect(url_for('student.home'))
    
    return render_template('students.html', data=Students.getAllStudents(), courses=Courses.getAllCourses())
