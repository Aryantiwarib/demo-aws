import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, BookOpen, GraduationCap, Calendar, 
  MapPin, Users, FileText, Award, Shield, Clock, 
  Edit, Download, Printer, Share2, ChevronDown, ChevronUp,
  BadgeIndianRupee, Library, School, Bookmark, Briefcase,
  ClipboardList, BarChart2, CreditCard, Settings, LogOut,
  Home, Frown, Smile
} from 'lucide-react';

const StudentProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [expandedSection, setExpandedSection] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
const fetchProfileData = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    // Add error handling for missing token
    if (!token) {
      throw new Error('Authentication token missing');
    }

    const response = await fetch(`${import.meta.env.VITE_GET_STUDENT_PROFILE}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json' // Explicitly request JSON
      },
    });
    
    // First check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Expected JSON but got: ${text.substring(0, 100)}...`);
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile data');
    }
    
    setProfileData(data);
    setError(null);
  } catch (err) {
    setError(err.message);
    // Redirect to login if unauthorized
    if (err.message.includes('401') || err.message.includes('token')) {
      navigate('/login');
    }
  } finally {
    setLoading(false);
  }
};

    fetchProfileData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/student-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const updatedData = await response.json();
      setProfileData(updatedData);
      setEditMode(false);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handleUpdateAcademicHistory = async (historyData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/student-profile/academic-history', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(historyData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update academic history');
      }
      
      const updatedData = await response.json();
      setProfileData(updatedData);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Frown className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find your profile information</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="relative mb-6 md:mb-0 md:mr-8">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                {profileData.name ? (
                  <span className="text-4xl font-bold text-gray-600">
                    {profileData.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <button 
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                onClick={() => navigate('/profile/edit-photo')}
              >
                <Edit className="w-4 h-4 text-blue-600" />
              </button>
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2">{profileData.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  <span>{profileData.course}</span>
                </div>
                <div className="flex items-center">
                  <BadgeIndianRupee className="w-5 h-5 mr-2" />
                  <span>Roll No: {profileData.univ_roll_no}</span>
                </div>
                <div className="flex items-center">
                  <School className="w-5 h-5 mr-2" />
                  <span>
                    {profileData.year} - Section {profileData.section}
                  </span>
                </div>
              </div>
              <div className="flex space-x-4">
                <button 
                  className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  onClick={() => setEditMode(!editMode)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {editMode ? 'Cancel Editing' : 'Edit Profile'}
                </button>
                <button 
                  className="flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                  onClick={() => navigate('/id-card')}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  View ID Card
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Quick Links
              </h3>
              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab('personal')}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-left ${activeTab === 'personal' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                >
                  <User className="w-4 h-4 mr-2" />
                  Personal Information
                </button>
                <button 
                  onClick={() => setActiveTab('academic')}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-left ${activeTab === 'academic' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Academic Details
                </button>
                <button 
                  onClick={() => setActiveTab('documents')}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-left ${activeTab === 'documents' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Documents
                </button>
                <button 
                  onClick={() => navigate('/settings')}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-left ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </button>
              </nav>
            </div>

            {/* Academic Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <ClipboardList className="w-5 h-5 mr-2 text-blue-600" />
                Academic Summary
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Current Semester</p>
                  <p className="text-xl font-bold text-blue-600">{profileData.academicInfo?.semester || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Academic Advisor</p>
                  <p className="font-medium">{profileData.academicInfo?.advisor || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Enrolled Since</p>
                  <p className="font-medium">{formatDate(profileData.created_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full lg:w-3/4">
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div 
                  className="flex items-center justify-between p-6 cursor-pointer"
                  onClick={() => toggleSection('personal')}
                >
                  <h2 className="text-xl font-semibold flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Personal Information
                  </h2>
                  {expandedSection === 'personal' ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                
                {expandedSection === 'personal' && (
                  <div className="px-6 pb-6">
                    {editMode ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input
                              type="date"
                              name="dob"
                              value={formData.dob?.split('T')[0] || ''}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Official Email</label>
                            <input
                              type="email"
                              name="official_email"
                              value={formData.official_email}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                            <input
                              type="tel"
                              name="student_mobile"
                              value={formData.student_mobile}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Contact</label>
                            <input
                              type="tel"
                              name="student_alt_contact"
                              value={formData.student_alt_contact}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <h3 className="font-medium text-lg mb-4">Family Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                              <input
                                type="text"
                                name="father_name"
                                value={formData.father_name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Father's Mobile</label>
                              <input
                                type="tel"
                                name="father_mobile"
                                value={formData.father_mobile}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                              <input
                                type="text"
                                name="mother_name"
                                value={formData.mother_name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Contact</label>
                              <input
                                type="tel"
                                name="mother_contact"
                                value={formData.mother_contact}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <h3 className="font-medium text-lg mb-4">Additional Information</h3>
                          <div className="grid grid-cols-1 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                              <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Hobbies</label>
                              <input
                                type="text"
                                name="hobbies"
                                value={formData.hobbies}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Target Company/Industry</label>
                              <input
                                type="text"
                                name="target_company"
                                value={formData.target_company}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                          <button
                            onClick={() => setEditMode(false)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleUpdateProfile}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Full Name</h4>
                          <p className="text-gray-900">{profileData.name}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Date of Birth</h4>
                          <p className="text-gray-900">{formatDate(profileData.dob)}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Gender</h4>
                          <p className="text-gray-900">{profileData.gender || 'Not provided'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Email Address</h4>
                          <p className="text-gray-900 flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-blue-500" />
                            {profileData.official_email || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Mobile Number</h4>
                          <p className="text-gray-900 flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-blue-500" />
                            {profileData.student_mobile || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Alternate Contact</h4>
                          <p className="text-gray-900">{profileData.student_alt_contact || 'Not provided'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Address</h4>
                          <p className="text-gray-900 flex items-start">
                            <Home className="w-4 h-4 mr-2 text-blue-500 mt-0.5" />
                            {profileData.address || 'Not provided'}
                          </p>
                        </div>

                        <div className="md:col-span-2 border-t border-gray-200 pt-6">
                          <h3 className="font-medium text-lg mb-4 flex items-center">
                            <Users className="w-5 h-5 mr-2 text-blue-600" />
                            Family Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Father's Name</h4>
                              <p className="text-gray-900">{profileData.father_name || 'Not provided'}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Father's Mobile</h4>
                              <p className="text-gray-900">{profileData.father_mobile || 'Not provided'}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Mother's Name</h4>
                              <p className="text-gray-900">{profileData.mother_name || 'Not provided'}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Mother's Contact</h4>
                              <p className="text-gray-900">{profileData.mother_contact || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-2 border-t border-gray-200 pt-6">
                          <h3 className="font-medium text-lg mb-4 flex items-center">
                            <Bookmark className="w-5 h-5 mr-2 text-blue-600" />
                            Additional Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Hobbies</h4>
                              <p className="text-gray-900">{profileData.hobbies || 'Not provided'}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Target Company/Industry</h4>
                              <p className="text-gray-900">{profileData.target_company || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Academic Details Tab */}
            {activeTab === 'academic' && (
              <div className="space-y-6">
                {/* Current Academic Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-6 cursor-pointer"
                    onClick={() => toggleSection('currentAcademic')}
                  >
                    <h2 className="text-xl font-semibold flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                      Current Academic Information
                    </h2>
                    {expandedSection === 'currentAcademic' ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  
                  {expandedSection === 'currentAcademic' && (
                    <div className="px-6 pb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Course</h4>
                          <p className="text-gray-900">{profileData.course}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Branch</h4>
                          <p className="text-gray-900">{profileData.branch}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Year</h4>
                          <p className="text-gray-900">{profileData.year}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Section</h4>
                          <p className="text-gray-900">{profileData.section}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">University Roll No</h4>
                          <p className="text-gray-900">{profileData.univ_roll_no}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Class Roll No</h4>
                          <p className="text-gray-900">{profileData.class_roll_no || 'Not provided'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Library Code</h4>
                          <p className="text-gray-900">{profileData.lib_code || 'Not provided'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Last Medium</h4>
                          <p className="text-gray-900">{profileData.last_medium || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Academic History */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-6 cursor-pointer"
                    onClick={() => toggleSection('academicHistory')}
                  >
                    <h2 className="text-xl font-semibold flex items-center">
                      <Library className="w-5 h-5 mr-2 text-blue-600" />
                      Academic History
                    </h2>
                    {expandedSection === 'academicHistory' ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  
                  {expandedSection === 'academicHistory' && (
                    <div className="px-6 pb-6">
                      <div className="space-y-6">
                        {/* High School */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h3 className="font-medium text-blue-800 mb-3 flex items-center">
                            <School className="w-4 h-4 mr-2" />
                            High School (10th)
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="text-xs font-medium text-blue-600 mb-1">School</h4>
                              <p>{profileData.high_school?.school || 'Not provided'}</p>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-blue-600 mb-1">Board</h4>
                              <p>{profileData.high_school?.board || 'Not provided'}</p>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-blue-600 mb-1">Percentage</h4>
                              <p>{profileData.high_school?.percentage || 'Not provided'}</p>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-blue-600 mb-1">Year of Passing</h4>
                              <p>{profileData.high_school?.year || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Intermediate */}
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h3 className="font-medium text-green-800 mb-3 flex items-center">
                            <School className="w-4 h-4 mr-2" />
                            Intermediate (12th)
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="text-xs font-medium text-green-600 mb-1">School</h4>
                              <p>{profileData.intermediate?.school || 'Not provided'}</p>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-green-600 mb-1">Board</h4>
                              <p>{profileData.intermediate?.board || 'Not provided'}</p>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-green-600 mb-1">Percentage</h4>
                              <p>{profileData.intermediate?.percentage || 'Not provided'}</p>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-green-600 mb-1">Year of Passing</h4>
                              <p>{profileData.intermediate?.year || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Graduation (if applicable) */}
                        {profileData.graduation && (
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <h3 className="font-medium text-purple-800 mb-3 flex items-center">
                              <GraduationCap className="w-4 h-4 mr-2" />
                              Graduation
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h4 className="text-xs font-medium text-purple-600 mb-1">Institution</h4>
                                <p>{profileData.graduation?.institution || 'Not provided'}</p>
                              </div>
                              <div>
                                <h4 className="text-xs font-medium text-purple-600 mb-1">Degree</h4>
                                <p>{profileData.graduation?.degree || 'Not provided'}</p>
                              </div>
                              <div>
                                <h4 className="text-xs font-medium text-purple-600 mb-1">Percentage/CGPA</h4>
                                <p>{profileData.graduation?.percentage || 'Not provided'}</p>
                              </div>
                              <div>
                                <h4 className="text-xs font-medium text-purple-600 mb-1">Year of Passing</h4>
                                <p>{profileData.graduation?.year || 'Not provided'}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold flex items-center mb-6">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    My Documents
                  </h2>
                  
                  <div className="space-y-4">
                    {profileData.documents?.length > 0 ? (
                      profileData.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg mr-4">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">{doc.name}</h3>
                              <p className="text-sm text-gray-500">{doc.type} • Uploaded on {formatDate(doc.date)}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                              <Download className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                              <Printer className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                              <Share2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No documents uploaded</h3>
                        <p className="text-gray-500 mt-2">Your documents will appear here once uploaded</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Download className="w-4 h-4 mr-2" />
                      Download All Documents
                    </button>
                    <button 
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      onClick={() => navigate('/upload-documents')}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Documents
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;