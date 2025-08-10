// components/ApprovalSelector.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaUser, FaTimes } from 'react-icons/fa';

export default function ApprovalSelector({ onSelectApprovers, initialApprovers = [] }) {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApprovers, setSelectedApprovers] = useState(initialApprovers);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5001/api/employees', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Ensure the response data is an array
      setEmployees(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.log(err);
      
      setError(err.response?.data?.error || 'Failed to fetch employees');
      setEmployees([]); // Set to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  fetchEmployees();
}, []);

  useEffect(() => {
    onSelectApprovers(selectedApprovers);
  }, [selectedApprovers, onSelectApprovers]);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.post.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (employee) => {
    if (!selectedApprovers.some(e => e._id === employee._id)) {
      setSelectedApprovers([...selectedApprovers, employee]);
    }
    setSearchTerm('');
  };

  const removeApprover = (id) => {
    setSelectedApprovers(selectedApprovers.filter(approver => approver._id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search employees by name, department or post..."
            className="w-full outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {searchTerm && filteredEmployees.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredEmployees.map(employee => (
              <div
                key={employee._id}
                className="p-3 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => handleSelect(employee)}
              >
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <FaUser className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-gray-600">{employee.department} • {employee.post}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedApprovers.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-700 mb-2">Selected Approvers</h3>
          <div className="space-y-2">
            {selectedApprovers.map(approver => (
              <div key={approver._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FaUser className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{approver.name}</p>
                    <p className="text-sm text-gray-600">{approver.department} • {approver.post}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeApprover(approver._id)}
                  className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-200"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}