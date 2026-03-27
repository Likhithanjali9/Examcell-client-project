
import Sidebar from "./Sidebar";
import { api } from "../api";
import { useEffect } from "react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  CheckCircle,
  Edit,
  Search,
  BarChart2,
  Folder,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Layers,
  BookOpen
} from "lucide-react";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [role, setRole] = useState("coe");

  const [notifOpen, setNotifOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenu, setProfileMenu] = useState(false);
  const [modalSectionIdx, setModalSectionIdx] = useState(null);
  const [modalTab, setModalTab] = useState("overview");
  const [editMode, setEditMode] = useState(false);
  const [modalSectionData, setModalSectionData] = useState(null);
  //const role = localStorage.getItem("role");
  const email = localStorage.getItem("user_email");
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  //fetch the dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard/");
        setDashboardData(res.data);
        setRole(res.data.role);
      } catch (err) {
        console.error("Dashboard load failed", err);
      }
    };

    fetchDashboard();
    //notification 
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications/");
        setNotifications(res.data);
      } catch (err) {
        console.error("Notification load failed");
      }
    };

    fetchNotifications();
  }, []);

  const handleLogout = () => {
    // Perform logout logic here
    navigate("/",{replace:true});
  };

  const openSectionModal = (section) => {
    setModalSectionIdx(section.title);
    setEditMode(false);
    setModalTab("overview");
    setModalSectionData(section);
  };

  const closeModal = () => {
    setModalSectionIdx(null);
    setEditMode(false);
    setModalSectionData(null);
  };

  const handleSave = () => {
    setEditMode(false);
  };

  const activeSection = modalSectionIdx !== null ? modalSectionData : null;

  

  const recentActivities = [
    {
      title: "Marks updated for Mid1 exam",
      datetime: "2025-11-08T15:40:10",
    },
    {
      title: "Excel upload completed",
      datetime: "2025-11-08T14:20:54",
    },
    {
      title: "Marks entry session",
      datetime: "2025-11-08T13:45:00",
    },
    {
      title: "Bulk marks update",
      datetime: "2025-11-07T18:23:00",
    },
    {
      title: "Report generated",
      datetime: "2025-11-06T19:10:00",
    },
  ];

  function formatActivityDatetime(dateStr) {
    const opts = { weekday: "long", year: "numeric", month: "short", day: "2-digit" };
    const timeOpts = { hour: "2-digit", minute: "2-digit" };
    const d = new Date(dateStr);
    return `${d.toLocaleDateString("en-US", opts)}, ${d.toLocaleTimeString([], timeOpts)}`;
  }
  const formatRoleName = () => {
    if (role === "coe") return "COE Admin";

    if (role === "faculty") {
      const lowerEmail = email.toLowerCase();

      if (lowerEmail.includes("e1")) return "ENGG 1 Faculty";
      if (lowerEmail.includes("e2")) return "ENGG 2 Faculty";
      if (lowerEmail.includes("e3")) return "ENGG 3 Faculty";
      if (lowerEmail.includes("e4")) return "ENGG 4 Faculty";
      if (lowerEmail.includes("puc1")) return "PUC 1 Faculty";
      if (lowerEmail.includes("puc2")) return "PUC 2 Faculty";

      return "Faculty";
    }

    return "User";
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <div className="flex mt-2">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="bg-white border p-6 flex justify-between items-center shadow-sm rounded-lg">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {formatRoleName()} Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {role === "coe"
                  ? "You have full administrative access"
                  : "You have faculty-level access for your assigned level"}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 rounded hover:bg-gray-100 text-gray-600"
                >
                  <div className="relative">
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-1 rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </div>
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border shadow-lg rounded-lg p-4 text-sm z-40">
                    {notifications.length === 0 ? (
                          <p>No new notifications</p>
                        ) : (
                          notifications.map((n, idx) => (
                            <div key={idx} className="mb-2 border-b pb-2">
                              <p className="font-semibold">{n.title}</p>
                              <p className="text-xs">{n.message}</p>
                            </div>
                          ))
                        )}
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileMenu(!profileMenu)}
                  className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                >
                  <User size={20} className="text-gray-600" />
                </button>

                {profileMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 text-sm z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 mb-6">
            <StatCard
              title="Total Current Students"
              value={dashboardData?.stats.total_students ?? 0}
              icon={<Users />}
              change="Live Data"
              changeColor="text-green-600"
            />

            <StatCard
              title="Active Batches"
              value={dashboardData?.stats.active_batches ?? 0}
              icon={<Layers />}
              change="Current"
              changeColor="text-gray-600"
            />

            <StatCard
              title="Pending Marks"
              value={dashboardData?.stats.pending_marks ?? 0}
              icon={<FileText />}
              change="Live"
              changeColor="text-red-600"
            />

            <StatCard
              title="Completed Exams"
              value={`${dashboardData?.stats.completed_exams_percent ?? 0}%`}
              icon={<CheckCircle />}
              change="Auto Calculated"
              changeColor="text-green-600"
            />
          </div>

          {/* Quick Actions + Section Overview + Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Quick Actions & Section Overview */}
            <div className="col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <ActionButton
                    icon={<Edit />}
                    label="Marks Entry"
                    sub="Add or update marks"
                    onClick={() => navigate("/marks-entry")}
                  />
                  <ActionButton
                    icon={<Search />}
                    label="Search Student"
                    sub="Find student records"
                    onClick={() => navigate("/student-search")}
                  />
                  <ActionButton
                    icon={<BookOpen />}
                    label="Academic Management"
                    sub="Manage subjects & schemes"
                    onClick={() => navigate("/academic-management")}
                  />
                  <ActionButton
                    icon={<Folder />}
                    label="Batch Management"
                    sub="Handle class batches"
                    onClick={() => navigate("/batch-management")}
                  />
                </div>
              </div>

              {/* Section Overview */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="font-semibold text-lg mb-4">Section Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {dashboardData?.sections_overview?.map((section, idx) => (
                    <div key={section.title} className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                      onClick={() => openSectionModal(section)}
                    >
                      <h3 className="font-semibold text-lg">{section.title}</h3>
                      <p className="text-sm text-gray-500">{section.sub}</p>
                      <p className="text-xs text-red-600 mt-2">View Details &rarr;</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="font-semibold text-lg mb-4">Recent Activity</h2>
              <ul className="space-y-4 text-sm">
                {dashboardData?.recent_activity?.map((a, idx) => (
                  <ActivityItem
                    key={idx}
                    title={a.title}
                    datetime={a.datetime}
                  />
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>

      {/* Section Detail Modal */}
      {activeSection && (
        <SectionDetailModal
          section={activeSection}
          editMode={editMode}
          setEditMode={setEditMode}
          modalTab={modalTab}
          setModalTab={setModalTab}
          setModalSectionState={setModalSectionData}
          modalSectionState={modalSectionData}
          closeModal={closeModal}
          handleSave={handleSave}
        />
      )}
    </div>
  );
}

/* --- UI COMPONENTS --- */

function StatCard({ title, value, icon, change, changeColor }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <h3 className="text-2xl font-semibold">{value}</h3>
        <p className={`text-xs ${changeColor}`}>{change}</p>
      </div>
      <div className="text-gray-400 text-3xl">{icon}</div>
    </div>
  );
}

function ActionButton({ icon, label, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      className="border p-4 rounded-lg flex items-start gap-3 hover:bg-gray-100 transition w-full text-left"
    >
      <div className="text-red-600 text-xl">{icon}</div>
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-xs text-gray-500">{sub}</p>
      </div>
    </button>
  );
}

function ActivityItem({ title, datetime }) {
  function formatActivityDatetime(dateStr) {
    const opts = { weekday: "long", year: "numeric", month: "short", day: "2-digit" };
    const timeOpts = { hour: "2-digit", minute: "2-digit" };
    const d = new Date(dateStr);
    return `${d.toLocaleDateString("en-US", opts)}, ${d.toLocaleTimeString([], timeOpts)}`;
  }
  return (
    <li className="flex justify-between gap-8 items-center">
      <span className="font-medium">{title}</span>
      <span className="text-gray-500 text-xs">{formatActivityDatetime(datetime)}</span>
    </li>
  );
}

// Section Detail Modal as a separate reusable component

function SectionDetailModal({
  section,
  editMode,
  setEditMode,
  modalTab,
  setModalTab,
  setModalSectionState,
  modalSectionState,
  closeModal,
  handleSave,
}) {
  // You can add input editing logic here same as batch management modal.

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-20 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-red-600 rounded-t-xl px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-white mb-0 leading-tight">{section.title}</h2>
            <p className="text-sm text-white opacity-90">{section.sub}</p>
          </div>
          <button onClick={closeModal} className="text-white hover:text-red-200 ml-4">✕</button>
        </div>
        <div className="px-6 pt-4 pb-6">
          {/* Tabs */}
          <div className="flex gap-6 border-b mb-6">
            <button
              className={`pb-3 border-b-2 font-medium ${modalTab === "overview" ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent"}`}
              onClick={() => setModalTab("overview")}
            >
              Overview
            </button>
            <button
              className={`pb-3 border-b-2 font-medium ${modalTab === "students" ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent"}`}
              onClick={() => setModalTab("students")}
            >
              Students
            </button>
            <button
              className={`pb-3 border-b-2 font-medium ${modalTab === "performance" ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent"}`}
              onClick={() => setModalTab("performance")}
            >
              Performance
            </button>
          </div>

          {/* Tab Panels */}
          {modalTab === "overview" && (
            <div className="bg-gray-50 p-5 rounded-lg border">
              <p className="font-medium mb-3 text-gray-700">Section Summary</p>
              <div className="text-sm text-gray-700 mb-2">
                Name: <span className="font-semibold">{section.title}</span>
              </div>
              <div className="text-sm text-gray-700 mb-2">
                Description: <span className="font-semibold">{section.sub}</span>
              </div>
              {/* Add more overview info as needed */}
              {section.exam_progress && (
                <div className="mt-4 border-t pt-4">
                  <p className="font-semibold text-red-600">
                    Active Exam: {section.exam_progress.exam_type}
                  </p>
                  <p className="text-sm">
                    Completion: {section.exam_progress.completion_percent}%
                  </p>
                  <p className="text-sm text-gray-600">
                    Pending: {section.exam_progress.pending}
                  </p>
                </div>
              )}
            </div>
          )}

          {modalTab === "students" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {section.branch_distribution?.map((branch) => (
                <div
                  key={branch.name}
                  className="bg-gray-50 rounded-lg border p-5 text-center"
                >
                  <div className="font-medium text-lg text-gray-800">
                    {branch.name}
                  </div>
                  <div className="text-2xl font-bold text-red-600 mt-2">
                    {branch.students}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Completion: {branch.completion_percent}%
                  </div>
                </div>
              ))}
            </div>
          )}

          {modalTab === "performance" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-5 rounded-lg border">
                <p className="font-medium mb-3 text-gray-700">Performance Overview</p>
                {/* Fill with performance data if available */}
                <p>Coming soon...</p>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button onClick={closeModal} className="border px-5 py-2 rounded-md hover:bg-gray-100">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
