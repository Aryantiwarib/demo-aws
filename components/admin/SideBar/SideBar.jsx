import { FaChartBar, FaPlus, FaFileAlt, FaCog, FaUserGraduate, FaUserTie, FaCalendarAlt, FaUpload } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const roleBasedLinks = {
  academic: [
    { path: "/academic-dashboard", icon: <FaChartBar className="w-5 h-5" />, text: "Dashboard" },
    { path: "/create-notice", icon: <FaPlus className="w-5 h-5" />, text: "Create Notice" },
    { path: "/notices", icon: <FaFileAlt className="w-5 h-5" />, text: "All Notices" },
    { path: "/add-student-details", icon: <FaUpload className="w-5 h-5" />, text: "Upload Data" },
    { path: "/holidays-automation", icon: <FaCalendarAlt className="w-5 h-5" />, text: "Holidays" }
  ],
  fees: [
    { path: "/fees-dashboard", icon: <FaChartBar className="w-5 h-5" />, text: "Dashboard" },
    { path: "/fees-notices", icon: <FaFileAlt className="w-5 h-5" />, text: "Fee Notices" },
    { path: "/fees-reports", icon: <FaChartBar className="w-5 h-5" />, text: "Reports" }
  ],
  exam: [
    { path: "/exam-dashboard", icon: <FaChartBar className="w-5 h-5" />, text: "Dashboard" },
    { path: "/exam-notices", icon: <FaFileAlt className="w-5 h-5" />, text: "Exam Notices" },
    { path: "/exam-schedule", icon: <FaCalendarAlt className="w-5 h-5" />, text: "Schedule" }
  ],
  placement: [
    { path: "/placement-dashboard", icon: <FaChartBar className="w-5 h-5" />, text: "Dashboard" },
    { path: "/placement-notices", icon: <FaFileAlt className="w-5 h-5" />, text: "Placement Notices" },
    { path: "/placement-drives", icon: <FaUserTie className="w-5 h-5" />, text: "Drives" }
  ]
};

const roleTitles = {
  academic: "Academic Dashboard",
  fees: "Fees Department", 
  exam: "Examination",
  placement: "Placement Cell"
};

const roleColors = {
  academic: {
    gradient: "from-blue-600 to-indigo-700",
    accent: "bg-blue-500",
    hover: "hover:bg-blue-50",
    activeText: "text-blue-600",
    activeBg: "bg-blue-50 border-r-4 border-blue-500"
  },
  fees: {
    gradient: "from-green-600 to-emerald-700", 
    accent: "bg-green-500",
    hover: "hover:bg-green-50",
    activeText: "text-green-600",
    activeBg: "bg-green-50 border-r-4 border-green-500"
  },
  exam: {
    gradient: "from-purple-600 to-violet-700",
    accent: "bg-purple-500", 
    hover: "hover:bg-purple-50",
    activeText: "text-purple-600",
    activeBg: "bg-purple-50 border-r-4 border-purple-500"
  },
  placement: {
    gradient: "from-orange-600 to-red-700",
    accent: "bg-orange-500",
    hover: "hover:bg-orange-50", 
    activeText: "text-orange-600",
    activeBg: "bg-orange-50 border-r-4 border-orange-500"
  }
};

const roleIcons = {
  academic: <FaUserGraduate className="w-8 h-8 text-white" />,
  fees: <FaCog className="w-8 h-8 text-white" />,
  exam: <FaFileAlt className="w-8 h-8 text-white" />,
  placement: <FaUserTie className="w-8 h-8 text-white" />
};

const Sidebar = ({ role = 'academic' }) => {
  const links = roleBasedLinks[role] || roleBasedLinks.academic;
  const title = roleTitles[role] || "Admin Dashboard";
  const colors = roleColors[role] || roleColors.academic;
  const roleIcon = roleIcons[role] || roleIcons.academic;

  return (
    <div className="h-screen w-64 bg-white shadow-2xl flex flex-col border-r border-gray-200">
      {/* Header */}
      <div className={`bg-gradient-to-br ${colors.gradient} p-6 text-white relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
              {roleIcon}
            </div>
          </div>
          <h1 className="text-xl font-bold leading-tight mb-1">{title}</h1>
          <p className="text-sm opacity-90 font-medium">Management Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto">
        <div className="space-y-2 px-4">
          {links.map((link, index) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform ${
                  isActive
                    ? `${colors.activeBg} ${colors.activeText} shadow-sm`
                    : `text-gray-700 ${colors.hover} hover:translate-x-1 hover:shadow-sm`
                }`
              }
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50 group-hover:bg-white transition-colors duration-200 mr-3">
                {link.icon}
              </div>
              <span className="font-medium">{link.text}</span>
              
              {/* Active indicator dot */}
              <div className="ml-auto">
                <div className="w-2 h-2 rounded-full bg-current opacity-0 group-hover:opacity-50 transition-opacity duration-200"></div>
              </div>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-center py-2">
          <div className="flex space-x-1">
            <div className={`w-2 h-2 rounded-full ${colors.accent} opacity-60`}></div>
            <div className={`w-2 h-2 rounded-full ${colors.accent} opacity-40`}></div>
            <div className={`w-2 h-2 rounded-full ${colors.accent} opacity-20`}></div>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center font-medium">
          © 2025 Admin Portal
        </p>
      </div>
    </div>
  );
};

export default Sidebar;