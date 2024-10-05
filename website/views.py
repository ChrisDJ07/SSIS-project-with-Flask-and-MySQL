from flask import Blueprint, render_template, request, flash, jsonify, redirect, url_for
from .models import Colleges, Courses, Students
import json

views = Blueprint('views', __name__)

@views.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        code = request.form.get('course-code')
        name = request.form.get('course-name')
        college_code = request.form.get('college')
        
        id = request.form.get('student-id')
        id = id.replace(" ", "").upper()
        first_name = request.form.get('first-name')
        last_name = request.form.get('last-name')
        course_code = request.form.get('courses')
        year_level = request.form.get('year')
        gender = request.form.get('gender')
        
        # make sure year_level is int
        year_level = int(year_level)
        
        # Add the course and check the returned status
        status, error_message = Students.addStudent(id, first_name, last_name, course_code, year_level, gender)
        
        if error_message:
            flash(f"Operation Failed: {error_message}", category="error")
        else:
            flash("Student added successfully!", category="success")
        
        return redirect(url_for('views.home'))
    
    return render_template('students.html', data=Students.getAllStudents(), courses=Courses.getAllCourses())

@views.route('courses', methods=['GET', 'POST'])
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
        
        return redirect(url_for('views.courses'))
    
    return render_template('courses.html', data=Courses.getAllCourses(), colleges=Colleges.getAllColleges())

@views.route('colleges', methods=['GET', 'POST'])
def colleges():
    if request.method == 'POST':
        code = request.form.get('college-code')
        name = request.form.get('college-name')
        
        code = code.replace(" ", "").upper()
        name = ' '.join(name.split())
        
        # Add the college and check the returned status
        status, error_message = Colleges.addCollege(code, name)
    
        if error_message:
            flash(f"Operation Failed: {error_message}", category="error")
        else:
            flash("College added successfully!", category="success")  # Success message
        
        return redirect(url_for('views.colleges'))
    
    return render_template('college.html', data=Colleges.getAllColleges())


@views.route('/update-field', methods=['POST'])
def update_field():
    data = json.loads(request.data)
    type = data['type']
    
    if (type == 'college'):
        new_name = data['new_name'];
        new_name = ' '.join(new_name.split())
        status, error_message = Colleges.updateCollege(data['old_code'], data['new_code'].strip(), new_name)
        if error_message:
            flash(f"Operation Failed: {error_message}", category="error")
        else:
            flash("College updated successfully!", category="success")  # Success message
    elif(type == 'course'):
        new_name = data['new_name'];
        new_name = ' '.join(new_name.split())
        status, error_message = Courses.updateCourse(data['old_code'], data['new_code'].strip(), new_name, data['new_college_code'])
        if error_message:
            flash(f"Operation Failed: {error_message}", category="error")
        else:
            flash("Course updated successfully!", category="success")
    elif(type == 'student'):
        status, error_message = Students.updateStudent(data['old_code'], data['new_id'].strip(), data['new_first_name'], data['new_last_name'], data['new_course_code'], data['new_year'], data['new_gender'])
        if error_message:
            flash(f"Operation Failed: {error_message}", category="error")
        else:
            flash("Student updated successfully!", category="success")
        
    return jsonify({}) 


@views.route('/delete-field', methods=['POST'])
def delete_field():
    data = json.loads(request.data)
    type = data['type']
    
    if (type == 'college'):
        Colleges.deleteCollege(data['id'])
        flash("College deleted successfully!", category="success")
    elif (type == 'course'):
        Courses.deleteCourse(data['id'])
        flash("Course deleted successfully!", category="success")
    elif (type == 'student'):
        Students.deleteStudent(data['id'])
        flash("Student deleted successfully!", category="success")
        
    return jsonify({}) 

@views.route('/delete-selected', methods=['POST'])
def delete_selected():
    data = json.loads(request.data)
    type = data['type']
    list = data['selectedValues']
    
    if (type == 'colleges'):
        for item in list:
            Colleges.deleteCollege(item)
        flash("Selected Colleges deleted successfully!", category="success")
    elif (type == 'courses'):
        for item in list:
            Courses.deleteCourse(item)
        flash("Selected Courses deleted successfully!", category="success")
    elif (type == 'students'):
        for item in list:
            Students.deleteStudent(item)
        flash("Selected Students deleted successfully!", category="success")
        
    return jsonify({}) 