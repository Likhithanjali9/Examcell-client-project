import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { api } from "../api";

export default function Reports() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/analytics-dashboard/");
      setData(res.data);
    } catch (err) {
      console.error("Analytics load failed", err);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Analytics Reports</h1>

        {/* Batch Level */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="font-semibold mb-4">Batch Completion</h2>
          {data?.batch_level?.map((b) => (
            <div key={b.batch_id} className="mb-3 border-b pb-2">
              <p><strong>{b.batch_id}</strong> ({b.level})</p>
              <p>Completion: {b.overall_completion_percent}%</p>
            </div>
          ))}
        </div>

        {/* Subject Level */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold mb-4">Subject Completion</h2>
          {data?.subject_level?.map((s, idx) => (
            <div key={idx} className="mb-2 text-sm">
              {s.batch_id} - {s.semester} - {s.subject_name} → {s.completion_percent}%
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}