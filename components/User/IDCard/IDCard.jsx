import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Printer, Share2, ArrowLeft } from 'lucide-react';

const IDCardPage = () => {
  const navigate = useNavigate();
  
  // Sample data - replace with actual data from props or API
  const studentData = {
    name: "Aryan Tiwari",
    rollNo: "2315800017",
    course: "B.Tech Hons. - CSV",
    dob: "23 Nov, 2005",
    photoUrl: "", // URL to student photo if available
    university: "GLA UNIVERSITY",
    location: "MATHURA",
    signature: "Digital Signature By Dean-Academic Affairs",
    website: "www.gla.ac.in"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Profile
          </button>
          
          <div className="flex space-x-3">
            <button className="p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
              <Download className="w-5 h-5 text-blue-600" />
            </button>
            <button className="p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
              <Printer className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
              <Share2 className="w-5 h-5 text-green-600" />
            </button>
          </div>
        </div>

        {/* ID Card Design */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-8 border-white">
          {/* University Header */}
          <div className="bg-blue-800 py-4 px-6 text-center">
            <h1 className="text-2xl font-bold text-white tracking-wider">{studentData.university}</h1>
            <p className="text-white/90 text-sm">{studentData.location}</p>
          </div>
          
          {/* ID Card Content */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Photo Section */}
              <div className="w-32 h-32 bg-gray-200 rounded-lg border-4 border-blue-100 flex items-center justify-center overflow-hidden">
                {studentData.photoUrl ? (
                  <img src={studentData.photoUrl} alt="Student" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-4xl font-bold text-gray-400">
                    {studentData.name.charAt(0)}
                  </div>
                )}
              </div>
              
              {/* Student Details */}
              <div className="flex-1">
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Digital ID Card (Active)</p>
                  <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-100 pb-2">
                    {studentData.name}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Univ. Roll:</p>
                    <p className="font-medium">{studentData.rollNo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Course/Branch:</p>
                    <p className="font-medium">{studentData.course}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date Of Birth:</p>
                    <p className="font-medium">{studentData.dob}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-600 mb-2">{studentData.signature}</p>
              <p className="text-xs font-medium text-blue-600">{studentData.website}</p>
            </div>
          </div>
          
          {/* Watermark */}
          <div className="absolute bottom-4 right-4 opacity-10">
            <div className="text-8xl font-bold text-blue-400 rotate-12">VALID</div>
          </div>
        </div>
        
        {/* Validity Note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>This digital ID card is valid until the end of the current academic session.</p>
          <p className="mt-1">© {new Date().getFullYear()} {studentData.university}. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default IDCardPage;