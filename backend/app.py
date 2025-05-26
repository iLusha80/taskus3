from flask import Flask
from flask_cors import CORS
from config import Config
from database import db, init_db
from api import register_blueprints

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, resources={r"/api/*": {"origins": "*"}})

db.init_app(app)

with app.app_context():
    init_db(app)

register_blueprints(app)

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0')
