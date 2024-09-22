from flask import Blueprint, render_template, request, flash, jsonify, redirect, url_for
from .models import Colleges
import json

views = Blueprint('views', __name__)

@views.route('/', methods=['GET', 'POST'])
def home():
    data = request.form
    print(data)
    return render_template('students.html')

@views.route('courses', methods=['GET', 'POST'])
def courses():
    data = request.form
    print(data)
    return render_template('courses.html')

@views.route('colleges', methods=['GET', 'POST'])
def colleges():
    if request.method == 'POST':
        code = request.form.get('college-code')
        name = request.form.get('college-name')
        
        # Remove whitespace and make upppercase
        code = code.replace(" ", "").upper()
        # remove the leading and trailing whitespace
        name = name.strip()
        
        Colleges.addCollege(code, name)
        flash("College added successfully!", category="success")
        
        return redirect(url_for('views.colleges'))
    
    return render_template('college.html', data=Colleges.getAllColleges())


@views.route('/update-field', methods=['POST'])
def update_field():
    data = json.loads(request.data)
    type = data['type']
    
    if (type == 'college'):
        Colleges.updateCollege(data['old_code'], data['new_code'], data['new_name'])
        flash("College updated successfully!", category="success")
        
    return jsonify({}) 


@views.route('/delete-field', methods=['POST'])
def delete_field():
    data = json.loads(request.data)
    type = data['type']
    
    if (type == 'college'):
        Colleges.deleteCollege(data['id'])
        flash("College deleted successfully!", category="success")
        
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
        
    return jsonify({}) 