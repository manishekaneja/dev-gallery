import React from "react";

const Header = () => {
  return (
    <div className="py-10">
      <h1 className="text-4xl font-medium text-center">
        Welcome to{" "}
        <span className="font-extrabold bg-gray-700 px-4 py-2 text-4xl inlline-block">
          <span className="text-red-300">D</span>
          <span className="text-blue-300">E</span>
          <span className="text-yellow-300">V</span>
        </span>{" "}
        Gallery
      </h1>
    </div>
  );
};

export default Header;
