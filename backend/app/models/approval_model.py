from mongoengine import Document, StringField, ReferenceField, DateTimeField, ListField, DictField
from datetime import datetime

class Approval(Document):
    notice_id = ReferenceField('Notice', required=True)
    approver_id = ReferenceField('Employee', required=True)
    status = StringField(required=True, choices=['pending', 'approved', 'rejected'], default='pending')
    comments = StringField()
    signature = StringField()  # Stores URL or base64 of signature
    created_at = DateTimeField(default=datetime.utcnow)
    approved_at = DateTimeField()
    
    meta = {
        'collection': 'approvals',
        'indexes': [
            'notice_id',
            'approver_id',
            'status',
            {'fields': ['notice_id', 'approver_id'], 'unique': True}
        ]
    }
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "notice_id": str(self.notice_id.id),
            "approver_id": str(self.approver_id.id),
            "approver_name": self.approver_id.name,
            "approver_role": self.approver_id.role,
            "status": self.status,
            "comments": self.comments,
            "signature": self.signature,
            "created_at": self.created_at.isoformat(),
            "approved_at": self.approved_at.isoformat() if self.approved_at else None
        }