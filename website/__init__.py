from flask import Flask
from flask_wtf import CSRFProtect

# initialize app
def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'darktower'
    
    # Initialize CSRF protection
    CSRFProtect(app)
    
    # register blueprints
    from .views import views
    app.register_blueprint(views, url_prefix='/')

    return app