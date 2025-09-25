"use client";
import React, { useState } from "react";
import {
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaUserCircle,
} from "react-icons/fa";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="w-full h-16 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left Section - Logo and Brand */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <div>
            <span className="text-xl font-bold text-slate-800">TalkEasy</span>
            <p className="text-xs text-emerald-600 font-medium -mt-0.5 hidden sm:block">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Center Section - Page Title */}
      <div className="hidden md:flex flex-1 justify-center">
        <div className="text-center">
          <h1 className="text-lg font-medium text-slate-700">Dashboard</h1>
          <p className="text-xs text-slate-500">Welcome back, John</p>
        </div>
      </div>

      {/* Right Section - Enhanced Profile */}
      <div className="flex items-center">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 px-4 py-2 hover:bg-slate-50 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-200"
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-800">John Admin</p>
              <p className="text-xs text-emerald-600 font-medium">Administrator</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center border-2 border-white shadow-md">
              <FaUserCircle className="h-5 w-5 text-slate-600" />
            </div>
            <FaChevronDown
              className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Enhanced Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    <FaUserCircle className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">John Admin</p>
                    <p className="text-xs text-slate-500">john@talkeasy.com</p>
                    <span className="inline-block mt-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                      Administrator
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="py-1">
                <button className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-3 transition-colors rounded-lg mx-2">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <FaUser className="h-4 w-4 text-slate-500" />
                  </div>
                  <span className="font-medium">My Profile</span>
                </button>
                
                <button className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-3 transition-colors rounded-lg mx-2">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <FaCog className="h-4 w-4 text-slate-500" />
                  </div>
                  <span className="font-medium">Account Settings</span>
                </button>
              </div>
              
              <div className="border-t border-slate-100 py-1 mt-2">
                <button className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors rounded-lg mx-2">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <FaSignOutAlt className="h-4 w-4 text-red-500" />
                  </div>
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside handler */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </header>
  );
}