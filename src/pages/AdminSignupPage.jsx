import { FaEnvelope, FaLock, FaUser, FaArrowRight, FaUserShield } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';

const AdminSignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminType: 'academic'
  });

  console.log(formData.adminType);
  

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(import.meta.env.VITE_ADMIN_SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          admin_type: formData.adminType
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Auto-login after successful signup
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      dispatch(login({
        userData: {
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          admin_type: data.user.adminType,
          token: data.token
        },
        userRole: data.user.role
      }));

      // The RoleBasedRedirect will handle the navigation
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white px-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Side - Form */}
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Admin Registration</h2>
          <p className="text-sm text-gray-500 mb-8">Create an admin account to access the dashboard</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="flex items-center border-b border-gray-300 py-2">
              <FaUser className="text-gray-400 mr-3" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full outline-none text-gray-700"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Admin Type Selection */}
            <div className="flex flex-col space-y-2">
              <label className="block text-sm font-medium text-gray-700">Admin Type</label>
              <select
                name="adminType"
                value={formData.adminType}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="academic">Academic Admin</option>
                <option value="exam">Exam Admin</option>
                <option value="placement">Placement Cell</option>
              </select>
            </div>

            {/* Email Field */}
            <div className="flex items-center border-b border-gray-300 py-2">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full outline-none text-gray-700"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Field */}
            <div className="flex items-center border-b border-gray-300 py-2">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type="password"
                name="password"
                placeholder="Password (min 8 characters)"
                className="w-full outline-none text-gray-700"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="8"
              />
            </div>

            {/* Confirm Password Field */}
            <div className="flex items-center border-b border-gray-300 py-2">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full outline-none text-gray-700"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="8"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  Sign Up <FaArrowRight />
                </>
              )}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account? <Link to="/admin-login" className="text-blue-600 hover:underline">Login here</Link>
          </p>
        </div>

        {/* Right Side - Visuals */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 flex flex-col justify-center relative overflow-hidden">
          <h3 className="text-2xl font-semibold mb-2">Admin Privileges</h3>
          <p className="text-sm max-w-xs">
            Gain access to powerful tools for managing university operations, student records, and institutional data.
          </p>

          <div className="absolute bottom-4 right-4 opacity-20 text-7xl font-bold rotate-12 pointer-events-none">
            <FaUserShield />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignupPage;