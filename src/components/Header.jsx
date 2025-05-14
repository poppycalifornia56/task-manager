import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { isAuthenticated } = useAuth();

  const navItems = [
    { name: "Home", targetId: isHomePage ? "addTaskSection" : null, path: "/" },
    { name: "About", path: "/about" },
  ];

  const authItems = isAuthenticated
    ? [
        { name: "My Dashboard", path: "/dashboard" },
        { name: "View Analytics", path: "/analytics", disabled: true },
      ]
    : [
        { name: "Login", path: "/login" },
        { name: "Sign Up", path: "/signup" },
      ];

  const scrollToSection = (targetId, e) => {
    e.preventDefault();

    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
        duration: 1000,
      });
    }
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = (item, e) => {
    if (isHomePage && item.targetId) {
      scrollToSection(item.targetId, e);
    } else {
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Clearday
            </Link>
          </div>

          <nav className="hidden md:flex md:justify-between md:flex-1">
            <ul className="flex space-x-8 ml-10">
              {navItems.map((item) => (
                <li key={item.name}>
                  {isHomePage && item.targetId ? (
                    <a
                      href={`#${item.targetId}`}
                      onClick={(e) => scrollToSection(item.targetId, e)}
                      className="text-gray-600 hover:text-blue-500 transition-colors duration-200"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      className="text-gray-600 hover:text-blue-500 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <ul className="flex space-x-8">
              {authItems.map((item) => (
                <li key={item.name}>
                  {item.disabled ? (
                    <span className="text-gray-400 cursor-not-allowed">
                      {item.name}
                    </span>
                  ) : (
                    <Link
                      to={item.path}
                      className={`transition-colors duration-200 ${
                        item.name === "Sign Up"
                          ? "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                          : "text-gray-600 hover:text-blue-500"
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:hidden">
            <button
              className="p-2 text-gray-600 hover:text-blue-500 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg">
            <ul className="py-2">
              {navItems.map((item) => (
                <li key={item.name} className="px-4 py-2">
                  {isHomePage && item.targetId ? (
                    <a
                      href={`#${item.targetId}`}
                      onClick={(e) => handleNavClick(item, e)}
                      className="block text-gray-600 hover:text-blue-500 transition-colors duration-200"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      className="block text-gray-600 hover:text-blue-500 transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}

              {authItems.map((item) => (
                <li key={item.name} className="px-4 py-2">
                  {item.disabled ? (
                    <span className="block text-gray-400 cursor-not-allowed">
                      {item.name}
                    </span>
                  ) : (
                    <Link
                      to={item.path}
                      className="block text-gray-600 hover:text-blue-500 transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
