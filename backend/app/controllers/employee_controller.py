from flask import Blueprint, jsonify
from ..models.employee_model import Employee
from ..middleware.auth_middleware import token_required

employee_bp = Blueprint('employees', __name__, url_prefix='/api/employees')

@employee_bp.route('', methods=['GET'])
@token_required
def get_employees(current_user):
    """
    Get all employees (for approver selection)
    """
    employees = Employee.objects().only(
        '_id', 'name', 'department', 'post', 'official_email', 'role'
    ).exclude('password', 'raw_password')
    
    # Filter out non-approvers if needed
    approvers = [emp for emp in employees if emp.role in ['admin', 'academic']]
    
    return jsonify([emp.to_dict() for emp in approvers]), 200

@employee_bp.route('/<employee_id>', methods=['GET'])
@token_required
def get_employee(current_user, employee_id):
    """
    Get single employee details
    """
    employee = Employee.objects(id=employee_id).exclude('password', 'raw_password').first()
    if not employee:
        return jsonify({"error": "Employee not found"}), 404
    
    return jsonify(employee.to_dict()), 200