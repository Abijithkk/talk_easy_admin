"use client";
import React, { useState } from "react";
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
  const [expandedItems, setExpandedItems] = useState({
    Dashboard: true, // Keep dashboard expanded by default
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  // Enhanced menu items with better organization and icons
  const menuItems = [
    {
      category: "Dashboard",
      items: [{ path: "/", icon: <FaHome />, label: "Dashboard" }],
    },
    {
      category: "User Management",
      items: [
        { path: "/admin-profile", icon: <FaUser />, label: "My Profile" },
        { path: "/userslist", icon: <FaUsers />, label: "All Users" },
        { path: "/blocked-users", icon: <FaUser />, label: "Blocked Users" },
        { path: "/banned-users", icon: <FaUser />, label: "Banned Users" },
      ],
    },
    {
      category: "Team Management",
      items: [
        { path: "/executive", icon: <FaUserFriends />, label: "Executives" },
        { path: "/managers", icon: <FaUser />, label: "Managers" },
      ],
    },
    {
      category: "Operations",
      items: [
        { path: "/allcalls", icon: <FaPhoneAlt />, label: "Call Logs" },
        { path: "/referral", icon: <FaUser />, label: "Referrals" },
        { path: "/review", icon: <FaFileAlt />, label: "Reviews" },
        { path: "/reports", icon: <FaFileAlt />, label: "Reports" },
      ],
    },
    {
      category: "Financial",
      items: [
        {
          path: "/coinconversion",
          icon: <FaCoins />,
          label: "Coin Conversion",
        },
        { path: "/account", icon: <FaUsers />, label: "Accounts" },
        { path: "/pricing", icon: <FaRupeeSign />, label: "Pricing Plans" },
      ],
    },
    {
      category: "System",
      items: [
        { path: "/activities", icon: <FaBell />, label: "Activities" },
        { path: "/category", icon: <FaCog />, label: "Categories" },
      ],
    },
  ];

  const toggleCategory = (category) => {
    setExpandedItems((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Mobile menu button with refined styling */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobile}
          className="p-3 rounded-lg bg-white shadow-sm border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
        >
          {mobileOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
        </button>
      </div>

      {/* Refined overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900 bg-opacity-20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* Professional Sidebar */}
      <div
        className={`
        fixed lg:sticky top-0 left-0 
        h-screen z-50
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-16" : "w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        bg-slate-900
        border-r border-slate-800
        shadow-2xl lg:shadow-none
        flex flex-col
      `}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <h1 className="text-base font-semibold text-white">
                  Admin Portal
                </h1>
                <p className="text-xs text-slate-400">Management Console</p>
              </div>
            </div>
          )}
          {/* {isCollapsed && (
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">A</span>
            </div>
          )} */}
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors hidden lg:flex"
          >
            {isCollapsed ? (
              <FaChevronRight size={12} />
            ) : (
              <FaChevronLeft size={12} />
            )}
          </button>
        </div>

        {/* Enhanced Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {menuItems.map((section, index) => (
            <div key={index} className="mb-4">
              {!isCollapsed && (
                <button
                  className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-slate-800 rounded-md transition-colors group"
                  onClick={() => toggleCategory(section.category)}
                >
                  <span className="text-xs uppercase font-medium text-slate-400 tracking-wide group-hover:text-slate-300">
                    {section.category}
                  </span>
                  <div className="text-slate-500 group-hover:text-slate-400">
                    {expandedItems[section.category] ? (
                      <FaChevronDown size={10} />
                    ) : (
                      <FaChevronRight size={10} />
                    )}
                  </div>
                </button>
              )}

              <ul
                className={`mt-1 space-y-0.5 ${
                  isCollapsed
                    ? ""
                    : expandedItems[section.category]
                    ? "block"
                    : "hidden"
                }`}
              >
                {section.items.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={`
                          group flex items-center rounded-md py-2.5 px-3 transition-all duration-200
                          ${
                            isActive
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white"
                          }
                          ${isCollapsed ? "justify-center" : ""}
                        `}
                        onClick={() => setMobileOpen(false)}
                        title={isCollapsed ? item.label : ""}
                      >
                        <div className="flex items-center min-w-0">
                          <span
                            className={`
                            flex-shrink-0 text-base
                            ${
                              isActive
                                ? "text-white"
                                : "text-slate-400 group-hover:text-slate-200"
                            }
                          `}
                          >
                            {item.icon}
                          </span>
                          {!isCollapsed && (
                            <span className="ml-3 font-medium truncate text-sm">
                              {item.label}
                            </span>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Subtle separator between sections */}
              {!isCollapsed && index < menuItems.length - 1 && (
                <div className="h-px bg-slate-800 mx-3 mt-3"></div>
              )}
            </div>
          ))}
        </nav>

        {/* Professional Footer */}
        <div className="p-3 border-t border-slate-800">
          <button 
            className={`
              w-full flex items-center py-2.5 px-3 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors
              ${isCollapsed ? "justify-center" : ""}
            `}
            title={isCollapsed ? "Logout" : ""}
          >
            <FaSignOutAlt className={isCollapsed ? "" : "mr-3"} />
            {!isCollapsed && "Logout"}
          </button>
        </div>
      </div>
    </>
  );
}