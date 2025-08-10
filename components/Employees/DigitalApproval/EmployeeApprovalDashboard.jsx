import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaClock, FaCheck, FaTimes, FaSignature } from 'react-icons/fa';

const EmployeeApprovalDashboard = () => {
  const [approvals, setApprovals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_GET_APPROVALS_BASE}/my`, 
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setApprovals(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch approvals');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovals();
  }, []);

  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.notice_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && approval.status === filter;
  });

  const handleAction = async (approvalId, action) => {
    try {
      setIsLoading(true);
      const endpoint = action === 'approve' ? 'approve' : 'reject';
      await axios.post(
        `${import.meta.env.VITE_GET_APPROVALS_BASE}/${approvalId}/${endpoint}`,
        action === 'reject' ? { reason: "Rejected by approver" } : {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      // Update local state
      setApprovals(approvals.map(a => 
        a.id === approvalId ? { ...a, status: action } : a
      ));
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${action} notice`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Approval Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
                <FaSearch className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search notices..."
                  className="w-full outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredApprovals.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No approvals found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApprovals.map(approval => (
              <div key={approval.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{approval.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {approval.notice_type} • {new Date(approval.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      approval.status === 'approved' ? 'bg-green-100 text-green-800' :
                      approval.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {approval.status}
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="text-gray-700">{approval.content.substring(0, 200)}...</p>
                  </div>

                  {approval.status === 'pending' && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleAction(approval.id, 'approve')}
                          disabled={isLoading}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                        >
                          <FaCheck className="mr-2" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(approval.id, 'reject')}
                          disabled={isLoading}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
                        >
                          <FaTimes className="mr-2" />
                          Reject
                        </button>
                        <a
                          href={`http://localhost:5001/approvals/${approval.id}/sign`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                        >
                          <FaSignature className="mr-2" />
                          Sign & Approve
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeApprovalDashboard;