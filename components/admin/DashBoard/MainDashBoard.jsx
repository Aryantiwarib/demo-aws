import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
import { 
  FaCheckCircle, FaTimesCircle, FaUser, FaArrowLeft, FaBullhorn, 
  FaChartLine, FaUsers, FaNewspaper, FaEdit, FaTrash, FaChartBar, 
  FaEye, FaFilter, FaDownload, FaSearch, FaCalendarAlt, FaCog,
  FaPlus, FaFileAlt, FaUpload, FaUserGraduate, FaUserTie, FaBell,
  FaChevronDown, FaClock, FaExclamationTriangle 
} from 'react-icons/fa';
import { format } from 'date-fns';
import { FiTrendingUp } from "react-icons/fi";
import { CSVLink } from 'react-csv';

const AllNoticesAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalNotices: 0,
    totalReads: 0,
    totalUsers: 0,
    notices: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const navigate = useNavigate();

  const filteredNotices = useMemo(() => {
    let results = analytics.notices.filter(notice => {
      const titleMatch = notice.title.toLowerCase().includes(searchTerm.toLowerCase());
      const authorMatch = notice.createdBy?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const searchMatch = titleMatch || authorMatch;
      const statusMatch = filterStatus === "all" || notice.status === filterStatus;
      return searchMatch && statusMatch;
    });

    return results.sort((a, b) => {
      if (sortBy === "latest") return new Date(b.publishAt || 0) - new Date(a.publishAt || 0);
      if (sortBy === "reads") return b.readCount - a.readCount;
      return a.title.localeCompare(b.title);
    });
  }, [analytics.notices, searchTerm, filterStatus, sortBy]);

  // CSV Data preparation
  const csvData = useMemo(() => {
    const headers = [
      { label: "Title", key: "title" },
      { label: "Author", key: "author" },
      { label: "Category", key: "category" },
      { label: "Status", key: "status" },
      { label: "Published Date", key: "publishedDate" },
      { label: "Read Count", key: "readCount" },
      { label: "Engagement Rate", key: "engagementRate" }
    ];

    const data = filteredNotices.map(notice => ({
      title: notice.title,
      author: notice.createdBy?.name || 'Unknown',
      category: notice.noticeType || 'N/A',
      status: notice.status || 'draft',
      publishedDate: notice.publishAt ? format(new Date(notice.publishAt), "MMM d, yyyy") : 'Not published',
      readCount: notice.readCount || 0,
      engagementRate: `${analytics.totalUsers > 0 ? Math.round(((notice.readCount || 0) / analytics.totalUsers) * 100) : 0}%`
    }));

    return { headers, data };
  }, [filteredNotices, analytics.totalUsers]);

  const fetchWithAuth = async (url, options = {}) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        ...options.headers
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

  const confirmDelete = (notice) => {
    setNoticeToDelete(notice);
  };

  const cancelDelete = () => {
    setNoticeToDelete(null);
  };

  const executeDelete = async () => {
    if (!noticeToDelete) return;
    
    try {
      await fetchWithAuth(`${import.meta.env.VITE_NOTICES_GET}/${noticeToDelete.id}`, {
        method: 'DELETE'
      });
      setNoticeToDelete(null);
      fetchData();
    } catch (err) {
      setError(err.message);
      setNoticeToDelete(null);
    }
  };

  const fetchNoticeReads = async (noticeId) => {
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_NOTICES_GET}/${noticeId}/reads`);
      const data = await response.json();
      return data.unique_readers || 0;
    } catch (err) {
      console.error(`Failed to fetch reads for notice ${noticeId}:`, err);
      return 0;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!localStorage.getItem('token')) {
        return;
      }

      await fetchCurrentUser();

      const [noticesRes, usersRes, analyticsRes] = await Promise.all([
        fetchWithAuth(`${import.meta.env.VITE_NOTICES_GET}`),
        fetchWithAuth(`${import.meta.env.VITE_GET_USERS_COUNT}`).catch(() => ({ json: () => ({ count: 0 }) })),
        fetchWithAuth(`${import.meta.env.VITE_NOTICES_ANALYTICS}`).catch(() => ({ json: () => ({ totalNotices: 0, totalReads: 0 }) }))
      ]);

      const noticesData = await noticesRes.json();
      const usersData = await usersRes.json();
      const analyticsData = await analyticsRes.json();

      const noticesWithReads = await Promise.all(
        noticesData.map(async notice => {
          const readCount = await fetchNoticeReads(notice.id);
          return {
            ...notice,
            readCount
          };
        })
      );

      const totalReads = noticesWithReads.reduce((sum, notice) => sum + notice.readCount, 0);

      setAnalytics({
        totalNotices: noticesData.length,
        totalReads,
        totalUsers: usersData.count || 0,
        notices: noticesWithReads
      });

    } catch (err) {
      console.error('Data fetch error:', err);
      setError(err.message);

      if (err.message.includes('401') || err.message.includes('expired')) {
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      draft: 'bg-amber-50 text-amber-700 border-amber-200',
      default: 'bg-slate-50 text-slate-700 border-slate-200'
    };
    return styles[status] || styles.default;
  };

  const getCategoryBadge = (category) => {
    const styles = {
      Academic: 'bg-blue-50 text-blue-700 border-blue-200',
      Fees: 'bg-violet-50 text-violet-700 border-violet-200',
      Placement: 'bg-teal-50 text-teal-700 border-teal-200',
      default: 'bg-slate-50 text-slate-700 border-slate-200'
    };
    return styles[category] || styles.default;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not published';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateReadRate = () => {
    if (analytics.totalNotices === 0 || analytics.totalUsers === 0) return 0;
    return Math.round((analytics.totalReads / (analytics.totalNotices * analytics.totalUsers)) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600"></div>
              <span className="ml-3 text-slate-600">Loading analytics...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Delete Confirmation Modal */}
      {noticeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <FaExclamationTriangle className="text-red-500 text-xl mr-3" />
              <h3 className="text-lg font-semibold text-slate-900">Delete Notice</h3>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete the notice "{noticeToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <FaTrash className="mr-2" />
                Delete Notice
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2.5 hover:bg-white rounded-xl border border-slate-200 transition-all duration-200 hover:shadow-sm"
              >
                <FaArrowLeft className="text-slate-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Notice Analytics</h1>
                <p className="text-slate-600 mt-1">Monitor and analyze notice performance</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <CSVLink
                data={csvData.data}
                headers={csvData.headers}
                filename="notices_analytics.csv"
                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
              >
                <FaDownload className="text-sm" />
                <span>Export Data</span>
              </CSVLink>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Notices</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{analytics.totalNotices}</p>
                  <div className="flex items-center mt-3 text-sm">
                    <FiTrendingUp className="text-emerald-500 mr-1" />
                    <span className="text-emerald-600 font-medium">
                      {analytics.totalNotices > 0 ? '+12% from last month' : 'No data yet'}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <FaNewspaper className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Reads</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{analytics.totalReads.toLocaleString()}</p>
                  <div className="flex items-center mt-3 text-sm">
                    <FiTrendingUp className="text-emerald-500 mr-1" />
                    <span className="text-emerald-600 font-medium">
                      {analytics.totalReads > 0 ? '+8% from last week' : 'No reads yet'}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl">
                  <FaEye className="text-emerald-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Users</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{analytics.totalUsers}</p>
                  <div className="flex items-center mt-3 text-sm">
                    <FaClock className="text-amber-500 mr-1" />
                    <span className="text-amber-600 font-medium">
                      {analytics.totalUsers > 0 ? '2 new today' : 'No users yet'}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-violet-50 rounded-xl">
                  <FaUsers className="text-violet-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Engagement Rate</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{calculateReadRate()}%</p>
                  <div className="flex items-center mt-3 text-sm">
                    <FiTrendingUp className="text-emerald-500 mr-1" />
                    <span className="text-emerald-600 font-medium">
                      {analytics.totalReads > 0 ? 'Above average' : 'No data'}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-teal-50 rounded-xl">
                  <FaChartLine className="text-teal-600 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search notices or authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full sm:w-80 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-slate-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm transition-colors"
              >
                <option value="latest">Latest</option>
                <option value="reads">Most Viewed</option>
                <option value="title">Title</option>
              </select>
              <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {filteredNotices.length} of {analytics.totalNotices}
              </span>
            </div>
          </div>
        </div>

        {/* Notices Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {error && (
            <div className="p-4 bg-red-50 border-b border-red-200">
              <div className="flex items-center">
                <FaExclamationTriangle className="text-red-500 mr-2" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Notice</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Published</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Engagement</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredNotices.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="p-4 bg-slate-100 rounded-full">
                          <FaNewspaper className="text-slate-400 text-3xl" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-slate-900 font-medium text-lg">
                            {error ? "Failed to load notices" : searchTerm || filterStatus !== "all" ? "No notices match your filters" : "No notices available"}
                          </p>
                          <p className="text-slate-600 text-sm">
                            {!error && !searchTerm && filterStatus === "all" ? "Create your first notice to get started" : "Try adjusting your search or filters"}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredNotices.map((notice) => (
                    <tr key={notice.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2.5 bg-blue-50 rounded-lg flex-shrink-0">
                            <FaBullhorn className="text-blue-600 text-sm" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-slate-900 text-sm mb-1">{notice.title}</h3>
                            <div className="text-slate-600 text-xs leading-relaxed">
                              {notice.content ? parse(notice.content.substring(0, 80) + '...') : 'No content'}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <FaUser className="text-white text-xs" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-900">
                              {notice.createdBy?.name || 'Unknown Author'}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {notice.createdBy?.email || 'No email'}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getCategoryBadge(notice.noticeType)}`}>
                          {notice.noticeType || 'NON'}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadge(notice.status)}`}>
                          {notice.status || 'draft'}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900">
                          {formatDate(notice.publishAt)}
                        </div>
                        {notice.publishAt && (
                          <div className="text-xs text-slate-500 mt-1">
                            {formatTime(notice.publishAt)}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-sm font-semibold text-slate-900">
                            {notice.readCount || 0}
                          </div>
                          <div className="flex-1 max-w-20">
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-500" 
                                style={{ 
                                  width: `${analytics.totalUsers > 0 ? ((notice.readCount || 0) / analytics.totalUsers) * 100 : 0}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
                            {analytics.totalUsers > 0 ? Math.round(((notice.readCount || 0) / analytics.totalUsers) * 100) : 0}%
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => navigate(`/notices/${notice.id}/read-analytics`)}
                            title="View Details"
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                          >
                            <FaEye className="text-slate-600 group-hover:text-blue-600 text-sm" />
                          </button>
                          <button 
                            onClick={() => navigate(`/notices/${notice.id}/analytics`)}
                            title="View Analytics"
                            className="p-2 hover:bg-emerald-50 rounded-lg transition-colors group"
                          >
                            <FaChartBar className="text-slate-600 group-hover:text-emerald-600 text-sm" />
                          </button>
                          {(currentUser?.role === 'academic' || currentUser?.id === notice.createdBy?.id) && (
                            <>
                              <button 
                                onClick={() => navigate(`/notices/edit/${notice.id}`)}
                                title="Edit Notice"
                                className="p-2 hover:bg-amber-50 rounded-lg transition-colors group"
                              >
                                <FaEdit className="text-slate-600 group-hover:text-amber-600 text-sm" />
                              </button>
                              <button 
                                onClick={() => confirmDelete(notice)}
                                title="Delete Notice"
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                              >
                                <FaTrash className="text-slate-600 group-hover:text-red-600 text-sm" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllNoticesAnalytics;