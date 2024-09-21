from flask import Blueprint, render_template

views = Blueprint('views', __name__)

@views.route('/', methods=['GET', 'POST'])
def home():
    return render_template('students.html')

@views.route('courses', methods=['GET', 'POST'])
def courses():
    return render_template('courses.html')

@views.route('colleges', methods=['GET', 'POST'])
def colleges():
    return render_template('college.html')