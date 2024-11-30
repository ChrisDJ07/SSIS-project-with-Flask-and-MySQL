from flask import Blueprint, render_template, request, flash, jsonify, redirect
from .models import Colleges, Courses, Students
from .upload import uploadFile, uploadPhoto
import json

views = Blueprint('views', __name__)

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
        status, error_message = Students.updateStudent(data['old_code'], data['new_id'].strip(), data['new_first_name'], data['new_last_name'], data['new_course_code'], data['new_year'], data['new_gender'], data['new_photo'])
        print(f"new photo = {data['new_photo']}")
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

@views.route('/update-photo', methods=['POST'])
def update_photo():
    ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}
    
    # Check if form data and file are present in the request
    if 'file' not in request.files:
        return jsonify({'error': 'file part missing'}), 400
    
    file = request.files['file']
    id = request.form.get('id')  # Expecting 'id' from form data
    
    if not id:
        return jsonify({'error': 'Student ID is missing'}), 400

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Verify file extension
    if '.' not in file.filename or file.filename.rsplit('.', 1)[1].lower() not in ALLOWED_EXTENSIONS:
        return jsonify({'error': 'Invalid file type'}), 400
    
    # If everything is correct, process the file (upload, etc.)
    try:
        photo_url = uploadPhoto(file, id)  # Assuming `uploadPhoto()` handles the file saving/uploading
        return jsonify({'new_photo': photo_url}), 200
    except Exception as e:
        return jsonify({'error': f'File upload failed: {str(e)}'}), 500
