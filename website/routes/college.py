from flask import Blueprint, render_template, request, redirect, url_for, flash
from ..models import Colleges

college = Blueprint('college', __name__)

@college.route('colleges', methods=['GET', 'POST'])
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
        
        return redirect(url_for('college.colleges'))
    
    return render_template('college.html', data=Colleges.getAllColleges())
