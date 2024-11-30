from flask import Blueprint, render_template, request, redirect, url_for, flash
from ..models import Courses, Colleges

course = Blueprint('course', __name__)

@course.route('courses', methods=['GET', 'POST'])
def courses():
    if request.method == 'POST':
        code = request.form.get('course-code')
        name = request.form.get('course-name')
        college_code = request.form.get('college')
        
        # Remove whitespace and make upppercase
        code = code.replace(" ", "").upper()
        # remove the leading and trailing whitespace
        name = ' '.join(name.split())
        
        # Add the course and check the returned status
        status, error_message = Courses.addCourse(code, name, college_code)
        
        if error_message:
            flash(f"Operation Failed: {error_message}", category="error")
        else:
            flash("Course added successfully!", category="success")
        
        return redirect(url_for('course.courses'))
    
    return render_template('courses.html', data=Courses.getAllCourses(), colleges=Colleges.getAllColleges())
