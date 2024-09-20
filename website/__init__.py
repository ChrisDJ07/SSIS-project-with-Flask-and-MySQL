from flask import Flask

# initialize app
def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'darktower'
    
    # register blueprints
    from .views import views
    app.register_blueprint(views, url_prefix='/')

    return app