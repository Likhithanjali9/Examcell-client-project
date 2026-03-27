import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

import {
  FileText,
  Edit,
  Search,
  BarChart2,
  Folder,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  GraduationCap,
  Layers,
  Settings,
} from "lucide-react";

const StudentSearch = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);

  const [studentId, setStudentId] = useState("");
  const [batch, setBatch] = useState("All Batches");
  const [section, setSection] = useState("All Sections");
  const [branch, setBranch] = useState("All Branches");

  const batches = [
    "All Batches",
    "R25",
    "R24",
    "R23",
    "R22",
    "R21",
    "R20",
    "R19",
    "R18",
    "R17",
    "R16",
    "R15",
    "R14",
    "R13",
    "R12",
    "R11",
  ];

  const sections = [
    "All Sections",
    "PUC1",
    "PUC2",
    "Engg1",
    "Engg2",
    "Engg3",
    "Engg4",
  ];

  const branches = [
    "All Branches",
    "MPC",
    "BiPC",
    "CEC",
    "CSE",
    "ECE",
    "ME",
    "CE",
    "MME",
    "Chemical",
    "AI",
  ];

  const handleSearch = () => {
    console.log("Search Parameters:");
    console.log("Student ID/Name:", studentId);
    console.log("Batch:", batch);
    console.log("Section:", section);
    console.log("Branch:", branch);
    alert(
      `Searching for: ${studentId || "All Students"}\nBatch: ${batch}\nSection: ${section}\nBranch: ${branch}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <div className="flex mt-2">
        {/* Sidebar */}
        <div className="flex mt-2">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>


        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="bg-white border p-6 flex justify-between items-center shadow-sm rounded-lg">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Search</h1>
              <p className="text-sm text-gray-500 mt-1">
                Search and filter students by ID, batch, section, or branch.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-sm text-gray-500">{new Date().toLocaleDateString()}</div>

              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 rounded hover:bg-gray-100 text-gray-600"
                >
                  <Bell size={20} />
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border shadow-lg rounded-lg p-4 text-sm z-40">
                    <p className="text-gray-600">No new notifications</p>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setProfileMenu(!profileMenu)}
                  className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                >
                  <User size={20} className="text-gray-600" />
                </button>
                {profileMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 text-sm z-50">
                    <Link to="/coe-dashboard" className="block px-4 py-2 hover:bg-gray-100">
                      Dashboard
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link
                      to="/logout"
                      className="block px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Filters */}
          <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8 border-t-4 border-red-700 mt-6">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
              <GraduationCap size={28} className="text-red-700" />
              <h1 className="text-3xl font-semibold text-red-800 tracking-wide">
                Student Search
              </h1>
            </div>
            <p className="text-gray-600 mb-8 text-sm">
              Quickly find students by their ID, name, or academic details.
            </p>

            {/* Search Input */}
            <div className="relative mb-6">
              <User
                size={20}
                className="absolute left-3 top-3 text-gray-500 pointer-events-none"
              />
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter Student ID (e.g., R25001) or Name..."
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Batch */}
              <div>
                <label className="flex items-center text-gray-700 font-medium mb-2">
                  <Layers size={18} className="text-red-700 mr-2" /> Batch (Optional)
                </label>
                <select
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-600 focus:outline-none"
                >
                  {batches.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section */}
              <div>
                <label className="flex items-center text-gray-700 font-medium mb-2">
                  <Settings size={18} className="text-red-700 mr-2" /> Section (Optional)
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-600 focus:outline-none"
                >
                  {sections.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Branch */}
              <div>
                <label className="flex items-center text-gray-700 font-medium mb-2">
                  <Settings size={18} className="text-red-700 mr-2" /> Branch (Optional)
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-600 focus:outline-none"
                >
                  {branches.map((br) => (
                    <option key={br} value={br}>
                      {br}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-end mt-8">
              <button
                onClick={handleSearch}
                className="flex items-center bg-red-700 hover:bg-red-800 text-white px-6 py-2.5 rounded-lg transition-all shadow-md"
              >
                <Search size={18} className="mr-2" /> Search
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentSearch;