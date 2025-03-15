import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import LiveFeed from "../components/LiveFeed";
import Notifications from "../components/Notifications";

const Home = () => {
  const navigate = useNavigate();

  // ✅ Define state variables
  const [video, setVideo] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  // ✅ Function to handle file selection
  const handleFileChange = (e) => {
    setVideo(e.target.files[0]);
  };

  // ✅ Function to handle upload
  const handleUpload = async () => {
    if (!video) {
      alert("Please select a video first.");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setUploadStatus("Upload successful! Detection in progress...");
      console.log(data); // Log response from backend
    } catch (error) {
      console.error("Error uploading video:", error);
      setUploadStatus("Upload failed. Please try again.");
    }
  };

  return (
    <div className="p-4 h-screen flex flex-col">
      {/* Buttons Section */}
      <div className="flex justify-end mb-4 space-x-4">
        <button
          onClick={() => navigate("/alerts")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Alerts
        </button>
        <button
          onClick={() => navigate("/visualization")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Visualization
        </button>
      </div>

      {/* Main Content Section */}
      <div className="grid grid-rows-2 gap-4 h-full">
        {/* Live Feed (Top Half) */}
        <div className="row-span-1 bg-white rounded-lg shadow-md p-4">
          <LiveFeed />

          {/* ✅ Video Upload Section */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Upload Video for Detection</h3>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="mt-2 border p-2 rounded w-full"
            />
            <button
              onClick={handleUpload}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Upload & Detect
            </button>
            {uploadStatus && <p className="mt-2 text-gray-600">{uploadStatus}</p>}
          </div>
        </div>

        {/* Dashboard and Notifications (Bottom Half) */}
        <div className="row-span-1 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-md">
            <Dashboard />
          </div>
          <div className="bg-white rounded-lg shadow-md">
            <Notifications />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
