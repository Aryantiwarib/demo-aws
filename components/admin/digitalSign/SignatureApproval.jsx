// components/SignatureApproval.js
import React, { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';
import axios from 'axios';
import { FaTimes, FaCheck, FaRedo } from 'react-icons/fa';

export default function SignatureApproval({ approvalId, onSigned, onCancel }) {
  const sigCanvas = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const handleSubmit = async () => {
  if (sigCanvas.current.isEmpty()) {
    return setError('Please provide a signature');
  }
  
  try {
    setIsSubmitting(true);
    const signature = sigCanvas.current.getCanvas().toDataURL("image/png");
    
    await axios.post(`http://localhost:5001/api/approvals/${approvalId}/sign`, {
      signature,
      comments // Add comments if needed
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    
    onSigned();
  } catch (err) {
    setError(err.response?.data?.error || 'Failed to submit signature');
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Digital Signature</h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        
        <div className="border border-gray-300 rounded-lg p-2 mb-4">
          <SignaturePad
            ref={sigCanvas}
            canvasProps={{
              width: 500,
              height: 200,
              className: "w-full bg-white"
            }}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <button
            onClick={clearSignature}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center"
          >
            <FaRedo className="mr-2" />
            Clear
          </button>
          <div className="flex space-x-2">
            <button
              onClick={onCancel}
              className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <FaCheck className="mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit Signature'}
            </button>
          </div>
        </div>
        
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}