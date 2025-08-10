import React, { useState, useEffect } from 'react';
import { 
  Bell, AlertTriangle, Info, CheckCircle, Filter, Search, 
  Calendar, User, Star, ArrowRight, Clock, Tag, BarChart3, Eye, 
  FileText, Shield, Users, Settings, RefreshCw, Loader2, ChevronDown,
  ChevronUp, MessageSquare, Bookmark, Download, Mail, Share2, MoreHorizontal,
  GraduationCap, BookOpen, ClipboardList, Clock3, Briefcase, Award, 
  HelpCircle, Megaphone, FileCheck, Layers, ShieldCheck, BookmarkCheck,
  ClipboardCheck, Home, FilePlus2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import parse from 'html-react-parser';

const EmployeeHome = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedNotice, setExpandedNotice] = useState(null);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  // Sample data - replace with actual API calls
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Simulate API call
    const fetchData = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        const mockNotices = [
          {
            id: '1',
            title: 'Quarterly Department Meeting',
            content: '<p>All department heads are required to attend the quarterly review meeting on <strong>Friday at 10 AM</strong> in the conference room. Please bring your department reports and be prepared to discuss Q3 results.</p>',
            priority: 'high',
            type: 'meeting',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            departments: ['Administration', 'HR'],
            status: 'published',
            attachments: ['meeting_agenda.pdf'],
            createdBy: { name: 'HR Department', email: 'hr@university.edu' }
          },
          {
            id: '2',
            title: 'New Campus Safety Policy',
            content: '<p>The university has implemented new safety protocols effective immediately. All employees must complete the safety training module by <strong>October 15th</strong>.</p>',
            priority: 'critical',
            type: 'policy',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            departments: ['All'],
            status: 'published',
            attachments: ['safety_policy.pdf', 'training_guide.pdf'],
            createdBy: { name: 'Safety Office', email: 'safety@university.edu' }
          },
          {
            id: '3',
            title: 'Professional Development Workshop',
            content: '<p>Sign up now for our "Effective Communication" workshop on <strong>November 5th</strong>. Limited seats available!</p>',
            priority: 'medium',
            type: 'training',
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            departments: ['Faculty', 'Staff'],
            status: 'published',
            attachments: ['workshop_details.pdf'],
            createdBy: { name: 'Professional Development', email: 'training@university.edu' }
          }
        ];
        
        setNotices(mockNotices);
        setEmployeeInfo({
          name: 'Dr. Sarah Johnson',
          department: 'Human Resources',
          position: 'HR Manager',
          email: 's.johnson@university.edu',
          pendingApprovals: 3
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchData();
    return () => clearInterval(timer);
  }, [refreshing]);

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
      case 'meeting': return <Briefcase className="w-5 h-5 text-blue-600" />;
      case 'policy': return <ShieldCheck className="w-5 h-5 text-purple-600" />;
      case 'deadline': return <Clock3 className="w-5 h-5 text-red-600" />;
      case 'training': return <BookOpen className="w-5 h-5 text-green-600" />;
      case 'announcement': return <Megaphone className="w-5 h-5 text-yellow-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || notice.priority === selectedFilter;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'my' && notice.createdBy.email === employeeInfo?.email) ||
                      (activeTab === 'department' && notice.departments?.includes(employeeInfo?.department));
    return matchesSearch && matchesFilter && matchesTab;
  });

  const stats = [
    { 
      label: "Total Notices", 
      value: notices.length, 
      icon: Bell, 
      color: "text-blue-600",
      bg: "bg-blue-50",
      change: "+8% from last month"
    },
    { 
      label: "My Notices", 
      value: notices.filter(n => n.createdBy.email === employeeInfo?.email).length, 
      icon: FileText, 
      color: "text-purple-600",
      bg: "bg-purple-50",
      change: "You created"
    },
    { 
      label: "Department", 
      value: notices.filter(n => n.departments?.includes(employeeInfo?.department)).length, 
      icon: Users, 
      color: "text-green-600",
      bg: "bg-green-50",
      change: "Relevant to you"
    },
    { 
      label: "High Priority", 
      value: notices.filter(n => n.priority === 'high' || n.priority === 'critical').length, 
      icon: AlertTriangle, 
      color: "text-red-600",
      bg: "bg-red-50",
      change: "Require attention"
    }
  ];

  const toggleNoticeExpand = (id) => {
    setExpandedNotice(expandedNotice === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo/Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600">University Portal</span>
              </div>
            </div>

            {/* Right side - Navigation Links */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 flex items-center"
              >
                <Home className="w-5 h-5 mr-2" />
                Home
              </button>
              <button 
                onClick={() => navigate('/notices')}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 flex items-center"
              >
                <Megaphone className="w-5 h-5 mr-2" />
                Notices
              </button>
              
              <button 
                onClick={() => navigate('/approvals')}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 flex items-center"
              >
                <ClipboardCheck className="w-5 h-5 mr-2" />
                Approvals
                {employeeInfo?.pendingApprovals > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {employeeInfo.pendingApprovals}
                  </span>
                )}
              </button>

              <button 
                onClick={() => navigate('/profile')}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 flex items-center"
              >
                <User className="w-5 h-5 mr-2" />
                Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-10 flex flex-col space-y-4">
        <button 
          onClick={() => navigate('/notices/create')}
          className="p-4 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-700 transition-all transform hover:scale-105 flex items-center justify-center"
          title="Create New Notice"
        >
          <FilePlus2 className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setRefreshing(true)}
          className="p-4 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 transition-all transform hover:scale-105"
          title="Refresh Notices"
        >
          <RefreshCw className={`w-6 h-6 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-700 to-purple-800 rounded-2xl shadow-2xl text-white p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-20">
            <svg width="300" height="300" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFFFFF" d="M45.6,-45.6C58.6,-32.6,68.1,-16.3,68.3,0.2C68.5,16.7,59.4,33.4,46.4,46.4C33.4,59.4,16.7,68.7,0.7,68C-15.3,67.3,-30.6,56.6,-45.6,43.6C-60.6,30.6,-75.3,15.3,-76.5,-1.3C-77.7,-17.9,-65.4,-35.8,-50.4,-48.8C-35.4,-61.8,-17.7,-69.9,-0.1,-69.8C17.5,-69.7,35,-61.4,45.6,-45.6Z" transform="translate(100 100)" />
            </svg>
          </div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start justify-between">
              <div className="flex items-center space-x-6 mb-6 md:mb-0">
                <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {employeeInfo ? `Welcome, ${employeeInfo.name}` : 'Employee Dashboard'}
                  </h1>
                  <p className="text-indigo-100 text-lg">
                    {employeeInfo ? `${employeeInfo.position} - ${employeeInfo.department}` : 'University Administration Portal'}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span className="bg-white/10 px-3 py-1 rounded-full">
                      {employeeInfo?.email}
                    </span>
                    <span className="bg-white/10 px-3 py-1 rounded-full">
                      Last login: {currentTime.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-indigo-100 text-sm mb-1">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-3xl font-bold mb-1">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </div>
                <div className="flex items-center justify-between text-indigo-100 text-sm">
                  <span>Local Time</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Active</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <Briefcase className="w-6 h-6 text-blue-300" />
                    <h3 className="text-lg font-semibold">Meetings & Events</h3>
                  </div>
                  <p className="text-indigo-100">
                    Upcoming department meetings, university events, and important gatherings.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <ShieldCheck className="w-6 h-6 text-purple-300" />
                    <h3 className="text-lg font-semibold">Policy Updates</h3>
                  </div>
                  <p className="text-indigo-100">
                    Latest HR policies, university regulations, and compliance information.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <BookOpen className="w-6 h-6 text-green-300" />
                    <h3 className="text-lg font-semibold">Training Materials</h3>
                  </div>
                  <p className="text-indigo-100">
                    Professional development opportunities and training resources.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:-translate-y-1 ${index === 3 ? 'border-l-4 border-red-500' : ''}`}>
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
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
              
              <button
                onClick={() => setRefreshing(true)}
                disabled={refreshing}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg shadow-sm transition-all ${refreshing ? 'bg-gray-100 text-gray-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mt-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 font-medium text-sm flex items-center space-x-2 ${activeTab === 'all' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Layers className="w-4 h-4" />
              <span>All Notices</span>
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`px-4 py-2 font-medium text-sm flex items-center space-x-2 ${activeTab === 'my' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>My Notices</span>
            </button>
            <button
              onClick={() => setActiveTab('department')}
              className={`px-4 py-2 font-medium text-sm flex items-center space-x-2 ${activeTab === 'department' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Users className="w-4 h-4" />
              <span>My Department</span>
            </button>
          </div>
        </div>

        {/* Notices Grid */}
        {filteredNotices.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No notices found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedFilter !== 'all' || activeTab !== 'all'
                ? 'Try adjusting your search or filter criteria.' 
                : 'The notice board is currently empty.'}
            </p>
            {(searchTerm || selectedFilter !== 'all' || activeTab !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedFilter('all');
                  setActiveTab('all');
                }}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 mb-8">
            {filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className={`bg-white rounded-xl shadow-sm border-l-4 ${priorityConfig[notice.priority]?.border || 'border-gray-200'} hover:shadow-lg transition-all duration-200`}
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
                        {notice.departments?.map((dept, i) => (
                          <span key={i} className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {dept}
                          </span>
                        ))}
                        {notice.createdBy.email === employeeInfo?.email && (
                          <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                            YOUR NOTICE
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">
                        {new Date(notice.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-sm text-gray-900 font-medium">
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div 
                    className="cursor-pointer"
                    onClick={() => toggleNoticeExpand(notice.id)}
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
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
                                href="#"
                                className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-700 transition-colors"
                              >
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span>{file}</span>
                                <span className="text-xs text-gray-500">(PDF, 256KB)</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Metadata */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Published By</p>
                          <p className="font-medium">{notice.createdBy.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Department(s)</p>
                          <p className="font-medium">{notice.departments?.join(', ') || 'All'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Status</p>
                          <p className="font-medium capitalize">{notice.status}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Notice Type</p>
                          <p className="font-medium capitalize">{notice.type}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600 transition-colors">
                        <Bookmark className="w-4 h-4" />
                        <span className="text-xs">Save</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600 transition-colors">
                        <Download className="w-4 h-4" />
                        <span className="text-xs">Download</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600 transition-colors">
                        <Mail className="w-4 h-4" />
                        <span className="text-xs">Email</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => toggleNoticeExpand(notice.id)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
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
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/notices/create')}
              className="flex flex-col items-center justify-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <Megaphone className="w-8 h-8 text-indigo-600 mb-2" />
              <span className="text-sm font-medium">Create Notice</span>
            </button>
            <button 
              onClick={() => navigate('/notices/drafts')}
              className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <FileCheck className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium">Review Drafts</span>
            </button>
            <button 
              onClick={() => navigate('/analytics')}
              className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium">View Analytics</span>
            </button>
            <button 
              onClick={() => navigate('/help')}
              className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <HelpCircle className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium">Get Help</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;