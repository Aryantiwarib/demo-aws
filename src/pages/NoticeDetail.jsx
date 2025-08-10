import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FaArrowLeft, FaBookOpen, FaPaperclip } from 'react-icons/fa';
import parse from 'html-react-parser';

const NoticeDetailPage = () => {
  const { noticeId } = useParams();
  const [notice, setNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        // First mark as read
        await fetch(`${import.meta.env.VITE_NOTICES_GET}/${noticeId}/read`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        // Then fetch the notice data
        const response = await fetch(`${import.meta.env.VITE_NOTICES_GET}/${noticeId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch notice');
        }

        const data = await response.json();
        setNotice(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotice();
  }, [noticeId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link 
        to="/notices" 
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back to Notices
      </Link>
      
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                <FaBookOpen className="inline mr-2 text-blue-500" />
                {notice.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="capitalize">{notice.noticeType || 'Notice'}</span>
                <span>•</span>
                <span>From: {notice.from || 'Administration'}</span>
                <span>•</span>
                <span>{format(new Date(notice.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              notice.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
              notice.priority === 'Highly Urgent' ? 'bg-orange-100 text-orange-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {notice.priority || 'Normal'}
            </span>
          </div>
          
          {notice.subject && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium text-gray-700">Subject: {notice.subject}</h3>
            </div>
          )}
          
          {/* RTE Content - Using html-react-parser */}
          <div className="prose max-w-none mt-6 rte-content">
            {parse(notice.content || '')}
          </div>
          
          {/* Attachments */}
          {notice.attachments?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Attachments</h3>
              <ul className="space-y-2">
                {notice.attachments.map((file, index) => (
                  <li key={index} className="flex items-center">
                    <FaPaperclip className="text-gray-400 mr-2" />
                    <a 
                      href={`${import.meta.env.VITE_UPLOADS_URL}/${file.path || file.name}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {file.originalname || file.name}
                    </a>
                    <span className="text-xs text-gray-500 ml-2">
                      ({Math.round((file.size || 0) / 1024)} KB)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Departments and Recipients */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Target Departments</h3>
                <div className="flex flex-wrap gap-2">
                  {notice.departments?.length > 0 ? (
                    notice.departments.map((dept, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                        {dept}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">All departments</span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Target Audience</h3>
                <div className="text-sm text-gray-600">
                  {notice.programCourse && (
                    <p>{notice.programCourse} {notice.year && `- Year ${notice.year}`} {notice.section && `- Section ${notice.section}`}</p>
                  )}
                  {notice.specialization && notice.specialization !== 'core' && (
                    <p>Specialization: {notice.specialization}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              This notice has been read by {notice.readCount || 0} {notice.readCount === 1 ? 'person' : 'people'}
            </p>
            <p className="text-sm text-gray-500">
              Published on: {format(new Date(notice.createdAt), "MMM d, yyyy")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetailPage;