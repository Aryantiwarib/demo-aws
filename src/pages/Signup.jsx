import { FaArrowRight, FaFacebookF, FaGoogle, FaEnvelope, FaLock, FaUser, FaUserTag } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'academic' // Default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_USER_SIGNUP}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Redirect to login page after successful signup
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-6xl flex overflow-hidden">
        {/* Left Form Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="text-gray-500 hover:text-gray-700 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:underline transition"
              >
                Sign in
              </Link>
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-500 mb-8">
            Join SmartNotice to streamline your institution's communications
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="flex items-center border-b border-gray-300 py-2">
                <FaUser className="text-gray-400 mr-3 text-sm" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full outline-none text-gray-700 text-sm"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="flex items-center border-b border-gray-300 py-2">
                <FaEnvelope className="text-gray-400 mr-3 text-sm" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full outline-none text-gray-700 text-sm"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="flex items-center border-b border-gray-300 py-2">
                <FaUserTag className="text-gray-400 mr-3 text-sm" />
                <select
                  name="role"
                  className="w-full outline-none text-gray-700 bg-transparent text-sm"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="academic">Academic Department</option>
                  <option value="fees">Fees Department</option>
                  <option value="exam">Examination Department</option>
                  <option value="placement">Placement Department</option>
                </select>
              </div>
              
              <div className="flex items-center border-b border-gray-300 py-2">
                <FaLock className="text-gray-400 mr-3 text-sm" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password (min 6 characters)"
                  className="w-full outline-none text-gray-700 text-sm"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </div>
              
              <div className="flex items-center border-b border-gray-300 py-2">
                <FaLock className="text-gray-400 mr-3 text-sm" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full outline-none text-gray-700 text-sm"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
            </div>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button 
                type="button" 
                className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 text-sm text-gray-700"
              >
                <FaGoogle className="text-red-500" />
                <span>Google</span>
              </button>
              <button 
                type="button" 
                className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 text-sm text-gray-700"
              >
                <FaFacebookF className="text-blue-600" />
                <span>Facebook</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Graphic Side */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-12 items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10"></div>
          <div className="relative z-10 space-y-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h4 className="text-xs text-white/80 mb-2">Department Access</h4>
              <p className="text-xl font-semibold">Role-Based Control</p>
              <p className="text-sm text-white/80 mt-2">↗ Secure access for each department</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h4 className="text-sm font-semibold mb-2">
                Encrypted Communications
              </h4>
              <p className="text-xs text-white/80">
                End-to-end encryption ensures your notices and data remain secure.
              </p>
            </div>
          </div>
          <div className="absolute bottom-6 right-6 opacity-10 text-8xl pointer-events-none">
            <FaUserTag />
          </div>
        </div>
      </div>
    </div>
  );
}