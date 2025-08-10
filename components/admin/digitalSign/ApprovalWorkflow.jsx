// components/ApprovalWorkflow.js
import React, { useState } from 'react';
import axios from 'axios';
import ApprovalStatusBadge from './ApprovalStatusBadge';
import SignatureApproval from './SignatureApproval';

export default function ApprovalWorkflow({ notice, currentUser, onUpdate }) {
  const [comments, setComments] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);

// Change these endpoints:
const handleApprove = async () => {
  try {
    setIsLoading(true);
    await axios.post(`http://localhost:5001/api/approvals/${notice.currentApprovalId}/approve`, {
      comments
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    onUpdate();
  } catch (err) {
    setError(err.response?.data?.error || 'Failed to approve notice');
  } finally {
    setIsLoading(false);
  }
};

const handleReject = async () => {
  try {
    setIsLoading(true);
    await axios.post(`/api/approvals/${notice.currentApprovalId}/reject`, {
      reason: comments
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    onUpdate();
  } catch (err) {
    setError(err.response?.data?.error || 'Failed to reject notice');
  } finally {
    setIsLoading(false);
  }
};

  const canApprove = notice.approvalStatus === 'pending' && 
    notice.currentApprovalId === notice.approvalWorkflow?.[notice.currentApprovalLevel]?.id;

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Approval Workflow</h3>
      
      <div className="space-y-4">
        <div>
          <ApprovalStatusBadge status={notice.approvalStatus} />
        </div>
        
        {notice.approvalWorkflow && notice.approvalWorkflow.length > 0 && (
          <div className="space-y-2">
            {notice.approvalWorkflow.map((approval, index) => (
              <div key={approval.id} className={`p-3 border rounded-lg ${
                approval.status === 'approved' ? 'border-green-200 bg-green-50' :
                approval.status === 'rejected' ? 'border-red-200 bg-red-50' :
                index === notice.currentApprovalLevel ? 'border-blue-200 bg-blue-50' :
                'border-gray-200'
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{approval.approverName}</p>
                    <p className="text-sm text-gray-600">{approval.approverRole}</p>
                  </div>
                  <div className="text-sm">
                    {approval.status === 'approved' && (
                      <span className="text-green-600">Approved on {new Date(approval.approvedAt).toLocaleDateString()}</span>
                    )}
                    {approval.status === 'rejected' && (
                      <span className="text-red-600">Rejected on {new Date(approval.approvedAt).toLocaleDateString()}</span>
                    )}
                    {approval.status === 'pending' && index === notice.currentApprovalLevel && (
                      <span className="text-blue-600">Pending your approval</span>
                    )}
                    {approval.status === 'pending' && index > notice.currentApprovalLevel && (
                      <span className="text-gray-500">Pending previous approval</span>
                    )}
                  </div>
                </div>
                {approval.comments && (
                  <div className="mt-2 text-sm text-gray-700 bg-white p-2 rounded">
                    <p className="font-medium">Comments:</p>
                    <p>{approval.comments}</p>
                  </div>
                )}
                {approval.signature && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">Signature:</p>
                    <img 
                      src={approval.signature} 
                      alt="Approver signature" 
                      className="h-12 mt-1 border border-gray-200"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {canApprove && (
          <div className="mt-6">
            <h4 className="text-md font-medium mb-2">Your Approval</h4>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 mb-3"
              rows="3"
              placeholder="Add comments (optional)"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
            <div className="flex space-x-3">
              <button
                onClick={handleApprove}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? 'Approving...' : 'Approve'}
              </button>
              <button
                onClick={handleReject}
                disabled={isLoading || !comments}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? 'Rejecting...' : 'Reject'}
              </button>
              <button
                onClick={() => setShowSignatureDialog(true)}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Signing...' : 'Sign & Approve'}
              </button>
            </div>
          </div>
        )}
      </div>

      {showSignatureDialog && (
        <SignatureApproval 
          approvalId={notice.currentApprovalId}
          onSigned={() => {
            setShowSignatureDialog(false);
            onUpdate();
          }}
          onCancel={() => setShowSignatureDialog(false)}
        />
      )}
    </div>
  );
}