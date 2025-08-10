import { FaPlus, FaBars, FaTimes, FaUserCircle, FaUser, FaSignOutAlt, FaMicrophone } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import LogoutBtn from "./LogoutBtn";

const roleColors = {
  academic: {
    gradient: "from-blue-600 via-blue-700 to-indigo-800",
    accent: "bg-blue-500",
    hover: "hover:bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    shadow: "shadow-blue-100"
  },
  fees: {
    gradient: "from-green-600 via-green-700 to-emerald-800",
    accent: "bg-green-500",
    hover: "hover:bg-green-50",
    text: "text-green-600",
    border: "border-green-200",
    shadow: "shadow-green-100"
  },
  exam: {
    gradient: "from-purple-600 via-purple-700 to-violet-800",
    accent: "bg-purple-500",
    hover: "hover:bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200",
    shadow: "shadow-purple-100"
  },
  placement: {
    gradient: "from-orange-600 via-orange-700 to-red-800",
    accent: "bg-orange-500",
    hover: "hover:bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-200",
    shadow: "shadow-orange-100"
  }
};

const Topbar = ({ role = 'academic' }) => {
  const navigate = useNavigate();
  const { status, userData } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [emergencyMessage, setEmergencyMessage] = useState("");
  
  const colors = roleColors[role] || roleColors.academic;

  const handleSignUp = () => {
    navigate("/signup");
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const startRecording = () => {
    setIsRecording(true);
    // This is where you would initialize the speech recognition
    // For now, we'll simulate it with a timeout
    setTimeout(() => {
      // Simulate receiving a message
      const simulatedMessage = "Emergency! Fire in ABI building!";
      setEmergencyMessage(simulatedMessage);
      setIsRecording(false);
      // Here you would send the message to all recipients
      console.log("Emergency message:", simulatedMessage);
      alert(`Emergency message sent to all: "${simulatedMessage}"`);
      setEmergencyMessage("");
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Here you would stop the speech recognition
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-lg">
        {/* Gradient accent line */}
        <div className={`h-1 bg-gradient-to-r ${colors.gradient}`}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-4">
              <div 
                className="flex items-center space-x-3 cursor-pointer group"
                onClick={handleLogoClick}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-all duration-300`}>
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                    NoticeBoard
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">Management Portal</p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Emergency Mic Button - Only show if user is logged in */}
              {status && (
                <div className="relative">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`flex items-center px-4 py-2.5 ${
                      isRecording 
                        ? "bg-red-600 hover:bg-red-700 animate-pulse" 
                        : "bg-red-500 hover:bg-red-600"
                    } text-white rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-red-200 hover:shadow-red-300`}
                  >
                    <FaMicrophone className="mr-2" />
                    {isRecording ? "Stop" : "Emergency Mic"}
                  </button>
                </div>
              )}

              {/* User Section */}
              {status ? (
                <div className="relative">
                  {/* User Avatar and Name - Clickable */}
                  <div 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-3 hover:bg-gray-50/50 rounded-xl px-4 py-2 transition-all duration-200 cursor-pointer group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:shadow-lg transition-all duration-200`}>
                      {getUserInitials(userData?.name)}
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-sm text-gray-900 font-semibold block">
                        {userData?.name || 'User'}
                      </span>
                      {userData?.email && (
                        <p className="text-xs text-gray-500 truncate max-w-32">
                          {userData.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-2.5 text-gray-700 hover:text-gray-900 text-sm font-medium transition-all duration-200 rounded-xl hover:bg-gray-50"
                  >
                    Log In
                  </button>
                  <button
                    onClick={handleSignUp}
                    className={`px-6 py-2.5 bg-gradient-to-r ${colors.gradient} hover:shadow-lg text-white rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${colors.shadow}`}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 border border-gray-200/50"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="h-4 w-4" />
                ) : (
                  <FaBars className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-md">
            <div className="px-4 py-6 space-y-4">
              {status ? (
                <>
                  {/* User Info */}
                  <div className={`flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl border ${colors.border}/30`}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white font-bold shadow-lg`}>
                      {getUserInitials(userData?.name)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {userData?.name || 'User'}
                      </p>
                      {userData?.email && (
                        <p className="text-xs text-gray-500">
                          {userData.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Emergency Mic Button */}
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-full flex items-center justify-center ${
                      isRecording 
                        ? "bg-red-600 hover:bg-red-700 animate-pulse" 
                        : "bg-red-500 hover:bg-red-600"
                    } text-white px-4 py-4 rounded-xl transition-all duration-300 font-semibold shadow-red-200 hover:shadow-red-300`}
                  >
                    <FaMicrophone className="mr-3" />
                    {isRecording ? "Stop Recording" : "Emergency Mic"}
                  </button>

                  {/* Search Bar Mobile */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search notices..."
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50"
                    />
                  </div>

                  {/* Create Notice Button */}
                  <Link to="/CreateNotice" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className={`w-full flex items-center justify-center bg-gradient-to-r ${colors.gradient} hover:shadow-lg text-white px-4 py-4 rounded-xl transition-all duration-300 font-semibold ${colors.shadow}`}>
                      <FaPlus className="mr-3" />
                      Create Notice
                    </button>
                  </Link>

                  {/* Profile Menu */}
                  <div className="space-y-2">
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 font-medium">
                        <FaUser className="mr-3" />
                        Profile
                      </button>
                    </Link>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-2">
                    <LogoutBtn />
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      navigate("/login");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-4 text-gray-700 hover:text-gray-900 text-center font-semibold border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    Log In
                  </button>
                  <button
                    onClick={handleSignUp}
                    className={`w-full px-4 py-4 bg-gradient-to-r ${colors.gradient} hover:shadow-lg text-white text-center font-semibold rounded-xl transition-all duration-300 ${colors.shadow}`}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Dropdown Menu */}
        {showProfileMenu && status && (
          <div className="absolute right-4 top-20 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200/50 z-50 backdrop-blur-md">
            <div className="p-2">
              {/* Emergency Mic Option */}
              <button
                onClick={() => {
                  startRecording();
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium group"
              >
                <FaMicrophone className="mr-3 group-hover:text-red-700 transition-colors duration-200" />
                Emergency Mic
              </button>
              
              {/* Profile Option */}
              <Link 
                to="/student/profile" 
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 font-medium group"
              >
                <FaUser className="mr-3 text-gray-500 group-hover:text-gray-700 transition-colors duration-200" />
                Profile
              </Link>
              
              {/* Create Notice Option */}
              <Link 
                to="/CreateNotice" 
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 font-medium group"
              >
                <FaPlus className="mr-3 text-gray-500 group-hover:text-gray-700 transition-colors duration-200" />
                Create Notice
              </Link>
              
              {/* Divider */}
              <div className="my-2 h-px bg-gray-200"></div>
              
              {/* Logout Option */}
              <div className="px-4 py-2">
                <LogoutBtn />
              </div>
            </div>
          </div>
        )}

        {/* Recording Indicator */}
        {isRecording && (
          <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center z-50">
            <div className="relative mr-3">
              <div className="h-3 w-3 bg-white rounded-full animate-ping absolute"></div>
              <div className="h-3 w-3 bg-white rounded-full"></div>
            </div>
            <span>Recording emergency message...</span>
          </div>
        )}
      </header>
    </>
  );
};

export default Topbar;