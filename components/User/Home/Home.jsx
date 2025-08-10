import React, { useState, useEffect } from 'react';
import { 
  Bell, AlertTriangle, Info, CheckCircle, Filter, Search, Brain, 
  Calendar, User, Star, ArrowRight, Clock, Tag, BarChart3, Eye, 
  FileText, Shield, Users, Settings, RefreshCw, Loader2, ChevronDown,
  ChevronUp, MessageSquare, Bookmark, Download, Mail, Share2, MoreHorizontal,
  GraduationCap, BookOpen, ClipboardList, Clock3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';


const StudentNoticePortal = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [aiInsights, setAiInsights] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedNotice, setExpandedNotice] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_GET_STUDENT_DETAILS}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setStudentInfo(data);
    } catch (err) {
      console.error('Error fetching student data:', err);
    }
  };

const fetchNotices = async () => {
  try {
    setRefreshing(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('No authentication token found. Please login.');
      setLoading(false);
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_GET_MY_NOTICES}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch notices');
    }

    const notices = await response.json();
    
    const transformedNotices = notices.map(notice => ({
      id: notice.id,
      title: notice.title,
      content: notice.content,
      priority: notice.priority.toLowerCase(),
      type: notice.noticeType || 'general',
      date: new Date(notice.createdAt).toLocaleDateString('en-CA'),
      time: new Date(notice.createdAt).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      department: notice.departments ? notice.departments.join(', ') : 'General',
      read: false,
      reference: `${notice.noticeType?.toUpperCase() || 'GEN'}-${notice.id.slice(-6)}`,
      createdBy: notice.createdBy?.name || 'University',
      status: notice.status,
      attachments: notice.attachments || [],
      targetInfo: notice.programCourse ? 
        `${notice.programCourse} ${notice.year || ''} ${notice.section || ''}`.trim() : 
        'All Students'
    }));

    setNotices(transformedNotices);
    setError(null);
  } catch (err) {
    console.error('Error fetching notices:', err);
    setError(err.message || 'Failed to fetch notices');
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  useEffect(() => {
    fetchStudentData();
    fetchNotices();
  }, []);

  const handleRefresh = () => {
    fetchNotices();
  };

  const toggleNoticeExpand = (id) => {
    setExpandedNotice(expandedNotice === id ? null : id);
  };

  const priorityConfig = {
    critical: { 
      color: "bg-red-600", 
      border: "border-red-200", 
      text: "text-red-600",
      bg: "bg-red-50",
      icon: <AlertTriangle className="w-4 h-4" />
    },
    high: { 
      color: "bg-orange-500", 
      border: "border-orange-200", 
      text: "text-orange-600",
      bg: "bg-orange-50",
      icon: <AlertTriangle className="w-4 h-4" />
    },
    medium: { 
      color: "bg-blue-500", 
      border: "border-blue-200", 
      text: "text-blue-600",
      bg: "bg-blue-50",
      icon: <Info className="w-4 h-4" />
    },
    low: { 
      color: "bg-green-500", 
      border: "border-green-200", 
      text: "text-green-600",
      bg: "bg-green-50",
      icon: <CheckCircle className="w-4 h-4" />
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'academic': return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'exam': return <ClipboardList className="w-5 h-5 text-purple-600" />;
      case 'fees': return <Tag className="w-5 h-5 text-green-600" />;
      case 'placement': return <User className="w-5 h-5 text-yellow-600" />;
      case 'event': return <Calendar className="w-5 h-5 text-red-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || notice.priority === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    { 
      label: "Total Notices", 
      value: notices.length, 
      icon: Bell, 
      color: "text-blue-600",
      bg: "bg-blue-50",
      change: "+12% from last week"
    },
    { 
      label: "Unread", 
      value: notices.filter(n => !n.read).length, 
      icon: Eye, 
      color: "text-purple-600",
      bg: "bg-purple-50",
      change: "Pending review"
    },
    { 
      label: "Important", 
      value: notices.filter(n => n.priority === 'high' || n.priority === 'critical').length, 
      icon: AlertTriangle, 
      color: "text-red-600",
      bg: "bg-red-50",
      change: "Needs attention"
    },
    { 
      label: "Upcoming Deadlines", 
      value: notices.filter(n => n.type === 'exam' || n.type === 'fees').length, 
      icon: Clock3, 
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      change: "Check deadlines"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your notices...</p>
          <p className="text-gray-400 text-sm mt-2">Preparing your student dashboard</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Login Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-10">
        <button 
          onClick={handleRefresh}
          className="p-4 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 transition-all transform hover:scale-105"
          title="Refresh Notices"
        >
          <RefreshCw className={`w-6 h-6 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section - Student Version */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl shadow-2xl text-white p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-20">
            <svg width="300" height="300" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFFFFF" d="M45.6,-45.6C58.6,-32.6,68.1,-16.3,68.3,0.2C68.5,16.7,59.4,33.4,46.4,46.4C33.4,59.4,16.7,68.7,0.7,68C-15.3,67.3,-30.6,56.6,-45.6,43.6C-60.6,30.6,-75.3,15.3,-76.5,-1.3C-77.7,-17.9,-65.4,-35.8,-50.4,-48.8C-35.4,-61.8,-17.7,-69.9,-0.1,-69.8C17.5,-69.7,35,-61.4,45.6,-45.6Z" transform="translate(100 100)" />
            </svg>
          </div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start justify-between">
              <div className="flex items-center space-x-6 mb-6 md:mb-0">
                <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {studentInfo ? `Welcome, ${studentInfo.name}` : 'Student Notice Portal'}
                  </h1>
                  <p className="text-blue-100 text-lg">
                    {studentInfo ? `${studentInfo.course} - ${studentInfo.branch}` : 'Your academic notice center'}
                  </p>
                  {studentInfo && (
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span className="bg-white/10 px-3 py-1 rounded-full">
                        Roll No: {studentInfo.univ_roll_no}
                      </span>
                      <span className="bg-white/10 px-3 py-1 rounded-full">
                        Year: {studentInfo.year}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-blue-100 text-sm mb-1">
                  {currentTime.toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-3xl font-bold mb-1">
                  {currentTime.toLocaleTimeString('en-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </div>
                <div className="flex items-center justify-between text-blue-100 text-sm">
                  <span>India Standard Time</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Live</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <BookOpen className="w-6 h-6 text-blue-300" />
                    <h3 className="text-lg font-semibold">Academic Updates</h3>
                  </div>
                  <p className="text-blue-100">
                    Important notices about classes, schedules, and academic requirements.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <ClipboardList className="w-6 h-6 text-purple-300" />
                    <h3 className="text-lg font-semibold">Exam Information</h3>
                  </div>
                  <p className="text-blue-100">
                    Exam schedules, results, and important examination notices.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <User className="w-6 h-6 text-yellow-300" />
                    <h3 className="text-lg font-semibold">Placement Updates</h3>
                  </div>
                  <p className="text-blue-100">
                    Company visits, job opportunities, and career guidance notices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Student Version */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.bg} rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {stat.change}
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search notices by title, content, department..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">All Notices</option>
                  <option value="academic">Academic</option>
                  <option value="exam">Exam</option>
                  <option value="fees">Fees</option>
                  <option value="placement">Placement</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg shadow-sm transition-all ${refreshing ? 'bg-gray-100 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notices Grid */}
        {/* Notices Grid */}
{filteredNotices.length === 0 ? (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-900 mb-2">No notices found</h3>
    <p className="text-gray-600 mb-6">
      {searchTerm || selectedFilter !== 'all' 
        ? 'Try adjusting your search or filter criteria.' 
        : 'The notice board is currently empty.'}
    </p>
    {(searchTerm || selectedFilter !== 'all') && (
      <button
        onClick={() => {
          setSearchTerm('');
          setSelectedFilter('all');
        }}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
      >
        Reset Filters
      </button>
    )}
  </div>
) : (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    {filteredNotices.map((notice) => (
      <div
        key={notice.id}
        className={`bg-white rounded-xl shadow-sm border-l-4 ${priorityConfig[notice.priority]?.border || 'border-gray-200'} hover:shadow-lg transition-all duration-200 ${!notice.read ? 'ring-2 ring-blue-100' : ''}`}
      >
        <div className="p-6 relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${priorityConfig[notice.priority]?.bg}`}>
                {getIcon(notice.type)}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityConfig[notice.priority]?.bg} ${priorityConfig[notice.priority]?.text}`}>
                  {notice.priority.toUpperCase()}
                </span>
                <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {notice.department}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">{notice.time}</div>
              <div className="text-sm text-gray-900 font-medium">{notice.date}</div>
            </div>
          </div>

          {/* Content */}
          <div 
            className="cursor-pointer"
            onClick={() => toggleNoticeExpand(notice.id)}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
              {notice.title}
            </h3>
            <div className={`text-gray-600 mb-4 ${expandedNotice === notice.id ? '' : 'line-clamp-3'}`}>
              {parse(notice.content)}
            </div>
          </div>

          {/* Expanded Content */}
          {expandedNotice === notice.id && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              {/* Attachments */}
              {notice.attachments?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments</h4>
                  <div className="flex flex-wrap gap-2">
                    {notice.attachments.map((file, index) => (
                      <a 
                        key={index}
                        href={`${import.meta.env.VITE_UPLOADS_URL}/${file.path || file.name}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-700 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span>{file.originalname || file.name}</span>
                        <span className="text-xs text-gray-500">({Math.round((file.size || 0) / 1024)} KB)</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Reference ID</p>
                  <p className="font-medium">{notice.reference}</p>
                </div>
                <div>
                  <p className="text-gray-500">Published By</p>
                  <p className="font-medium">{notice.createdBy || 'University'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Notice Type</p>
                  <p className="font-medium capitalize">{notice.type}</p>
                </div>
                <div>
                  <p className="text-gray-500">Target Group</p>
                  <p className="font-medium">{notice.targetInfo}</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                <Bookmark className="w-4 h-4" />
                <span className="text-xs">Save</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-xs">Download</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate(`/notices/${notice.id}`)}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center font-medium"
              >
                <span>View Complete</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
              <button 
                onClick={() => toggleNoticeExpand(notice.id)}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
              >
                {expandedNotice === notice.id ? (
                  <>
                    <span>Show Less</span>
                    <ChevronUp className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    <span>Read More</span>
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Unread indicator */}
          {!notice.read && (
            <div className="absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>
    ))}
  </div>
)}

        {/* Upcoming Deadlines Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Upcoming Deadlines</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800">View Calendar</button>
          </div>
          
          <div className="space-y-4">
            {notices
              .filter(n => n.type === 'exam' || n.type === 'fees')
              .slice(0, 3)
              .map(notice => (
                <div key={notice.id} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`p-2 rounded-lg ${priorityConfig[notice.priority]?.bg} mt-1`}>
                    {getIcon(notice.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{notice.title}</h4>
                    <p className="text-sm text-gray-500">
                      Due: {notice.date} • {notice.department}
                    </p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Details
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentNoticePortal;