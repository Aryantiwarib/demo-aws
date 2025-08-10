from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
from ..models.notice_model import Notice
from ..models.user_model import User
from ..middleware.auth_middleware import token_required


from ..models.approval_model import Approval

approval_bp = Blueprint('approvals', __name__, url_prefix='/api/approvals')

@approval_bp.route('/request', methods=['POST'])
@token_required
def request_approval(current_user):
    try:
        data = request.get_json()
        notice_id = data.get('notice_id')
        
        if not notice_id:
            return jsonify({"error": "Notice ID is required"}), 400
            
        notice = Notice.objects(id=ObjectId(notice_id)).first()
        if not notice:
            return jsonify({"error": "Notice not found"}), 404
            
        if notice.approval_status != "pending":
            return jsonify({"error": "Approval already processed for this notice"}), 400
            
        # Get all employees who can approve (excluding students)
        approvers = User.objects(role__ne="student").all()
        
        if not approvers:
            notice.update(
                approval_status="approved",
                status="published"
            )
            return jsonify({"message": "No approvers found, notice approved automatically"}), 200
            
        # Create approval records for each approver
        approval_workflow = []
        for approver in approvers:
            approval = Approval(
                notice_id=notice.id,
                approver_id=approver.id,
                approver_name=approver.name,
                approver_role=approver.role,
                status="pending"
            ).save()
            approval_workflow.append(approval)
            
        notice.update(
            approval_workflow=approval_workflow,
            approval_status="pending",
            status="pending_approval"
        )
        
        return jsonify({
            "message": "Approval requested successfully",
            "approvers": len(approval_workflow)
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@approval_bp.route('/my', methods=['GET'])
@token_required
def get_my_approvals(current_user):
    try:
        approvals = Approval.objects(
            approver_id=str(current_user.id)
        ).order_by('-created_at')
        
        result = []
        for approval in approvals:
            notice = Notice.objects(id=approval.notice_id).first()
            if notice:
                result.append({
                    "id": str(approval.id),
                    "notice_id": str(notice.id),
                    "title": notice.title,
                    "content": notice.content,
                    "notice_type": notice.notice_type,
                    "status": approval.status,
                    "created_at": approval.created_at.isoformat(),
                    "approved_at": approval.approved_at.isoformat() if approval.approved_at else None,
                    "comments": approval.comments
                })
                
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@approval_bp.route('/<approval_id>/approve', methods=['POST'])
@token_required
def approve_notice(current_user, approval_id):
    try:
        approval = Approval.objects(id=ObjectId(approval_id), approver_id=str(current_user.id)).first()
        if not approval:
            return jsonify({"error": "Approval not found"}), 404
            
        if approval.status != "pending":
            return jsonify({"error": "Approval already processed"}), 400
            
        approval.update(
            status="approved",
            approved_at=datetime.utcnow(),
            comments=request.json.get("comments", "")
        )
        
        # Check if all approvals are done
        notice = Notice.objects(id=approval.notice_id).first()
        pending_approvals = Approval.objects(notice_id=approval.notice_id, status="pending").count()
        
        if pending_approvals == 0:
            # All approvals done, check if any rejections
            rejected_approvals = Approval.objects(notice_id=approval.notice_id, status="rejected").count()
            if rejected_approvals > 0:
                notice.update(approval_status="rejected", status="rejected")
            else:
                notice.update(approval_status="approved", status="published")
                
        return jsonify({"message": "Notice approved successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@approval_bp.route('/<approval_id>/reject', methods=['POST'])
@token_required
def reject_notice(current_user, approval_id):
    try:
        approval = Approval.objects(id=ObjectId(approval_id), approver_id=str(current_user.id)).first()
        if not approval:
            return jsonify({"error": "Approval not found"}), 404
            
        if approval.status != "pending":
            return jsonify({"error": "Approval already processed"}), 400
            
        reason = request.json.get("reason", "")
        if not reason:
            return jsonify({"error": "Reason is required for rejection"}), 400
            
        approval.update(
            status="rejected",
            approved_at=datetime.utcnow(),
            comments=reason
        )
        
        # Immediately reject the notice
        notice = Notice.objects(id=approval.notice_id).first()
        notice.update(
            approval_status="rejected",
            status="rejected",
            rejection_reason=reason
        )
        
        return jsonify({"message": "Notice rejected"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@approval_bp.route('/<approval_id>/sign', methods=['POST'])
@token_required
def sign_approval(current_user, approval_id):
    try:
        approval = Approval.objects(id=ObjectId(approval_id), approver_id=str(current_user.id)).first()
        if not approval:
            return jsonify({"error": "Approval not found"}), 404
            
        if approval.status != "pending":
            return jsonify({"error": "Approval must be pending to sign"}), 400
            
        signature_data = request.json.get("signature")
        if not signature_data:
            return jsonify({"error": "Signature data is required"}), 400
            
        # Save signature (implementation depends on how you store signatures)
        approval.update(
            signature=signature_data,
            status="approved",
            approved_at=datetime.utcnow(),
            comments=request.json.get("comments", "")
        )
        
        # Check if all approvals are done
        notice = Notice.objects(id=approval.notice_id).first()
        pending_approvals = Approval.objects(notice_id=approval.notice_id, status="pending").count()
        
        if pending_approvals == 0:
            # All approvals done, check if any rejections
            rejected_approvals = Approval.objects(notice_id=approval.notice_id, status="rejected").count()
            if rejected_approvals > 0:
                notice.update(approval_status="rejected", status="rejected")
            else:
                notice.update(approval_status="approved", status="published")
                
        return jsonify({
            "message": "Approval signed successfully",
            "signature_url": f"/api/approvals/{approval_id}/signature"
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500