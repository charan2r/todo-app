import React from "react";

const Welcome = () => {
  return (
    <div className="bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1
          className="text-5xl font-bold mb-8 text-white"
          style={{
            textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
            animation: "fadeInDown 1s ease-out",
          }}
        >
          Welcome to ToDo Manager
        </h1>
        <div className="flex justify-center space-x-4">
          <a
            href="/login"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded btn"
          >
            <i className="fas fa-sign-in-alt"></i> Login
          </a>
          <a
            href="/register"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded btn"
          >
            <i className="fas fa-user-plus"></i> Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
