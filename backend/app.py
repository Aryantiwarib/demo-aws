from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv
from mongoengine import connect
from pymongo.errors import ConnectionFailure

# Load environment variables
load_dotenv()
PORT = os.environ.get('PORT', 5001)

def create_app():
    app = Flask(__name__)
    
    # Configuration (identical to original)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6k')

    # CORS (identical to original)
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000","*"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Authorization", "Content-Type"],
            "supports_credentials": True
        }
    })

    # Database Connection (identical to original)
    MONGO_URI = os.environ.get('MONGO_URI')
    try:
        connect(db="smart-notice", host=MONGO_URI)
        print("✅ MongoDB Connected Successfully!")
    except ConnectionFailure as e:
        print("❌ MongoDB Connection Failed:", str(e))

    # Import and register blueprints
    from app.controllers.auth_controllers import auth_bp
    from app.controllers.notices_controller import notice_bp
    from app.controllers.student_controllers import student_bp
    from app.controllers.department_controllers import department_bp
    from app.controllers.user_controllers import user_bp
    from app.controllers.university_controllers import university_bp
    from app.controllers.student_profile_controller import profile_bp
    from app.controllers.digitalSignature import digital_signature_bp
    # from app.controllers.notification_controller import notification_bp

    from app.controllers.employee_controller import employee_bp
    from app.controllers.approval_controller import approval_bp
    # from app.controllers.digitalSignature import digital_signature_bp
    # from app.controllers.approval_controllers import approval_bp




    app.register_blueprint(auth_bp)
    app.register_blueprint(notice_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(department_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(university_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(digital_signature_bp)
    app.register_blueprint(employee_bp)
    app.register_blueprint(approval_bp)
    # app.register_blueprint(digital_signature_bp)

    # app.register_blueprint(notification_bp)

    @app.route("/")
    def hello():
        return "WELCOME TO AWS BACKEND"

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=PORT)