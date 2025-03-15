import { useState, useEffect } from "react";

export default function Alert({ type, message, timestamp }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Automatically hide the alert after 5 seconds
    const timer = setTimeout(() => setIsVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  // Define alert styles based on the type
  const alertStyles = {
    success: "bg-green-100 text-green-800 border-green-500",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-500",
    error: "bg-red-100 text-red-800 border-red-500",
  };

  return (
    <div
      className={`border-l-4 p-4 rounded-md shadow-md my-4 ${
        alertStyles[type] || alertStyles["warning"]
      }`}
    >
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">{message}</p>
        <span className="text-xs text-gray-500">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
