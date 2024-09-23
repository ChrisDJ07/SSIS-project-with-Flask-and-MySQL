from flask import Blueprint, render_template, request, flash, jsonify, redirect, url_for
from .models import Colleges, Courses
import json

views = Blueprint('views', __name__)

@views.route('/', methods=['GET', 'POST'])
def home():
    data = request.form
    print(data)
    return render_template('students.html')

@views.route('courses', methods=['GET', 'POST'])
def courses():
    if request.method == 'POST':
        code = request.form.get('course-code')
        name = request.form.get('course-name')
        college_code = request.form.get('college')
        
        # Remove whitespace and make upppercase
        code = code.replace(" ", "").upper()
        # remove the leading and trailing whitespace
        name = name.strip()
        
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
        name = name.strip()
        
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
        status, error_message = Colleges.updateCollege(data['old_code'], data['new_code'], data['new_name'])
        if error_message:
            flash(f"Operation Failed: {error_message}", category="error")
        else:
            flash("College updated successfully!", category="success")  # Success message
    elif(type == 'course'):
        status, error_message = Courses.updateCourse(data['old_code'], data['new_code'], data['new_name'], data['new_college_code'])
        if error_message:
            flash(f"Operation Failed: {error_message}", category="error")
        else:
            flash("Course updated successfully!", category="success")
        
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
        
    return jsonify({}) 