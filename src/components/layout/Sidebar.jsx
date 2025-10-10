"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaUser,
  FaUserFriends,
  FaPhoneAlt,
  FaFileAlt,
  FaCoins,
  FaUsers,
  FaBell,
  FaRupeeSign,
  FaChevronDown,
  FaChevronRight,
  FaBars,
  FaTimes,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
} from "react-icons/fa";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Dashboard");

  // Enhanced menu items with better organization and icons
  const menuItems = [
    {
      category: "Dashboard",
      items: [{ path: "/", icon: <FaHome size={20} />, label: "Dashboard" }],
    },
    {
      category: "User Management",
      items: [
        {
          path: "/profile",
          icon: <FaUser size={20} />,
          label: "My Profile",
        },
        { path: "/user", icon: <FaUsers size={20} />, label: "All Users" },
        {
          path: "/blocked-users",
          icon: <FaUser size={20} />,
          label: "Blocked Users",
        },
        {
          path: "/banned-users",
          icon: <FaUser size={20} />,
          label: "Banned Users",
        },
      ],
    },
    {
      category: "Team Management",
      items: [
        {
          path: "/executive",
          icon: <FaUserFriends size={20} />,
          label: "Executives",
        },
        { path: "/managers", icon: <FaUser size={20} />, label: "Managers" },
      ],
    },
    {
      category: "Operations",
      items: [
        {
          path: "/call",
          icon: <FaPhoneAlt size={20} />,
          label: "Call Logs",
        },
        { path: "/referral", icon: <FaUser size={20} />, label: "Referrals" },
        { path: "/review", icon: <FaFileAlt size={20} />, label: "Reviews" },
        { path: "/reports", icon: <FaFileAlt size={20} />, label: "Reports" },
      ],
    },
    {
      category: "Financial",
      items: [
        {
          path: "/coinconversion",
          icon: <FaCoins size={20} />,
          label: "Coin Conversion",
        },
        { path: "/account", icon: <FaUsers size={20} />, label: "Accounts" },
        {
          path: "/plan",
          icon: <FaRupeeSign size={20} />,
          label: "Pricing Plans",
        },
      ],
    },
    {
      category: "System",
      items: [
        {
          path: "/activities",
          icon: <FaBell size={20} />,
          label: "Activities",
        },
        { path: "/category", icon: <FaCog size={20} />, label: "Categories" },
      ],
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  // Find active category based on current path
  useEffect(() => {
    const currentCategory = menuItems.find((section) =>
      section.items.some((item) => item.path === pathname)
    );
    if (currentCategory) {
      setActiveCategory(currentCategory.category);
    }
  }, [pathname]);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobile}
          className="p-3 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
        >
          {mobileOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:sticky top-0 left-0 
          h-screen z-50
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-20" : "w-72"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900
          border-r border-gray-700
          shadow-xl
          flex flex-col
  `}
      >
        {/* Header Section */}
        <div className="p-6 border-b border-gray-700 flex-shrink-0 relative h-28">
          {/* Sidebar toggle button */}
          <div className="absolute top-3 right-2 z-50">
            <button
              onClick={toggleSidebar}
              className="w-6 h-8 bg-gray-700 hover:bg-gray-600 rounded-l-md flex items-center justify-center transition-transform hidden lg:flex"
            >
              <FaChevronLeft
                size={16}
                className={`text-gray-300 transition-transform ${
                  isCollapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Logo and Brand */}
          <div className="absolute bottom-4 left-6 flex items-end space-x-3">
            <div className="w-12 h-11 bg-indigo-600 rounded-xl flex items-center justify-center -ml-2 shadow-lg">
              <span className="text-gray-100 font-bold text-xl">A</span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col justify-end">
                <h1 className="text-gray-100 font-semibold text-xl leading-tight">
                  Admin Portal
                </h1>
                <p className="text-gray-400 text-sm leading-tight">
                  Management Console
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-4">
          <div className="space-y-1">
            {menuItems.map((section, index) => (
              <div key={section.category} className="mb-2">
                {/* Category Header */}
                {!isCollapsed && (
                  <div className="px-3 py-2 mb-1">
                    <span className="text-xs uppercase font-medium text-gray-500 tracking-wide">
                      {section.category}
                    </span>
                  </div>
                )}

                {/* Menu Items */}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`
                    w-full flex items-center p-3 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? "bg-indigo-600 text-gray-100 shadow-md"
                        : "text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                    }
                    ${isCollapsed ? "justify-center" : "justify-start"}
                  `}
                        onClick={() => setMobileOpen(false)}
                        title={isCollapsed ? item.label : ""}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`flex-shrink-0 ${
                              isActive ? "text-gray-100" : "text-gray-400"
                            }`}
                          >
                            {item.icon}
                          </div>
                          {!isCollapsed && (
                            <span className="font-medium">{item.label}</span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {!isCollapsed && index < menuItems.length - 1 && (
                  <div className="h-px bg-gray-700 mx-2 my-3"></div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 flex-shrink-0">
          <button
            className={`
        w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
        text-gray-300 hover:bg-red-600 hover:text-gray-100
        ${isCollapsed ? "justify-center" : ""}
      `}
            title={isCollapsed ? "Logout" : ""}
          >
            <FaSignOutAlt size={20} />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}
