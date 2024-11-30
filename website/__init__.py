from flask import Flask
from flask_wtf.csrf import CSRFProtect
from dotenv import load_dotenv
import os


# initialize app
def create_app():
    load_dotenv()
    
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY')

    # Initialize CSRF protection
    CSRFProtect(app)

    # register blueprints
    from .views import views
    app.register_blueprint(views, url_prefix='/')
    
    from .routes.student import student
    app.register_blueprint(student, url_prefix='/')

    from .routes.course import course
    app.register_blueprint(course, url_prefix='/')

    from .routes.college import college
    app.register_blueprint(college, url_prefix='/')

    return app
