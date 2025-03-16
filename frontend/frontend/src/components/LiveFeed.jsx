import React from "react";

const LiveFeed = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold">Live Video Feed</h3>
      <img
        src="http://127.0.0.1:5000/video_feed"
        alt="Live Feed"
        width="100%"
        style={{ border: "2px solid black", borderRadius: "8px" }}
      />
    </div>
  );
};

export default LiveFeed;
