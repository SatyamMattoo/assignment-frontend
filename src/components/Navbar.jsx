import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="h-20 w-full bg-gray-200">
      <div className="container mx-auto h-full">
        <div className="flex justify-center items-center gap-8 h-full text-lg font-medium">
          <Link to="/" className="hover:text-blue-500 cursor-pointer">Home</Link>
          <Link to="/submissions" className="hover:text-blue-500 cursor-pointer">Submissions</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
