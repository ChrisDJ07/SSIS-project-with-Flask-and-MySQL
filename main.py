from website import create_app

# calls create_app() from __init__.py in website
app = create_app()

if __name__ == '__main__':
    # debug mode on
    app.run(debug=True)