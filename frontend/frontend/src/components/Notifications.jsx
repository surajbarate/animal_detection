import React from "react";

const Notifications = () => {
  const alerts = [
    { id: 1, type: "Human", timestamp: "2025-03-15 10:15:00" },
    { id: 2, type: "Vehicle", timestamp: "2025-03-15 10:20:00" },
  ];

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Recent Alerts</h2>
      <ul>
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className="mb-2 p-2 bg-white rounded-lg shadow-md flex justify-between"
          >
            <span>{alert.type}</span>
            <span className="text-gray-500">{alert.timestamp}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
