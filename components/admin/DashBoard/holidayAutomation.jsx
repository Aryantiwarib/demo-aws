import React, { useState } from "react";

const HolidayAutomationDashboard = () => {
  const [fileName, setFileName] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    setError("");
    setHolidays([]);

    if (!file || file.type !== "text/csv") {
      setError("Please upload a valid CSV file.");
      return;
    }

    setFileName(file.name);
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_UPLOAD_CSV}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setHolidays(data.holidays || []);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to upload CSV. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white shadow rounded-xl max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Holiday Automation</h2>
      <p className="text-gray-500 mb-6">
        Upload a CSV file to automate holiday notices. Required columns: <strong>name</strong>, <strong>start_date</strong>, <strong>end_date</strong>.
      </p>

      <label
        htmlFor="csvUpload"
        className="flex flex-col items-center justify-center w-full h-40 px-4 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
      >
        <svg
          className="w-10 h-10 text-gray-400 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 15a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4M7 10l5-5 5 5M12 15V3"
          />
        </svg>
        <span className="text-sm text-gray-500">Click or drag CSV file to upload</span>
        <input
          id="csvUpload"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {fileName && (
        <p className="mt-4 text-green-600 font-medium">
          Uploaded file: <span className="font-semibold">{fileName}</span>
        </p>
      )}

      {loading && <p className="mt-4 text-blue-600">Uploading and processing...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      {holidays.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Detected Holidays:</h3>
          <ul className="space-y-2">
            {holidays.map((h, idx) => (
              <li key={idx} className="border p-3 rounded bg-gray-50 shadow-sm">
                <span className="font-semibold">{h.name}</span> ({h.start_date} → {h.end_date}) — {h.type}<br />
                {h.message && <p className="text-sm text-gray-600 mt-1">Message: {h.message}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HolidayAutomationDashboard;
