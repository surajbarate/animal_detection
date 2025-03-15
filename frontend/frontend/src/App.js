import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Alerts from "./pages/Alerts";
import Visualization from "./pages/Visualization";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-xl font-bold">Real-Time Surveillance System</h1>
        </header>

        {/* Main Content */}
        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/visualization" element={<Visualization />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white p-4 text-center">
          &copy; {new Date().getFullYear()} Real-Time Surveillance System
        </footer>
      </div>
    </Router>
  );
}

export default App;
