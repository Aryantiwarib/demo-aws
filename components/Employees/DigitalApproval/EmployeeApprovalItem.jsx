// components/EmployeeApprovalItem.js
import React, { useState } from 'react';
import axios from 'axios';
import ApprovalStatusBadge from '../../admin/digitalSign/ApprovalStatusBadge';
import SignatureApproval from '../../admin/digitalSign/SignatureApproval.jsx';

const EmployeeApprovalItem = ({ approval }) => {
  const [comments, setComments] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);

  const handleAction = async (action) => {
    if (action === 'reject' && !comments) {
      return setError('Please provide a reason for rejection');
    }

    try {
      setIsLoading(true);
      const endpoint = action === 'approve' ? 'approve' : 'reject';
      const data = action === 'reject' ? { reason: comments } : {};
      
      await axios.post(`http://localhost:5001/api/approvals/${approval._id}/${endpoint}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      window.location.reload(); // Refresh to update status
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${action} notice`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{approval.notice.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {approval.notice.noticeType} • Requested on {new Date(approval.createdAt).toLocaleDateString()}
            </p>
          </div>
          <ApprovalStatusBadge status={approval.status} />
        </div>

        <div className="mt-4">
          <h3 className="font-medium text-gray-700 mb-2">Notice Content:</h3>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: approval.notice.content }} />
        </div>

        {approval.notice.attachments?.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium text-gray-700 mb-2">Attachments:</h3>
            <div className="space-y-2">
              {approval.notice.attachments.map((file, index) => (
                <a 
                  key={index} 
                  href={`http://localhost:5001/api/notices/${approval.notice._id}/attachments/${file}`}
                  className="flex items-center text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {file}
                </a>
              ))}
            </div>
          </div>
        )}

        {approval.status === 'pending' && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comments (optional)</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3"
                  rows="3"
                  placeholder="Add your comments..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAction('approve')}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                >
                  <FaCheck className="mr-2" />
                  {isLoading ? 'Approving...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleAction('reject')}
                  disabled={isLoading || !comments}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
                >
                  <FaTimes className="mr-2" />
                  {isLoading ? 'Rejecting...' : 'Reject'}
                </button>
                <button
                  onClick={() => setShowSignatureDialog(true)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  <FaSignature className="mr-2" />
                  Sign & Approve
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showSignatureDialog && (
        <SignatureApproval 
          approvalId={approval._id}
          onSigned={() => window.location.reload()}
          onCancel={() => setShowSignatureDialog(false)}
        />
      )}
    </div>
  );
};

export default EmployeeApprovalItem;