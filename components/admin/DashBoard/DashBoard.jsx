import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaUser, 
  FaArrowLeft,
  FaChartLine,
  FaUsers,
  FaEye,
  FaDownload
} from 'react-icons/fa';
import { format } from 'date-fns';

const NoticeAnalytics = () => {
  const { noticeId } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({
    reads: [],
    unique_readers: 0,
    total_reads: 0,
    enrichedUsers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchWithAuth = async (url, options = {}) => {
    try {
      const headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      };

      let response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include'
      });

      if (response.status === 401) {
        const refreshResponse = await fetch(`${import.meta.env.VITE_AUTH_REFRESH}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!refreshResponse.ok) {
          throw new Error('Session expired. Please login again.');
        }

        const { accessToken } = await refreshResponse.json();
        localStorage.setItem('token', accessToken);

        headers.Authorization = `Bearer ${accessToken}`;
        response = await fetch(url, {
          ...options,
          headers,
          credentials: 'include'
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      return response;
    } catch (err) {
      console.error(`API call failed: ${url}`, err);
      throw err;
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_AUTH_CURRENT_USER}`);
      const userData = await response.json();
      setCurrentUser(userData);
    } catch (err) {
      console.error('Failed to fetch current user:', err);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      await fetchCurrentUser();

      // Fetch notice analytics and users in parallel
      const [analyticsRes, usersRes] = await Promise.all([
        fetchWithAuth(`${import.meta.env.VITE_NOTICES_GET}/${noticeId}/reads`),
        fetchWithAuth(`${import.meta.env.VITE_GET_USERS}`)
      ]);

      const analyticsData = await analyticsRes.json();
      const usersData = await usersRes.json();

      // Create enriched users data with read status
      const enrichedUsers = usersData.map(user => {
        const readRecord = analyticsData.reads.find(r => r.user_id === user.id);
        return {
          ...user,
          readStatus: !!readRecord,
          readAt: readRecord?.timestamp
        };
      });

      setAnalytics({
        ...analyticsData,
        enrichedUsers
      });

    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      if (err.message.includes('401') || err.message.includes('expired')) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Status', 'Read At'];
    const csvContent = [
      headers.join(','),
      ...analytics.enrichedUsers.map(user => [
        `"${user.name || 'Unknown User'}"`,
        `"${user.email || 'N/A'}"`,
        user.readStatus ? 'Read' : 'Not Read',
        user.readAt ? format(new Date(user.readAt), "yyyy-MM-dd HH:mm") : 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `notice_${noticeId}_analytics.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchData();
  }, [noticeId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-gray-700">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalReads = analytics.unique_readers || 0;
  const totalRecipients = analytics.enrichedUsers?.length || 0;
  const readPercentage = totalRecipients > 0 ? Math.round((totalReads / totalRecipients) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </button>
          
          <button
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaDownload className="mr-2" /> Export as CSV
          </button>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Notice Read Analytics</h2>
        <p className="text-gray-600 mb-6">Detailed view of how users have engaged with this notice</p>
        
        {/* Analytics Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-800">Total Recipients</h3>
                <p className="text-3xl font-bold">{totalRecipients}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg border border-green-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-green-800">Read</h3>
                <p className="text-3xl font-bold">{totalReads}</p>
                <p className="text-sm text-green-600 mt-1">
                  {readPercentage}% read rate
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full mr-4">
                <FaTimesCircle className="text-red-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-800">Not Read</h3>
                <p className="text-3xl font-bold">{Math.max(0, totalRecipients - totalReads)}</p>
                <p className="text-sm text-red-600 mt-1">
                  {100 - readPercentage}% not read
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Chart Placeholder */}
        <div className="bg-gray-50 p-4 rounded-lg mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Engagement Over Time</h3>
            <span className="text-sm text-gray-500">Last 7 days</span>
          </div>
          <div className="h-64 bg-white rounded p-4 flex items-center justify-center text-gray-400">
            <FaChartLine className="text-4xl mr-3" />
            <span>Engagement chart will be displayed here</span>
          </div>
        </div>

        {/* Users Reading Status Table */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">User Reading Status</h3>
            <span className="text-sm text-gray-500">
              Showing {analytics.enrichedUsers?.length || 0} users
            </span>
          </div>
          
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Read At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.enrichedUsers?.length > 0 ? (
                  analytics.enrichedUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaUser className="text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name || 'Unknown User'}</div>
                            {user.role && (
                              <div className="text-sm text-gray-500">{user.role}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.readStatus ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Read
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Not Read
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.readAt 
                          ? format(new Date(user.readAt), "MMM d, yyyy 'at' h:mm a") 
                          : 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      {error ? "Error loading user data" : "No users available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Error loading analytics</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <button
                      onClick={fetchData}
                      className="ml-3 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      Retry
                    </button>
                    <button
                      onClick={() => {
                        localStorage.removeItem('token');
                        navigate('/login');
                      }}
                      className="ml-3 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      Login Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeAnalytics;