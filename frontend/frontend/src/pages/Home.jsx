import React from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import LiveFeed from "../components/LiveFeed";
import Notifications from "../components/Notifications";

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate

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
        <div className="row-span-1 bg-white rounded-lg shadow-md">
          <LiveFeed />
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
