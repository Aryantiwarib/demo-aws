from mongoengine import connect, Document, EmbeddedDocument, EmbeddedDocumentField, StringField, DictField, ListField, DateTimeField, EmailField, IntField, BooleanField, ReferenceField

import datetime

class Approval(Document):
    approver_id = StringField(required=True)
    approver_name = StringField(required=True)
    approver_role = StringField(required=True)
    status = StringField(choices=["pending", "approved", "rejected"], default="pending")
    comments = StringField()
    approved_at = DateTimeField()
    signature_image = StringField()  # Store path to signature image
    signed_at = DateTimeField()
    meta = {'collection': 'approvals'}

class Notice(Document):
    title = StringField(required=True)
    subject = StringField()
    content = StringField(required=True)
    notice_type = StringField()
    departments = ListField(StringField(), default=[])
    program_course = StringField()
    specialization = StringField(default="core")
    year = StringField()
    section = StringField()
    recipient_emails = ListField(StringField(), default=[])
    priority = StringField(choices=["Normal", "Urgent", "Highly Urgent"], default="Normal")
    status = StringField(default="draft", choices=["draft", "published", "scheduled"])
    send_options = DictField(default={"email": False, "web": True})
    schedule_date = BooleanField(default=False)
    schedule_time = BooleanField(default=False)
    date = StringField()
    time = StringField()
    from_field = StringField()  # Use from_field to avoid Python's 'from' keyword
    publish_at = DateTimeField()
    created_at = DateTimeField(default=datetime.datetime.now)
    updated_at = DateTimeField(default=datetime.datetime.now)
    created_by = StringField(required=True)
    attachments = ListField(StringField(), default=[])
    reads = ListField(DictField(), default=[])
    read_count = IntField(default=0)
    requires_approval = BooleanField(default=False)
    approval_workflow = ListField(ReferenceField(Approval))
    current_approval_level = IntField(default=0)
    approval_status = StringField(
        choices=["not_required", "pending", "approved", "rejected"], 
        default="not_required"
    )
    rejection_reason = StringField()
    
    meta = {
        'collection': 'notices',
        'indexes': [
            '-created_at',
            'notice_type',
            'status',
            'departments',
            'year',
            'reads.user_id',
            'priority',
            'section',
            'program_course',
        ]
    }