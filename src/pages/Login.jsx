import { FaEnvelope, FaLock, FaArrowRight, FaUserGraduate, FaUserTie } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    identifier: '', // Will be rollNo for students, employeeId for employees
    password: '',
    userType: 'student' // student or employee
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
  
  if (!formData.identifier || !formData.password) {
    setError('Please fill in all fields');
    return;
  }

  try {
    setLoading(true);
    // Determine the endpoint based on user type
    const endpoint = formData.userType === 'student' 
      ? import.meta.env.VITE_STUDENT_LOGIN
      : import.meta.env.VITE_EMPLOYEE_LOGIN;

    const loginData = formData.userType === 'student'
      ? { univ_roll_no: formData.identifier, password: formData.password }
      : { employee_id: formData.identifier, password: formData.password };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    dispatch(login({
      userData: {
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        token: data.accessToken,
        identifier: formData.userType === 'student' 
          ? data.user.univ_roll_no 
          : data.user.employee_id
      },
      userRole: data.user.role
    }));

    // Role-based redirect
    if (data.user.role === 'employee') {
      navigate('/employee/dashboard');
    } else {
      navigate('/student/dashboard');
    }
    
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
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
            {/* User Type Selection */}
            <div className="flex items-center border-b border-gray-300 py-2">
              <div className="flex items-center mr-4">
                <input
                  type="radio"
                  id="student"
                  name="userType"
                  value="student"
                  checked={formData.userType === 'student'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="student" className="ml-2 flex items-center">
                  <FaUserGraduate className="mr-1" /> Student
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="employee"
                  name="userType"
                  value="employee"
                  checked={formData.userType === 'employee'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="employee" className="ml-2 flex items-center">
                  <FaUserTie className="mr-1" /> Employee
                </label>
              </div>
            </div>

            {/* Identifier Field */}
            <div className="flex items-center border-b border-gray-300 py-2">
              {formData.userType === 'student' ? (
                <>
                  <span className="text-gray-400 mr-3">#</span>
                  <input
                    type="text"
                    name="identifier"
                    placeholder="University Roll Number"
                    className="w-full outline-none text-gray-700"
                    value={formData.identifier}
                    onChange={handleChange}
                    required
                  />
                </>
              ) : (
                <>
                  <span className="text-gray-400 mr-3">ID</span>
                  <input
                    type="text"
                    name="identifier"
                    placeholder="Employee ID"
                    className="w-full outline-none text-gray-700"
                    value={formData.identifier}
                    onChange={handleChange}
                    required
                  />
                </>
              )}
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
            For admin login, please <Link to="/admin/login" className="text-blue-600 hover:underline">click here</Link>
          </p>
        </div>

        {/* Right Side - Visuals */}
        <div className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white p-10 flex flex-col justify-center relative overflow-hidden">
          <h3 className="text-2xl font-semibold mb-2">Smart Notice Agent</h3>
          <p className="text-sm max-w-xs">
            {formData.userType === 'student' 
              ? "Access your academic records, notices, and university communications."
              : "Manage academic activities, student records, and institutional communications."}
          </p>

          <div className="absolute bottom-4 right-4 opacity-20 text-7xl font-bold rotate-12 pointer-events-none">
            {formData.userType === 'student' ? "🎓" : "👔"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;