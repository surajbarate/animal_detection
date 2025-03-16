import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import LiveFeed from "../components/LiveFeed";
import Notifications from "../components/Notifications";


const Home = () => {
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // ✅ Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setVideo(e.target.files[0]);
      setUploadStatus(""); // Clear previous messages
    }
  };

  // ✅ Handle video upload
  const handleUpload = async () => {
    if (!video) {
      setUploadStatus("❌ Please select a video file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);

    try {
      setIsUploading(true);
      setUploadStatus("⏳ Uploading...");

      const response = await fetch("http://localhost:5001/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      console.log("✅ Upload Success:", data);
      setUploadStatus("✅ Upload Successful! Processing... 🏆");
    } catch (error) {
      console.error("❌ Error uploading video:", error.message);
      setUploadStatus("❌ Upload Failed: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const navigateToSoundPage = () => {
    window.location.href = "http://localhost:5004/sound";
  }

  return (
    <div className="p-4 h-screen flex flex-col bg-gray-100">
      {/* Navigation Buttons */}
      <div className="flex justify-end mb-4 space-x-4">


        <button
          onClick={navigateToSoundPage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          check animal sound
        </button>
        <button
          onClick={() => navigate("/visualization")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Visualization
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-rows-2 gap-4 h-full">
        {/* Live Feed + Upload Section */}
        <div className="row-span-1 grid grid-cols-2 gap-4">
          {/* Live Feed */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div>
              <h3 className="text-lg font-semibold">Live Video Feed</h3>
              <img
                src="http://127.0.0.1:5000/video_feed"
                alt="Live Feed"
                width="100%"
                style={{ border: "2px solid black", borderRadius: "8px" }}
              />
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-md p-4 border">
            <h3 className="text-lg font-semibold mb-2">Upload Video for Detection</h3>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="border p-2 rounded w-full bg-white"
            />
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className={`mt-2 px-4 py-2 text-white rounded transition w-full ${isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
            >
              {isUploading ? "Uploading..." : "Upload & Detect"}
            </button>
            {uploadStatus && <p className="mt-2 text-gray-700 font-medium">{uploadStatus}</p>}
          </div>
        </div>

        {/* Dashboard and Notifications */}
        <div className="row-span-1 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <Dashboard />
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <Notifications />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
