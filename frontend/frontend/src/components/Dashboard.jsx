import React from "react";
import { FaExclamationTriangle, FaWifi, FaClock } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="p-6 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-extrabold mb-6 text-gray-800 text-center">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Alerts */}
        <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transform hover:scale-105 transition duration-300">
          <FaExclamationTriangle className="text-4xl text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Active Alerts
          </h3>
          <p className="text-3xl font-bold text-red-500">5</p>
        </div>

        {/* Sensors Online */}
        <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transform hover:scale-105 transition duration-300">
          <FaWifi className="text-4xl text-green-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Sensors Online
          </h3>
          <p className="text-3xl font-bold text-green-500">8</p>
        </div>

        {/* System Uptime */}
        <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transform hover:scale-105 transition duration-300">
          <FaClock className="text-4xl text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            System Uptime
          </h3>
          <p className="text-3xl font-bold text-blue-500">99.9%</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
