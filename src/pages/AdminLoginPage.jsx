import { FaEnvelope, FaLock, FaArrowRight, FaUserTag } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'academic' // Default role
  });
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
  
  if (!formData.email || !formData.password) {
    setError('Please fill in all fields');
    return;
  }

  try {
    setLoading(true);
    const response = await fetch(import.meta.env.VITE_ADMIN_LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store tokens in localStorage
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    // Dispatch login action with user data and role
    dispatch(login({
      userData: {
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        token: data.accessToken
      },
      userRole: data.user.role
    }));
    
    // Role-based redirect
    switch(data.user.role) {
      case 'academic':
        navigate('/academic-dashboard');
        break;
      case 'fees':
        navigate('/fees-dashboard');
        break;
      case 'exam':
        navigate('/exam-dashboard');
        break;
      case 'placement':
        navigate('/placement-dashboard');
        break;
      default:
        navigate('/');
    }
    
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Side - Form */}
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Welcome Back</h2>
          <p className="text-sm text-gray-500 mb-8">Login to continue to Smart Notice Agent</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="flex items-center border-b border-gray-300 py-2">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input
                type="email"
                name="email"
                placeholder="Email"
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
                placeholder="Password"
                className="w-full outline-none text-gray-700"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            {/* Role Selection */}
            <div className="flex items-center border-b border-gray-300 py-2">
              <FaUserTag className="text-gray-400 mr-3" />
              <select
                name="role"
                className="w-full outline-none text-gray-700 bg-transparent"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="academic">Academic Department</option>
                <option value="fees">Fees Department</option>
                <option value="exam">Examination Department</option>
                <option value="placement">Placement Department</option>
              </select>
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Login <FaArrowRight />
                </>
              )}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/admin-signup" className="text-blue-600 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>

        {/* Right Side - Visuals */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-opacity-10 bg-white"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-semibold mb-2">Smart Notice Agent</h3>
            <p className="text-sm max-w-xs">
              Streamlined communication platform for academic institutions. 
              Efficient notice distribution with role-based access control.
            </p>
          </div>

          <div className="absolute bottom-4 right-4 opacity-10 text-8xl font-bold rotate-12 pointer-events-none">
            <FaUserTag />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;