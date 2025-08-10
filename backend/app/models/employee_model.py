# models/employee_model.py
from mongoengine import Document, StringField, EmailField, DateTimeField
from werkzeug.security import generate_password_hash, check_password_hash
import datetime


class Employee(Document):
    employee_id = StringField(required=True, unique=True)
    name = StringField(required=True)
    department = StringField(required=True)
    post = StringField(required=True)
    specialization = StringField()
    mobile = StringField()
    official_email = EmailField(required=True, unique=True)
    email = EmailField(required=True, unique=True)
    password = StringField()  # For hashed passwords
    raw_password = StringField()  # For plaintext passwords from CSV
    role = StringField(required=True, choices=[
        'admin', 'academic', 'fees', 'exam', 'placement', 'faculty'
    ],default="employee")
    created_at = DateTimeField(default=datetime.datetime.utcnow)
    
    meta = {
        'collection': 'employee',
        'indexes': [
            'employee_id',
            'official_email',
            'email',
            'department',
            'role'
        ]
    }

    
    def set_password(self, password):
        """Hash and store password, clear raw_password"""
        self.password = generate_password_hash(password)
        self.raw_password = None  # Always clear after hashing
        self.save()
        
    def check_password(self, password):
        """Only check against hashed password"""
        if not self.password:
            return False
        return check_password_hash(self.password, password)
    
    def clean(self):
        """Automatically hash raw_password on save if present"""
        if self.raw_password:
            self.set_password(self.raw_password)