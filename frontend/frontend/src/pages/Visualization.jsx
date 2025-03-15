import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid } from "recharts";

const initialData = [
  { name: "Human Intrusions", value: 40 },
  { name: "Animal Intrusions", value: 30 },
  { name: "Vehicle Intrusions", value: 20 },
  { name: "Other", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Simulated data for Bar Chart (hourly intrusions)
const barChartData = [
  { hour: "00:00", intrusions: 5 },
  { hour: "01:00", intrusions: 8 },
  { hour: "02:00", intrusions: 6 },
  { hour: "03:00", intrusions: 12 },
  { hour: "04:00", intrusions: 15 },
  { hour: "05:00", intrusions: 20 },
];

// Simulated data for Line Chart (daily trends)
const lineChartData = [
  { day: "Monday", intrusions: 50 },
  { day: "Tuesday", intrusions: 40 },
  { day: "Wednesday", intrusions: 60 },
  { day: "Thursday", intrusions: 30 },
  { day: "Friday", intrusions: 70 },
  { day: "Saturday", intrusions: 80 },
  { day: "Sunday", intrusions: 90 },
];

export default function Visualization() {
  const [data, setData] = useState(initialData);

  // Simulate dynamic data updates based on LiveFeed analysis
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedData = data.map((item) => ({
        ...item,
        value: Math.floor(Math.random() * 50) + 10, // Simulated dynamic data
      }));
      setData(updatedData);
    }, 5000); // Update every 5 seconds (for demo purposes)

    return () => clearInterval(interval);
  }, [data]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
      {/* Pie Chart Section */}
      <div>
        <h2 className="text-lg font-bold mb-4">Intrusion Distribution</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div>
        <h2 className="text-lg font-bold mb-4">Hourly Intrusion Frequency</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={barChartData}>
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="intrusions" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart Section */}
      <div>
        <h2 className="text-lg font-bold mb-4">Weekly Intrusion Trends</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="intrusions" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-2">Summary</h2>
        <p>Total Intrusions: {data.reduce((acc, item) => acc + item.value, 0)}</p>
        <p>
          Highest Intrusion Type:{" "}
          {
            data.reduce((max, item) =>
              item.value > max.value ? item : max
            ).name
          }
        </p>
      </div>
    </div>
  );
}
