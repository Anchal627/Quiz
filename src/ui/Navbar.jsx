import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">
            Quiz App
          </Link>
          <div className="space-x-4 text-xl">
            <Link to="/" className="hover:text-gray-200">
              Take Quiz
            </Link>
            <Link to="/history" className="hover:text-gray-200">
              History
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
