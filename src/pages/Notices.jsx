import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FaBookOpen, FaSearch, FaFilter, FaChevronDown, FaChevronUp, FaClock, FaTag, FaUsers } from 'react-icons/fa';
import parse from 'html-react-parser';
import { motion, AnimatePresence } from 'framer-motion';

const NoticeListPage = () => {
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [expandedNoticeId, setExpandedNoticeId] = useState(null);

  const fetchNotices = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${import.meta.env.VITE_NOTICES_GET}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        throw new Error('Failed to fetch notices');
      }

      const data = await response.json();
      
      const transformedNotices = data.map(notice => ({
        ...notice,
        target: [notice.departments, notice.year, notice.section].filter(Boolean).join(' • ') || 'All Students',
        formattedDate: format(new Date(notice.createdAt), "MMM d, yyyy"),
        formattedTime: format(new Date(notice.createdAt), "h:mm a")
      }));
      
      setNotices(transformedNotices);
      setFilteredNotices(transformedNotices);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  useEffect(() => {
    let results = notices;

    if (filter !== 'all') {
      results = results.filter(notice => 
        notice.notice_type?.toLowerCase() === filter.toLowerCase()
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(notice => 
        notice.title.toLowerCase().includes(term) || 
        notice.content.toLowerCase().includes(term) ||
        notice.target.toLowerCase().includes(term)
      );
    }

    setFilteredNotices(results);
  }, [searchTerm, filter, notices]);

  const toggleExpandNotice = (id) => {
    setExpandedNoticeId(expandedNoticeId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading notices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading notices</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchNotices}
                  className="text-sm font-medium text-red-700 hover:text-red-600"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1 flex items-center">
            <FaBookOpen className="inline mr-3 text-blue-500" />
            Notice Board
          </h1>
          <p className="text-gray-600">Stay updated with the latest announcements</p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search notices..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full bg-gray-50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative flex-1 min-w-[160px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-gray-50 w-full transition-all"
            >
              <option value="all">All Types</option>
              <option value="academic">Academic</option>
              <option value="event">Event</option>
              <option value="general">General</option>
              <option value="exam">Exam</option>
              <option value="holiday">Holiday</option>
            </select>
          </div>
        </div>
      </div>

      {filteredNotices.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border p-8 text-center"
        >
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaBookOpen className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No notices found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchTerm || filter !== 'all' 
              ? "No notices match your search criteria. Try adjusting your filters." 
              : "There are no notices available at this time. Check back later."}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredNotices.map((notice) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <NoticeCard 
                  notice={notice}
                  isExpanded={expandedNoticeId === notice.id}
                  onToggleExpand={() => toggleExpandNotice(notice.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

const NoticeCard = ({ notice, isExpanded, onToggleExpand }) => {
  const priorityColors = {
    high: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
    medium: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
    low: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' }
  };

  const typeColors = {
    academic: 'bg-blue-100 text-blue-800',
    event: 'bg-purple-100 text-purple-800',
    general: 'bg-gray-100 text-gray-800',
    exam: 'bg-red-100 text-red-800',
    holiday: 'bg-green-100 text-green-800'
  };

  const statusColors = {
    published: 'bg-blue-100 text-blue-800',
    draft: 'bg-gray-100 text-gray-800',
    archived: 'bg-yellow-100 text-yellow-800'
  };

  const priority = notice.priority || 'medium';
  const noticeType = notice.notice_type || 'general';
  const status = notice.status || 'draft';

  return (
    <div 
      className={`border rounded-xl overflow-hidden transition-all duration-200 ${isExpanded ? 'ring-2 ring-blue-500 shadow-md' : 'shadow-sm'} ${
        priorityColors[priority]?.border || 'border-gray-200'
      }`}
    >
      <div 
        className={`p-5 cursor-pointer transition-colors ${isExpanded ? priorityColors[priority]?.bg : 'bg-white'} hover:bg-gray-50`}
        onClick={onToggleExpand}
      >
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[noticeType]}`}>
                {noticeType.charAt(0).toUpperCase() + noticeType.slice(1)}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[priority]?.bg} ${priorityColors[priority]?.text}`}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
              </span>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-1.5">
              {notice.title}
            </h2>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mt-2">
              <span className="flex items-center">
                <FaUsers className="mr-1.5 opacity-70" />
                {notice.target}
              </span>
              <span className="flex items-center">
                <FaClock className="mr-1.5 opacity-70" />
                {notice.formattedDate} at {notice.formattedTime}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-end sm:justify-start">
            <button 
              className="text-gray-500 hover:text-gray-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
            >
              {isExpanded ? (
                <FaChevronUp className="text-lg" />
              ) : (
                <FaChevronDown className="text-lg" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <div className="prose max-w-none text-gray-700 whitespace-pre-line border-t pt-4 mt-2">
                {parse(notice.content)}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex flex-wrap gap-3">
                  <span className="text-sm text-gray-600 flex items-center">
                    <span className="font-medium mr-1.5">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </span>
                  
                  {notice.recipient_emails?.length > 0 && (
                    <span className="text-sm text-gray-600">
                      <span className="font-medium">Recipients:</span> {notice.recipient_emails.length}
                    </span>
                  )}
                  
                  {notice.author && (
                    <span className="text-sm text-gray-600">
                      <span className="font-medium">Posted by:</span> {notice.author}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {notice.attachments?.length > 0 && (
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                      View Attachments ({notice.attachments.length})
                    </button>
                  )}
                  <button 
                    className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleExpand();
                    }}
                  >
                    Collapse
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NoticeListPage;