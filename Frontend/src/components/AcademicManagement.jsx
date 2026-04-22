import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { api } from "../api";

export default function AcademicManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [level, setLevel] = useState("PUC1");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [newSubject, setNewSubject] = useState({
    code: "",
    name: "",
    credits: 4,
    subject_type: "THEORY",
    exam_scheme: "MID20",
  });

  const [batch, setBatch] = useState("R27");
  const [semester, setSemester] = useState("Sem1");
  const [batches, setBatches] = useState([]);
  const [branch, setBranch] = useState("");

  // ---------------- FETCH ----------------
  const fetchSubjects = async () => {
    try {
      setLoading(true);

      const params = { level, semester, batch };
      if (!level.startsWith("PUC") && branch) params.branch = branch;

      const res = await api.get("/subjects/", { params });
      setSubjects(res.data);
    } catch (err) {
      console.error(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [level, semester, branch, batch]);

  const fetchBatches = async () => {
    try {
      const res = await api.get("/batches/");
      setBatches(res.data);
    } catch {
      console.error("Batch fetch failed");
    }
  };

  // ---------------- CREATE ----------------
  const handleCreateSubject = async () => {
    try {
      if (level.startsWith("E") && !branch) {
        alert("Select branch first");
        return;
      }

      const payload = {
        code: newSubject.code,
        name: newSubject.name,
        credits: Number(newSubject.credits),
        subject_type: newSubject.subject_type,
        exam_scheme:
          newSubject.subject_type === "THEORY"
            ? newSubject.exam_scheme
            : "NONE",

        level,
        semester,
        regulation: batch,
        branch: level.startsWith("E") ? branch : "",
      };

      console.log("CREATE:", payload);

      await api.post("/subjects/create/", payload);

      alert("Subject created");
      setShowModal(false);

      setNewSubject({
        code: "",
        name: "",
        credits: 4,
        subject_type: "THEORY",
        exam_scheme: "MID20",
      });

      fetchSubjects();
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.error || "Failed");
    }
  };

  // ---------------- INIT SEM ----------------
  const initializeSemester = async () => {
    try {
      await api.post("/semester/setup/", {
        batch_id: batch,
        semester,
      });

      alert("Semester initialized");
    } catch (err) {
      console.error(err.response?.data);

      // fallback
      try {
        await api.post("/semester/setup/", {
          batch,
          semester,
        });
        alert("Semester initialized");
      } catch {
        alert("Init failed");
      }
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete subject?")) return;
    await api.delete(`/subjects/delete/${id}/`);
    fetchSubjects();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 p-8">
        <div className="bg-white p-6 rounded-xl shadow-md">

          {/* HEADER */}
          <h1 className="text-2xl font-bold text-red-600">
            Academic Management
          </h1>
          <p className="text-gray-500 mb-6">
            Manage subjects and semester structure
          </p>

          {/* LEVEL */}
          <div className="flex gap-3 mb-6">
            {["PUC1", "PUC2", "E1", "E2", "E3", "E4"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`px-4 py-2 rounded border ${
                  level === lvl
                    ? "bg-red-100 text-red-600 border-red-500"
                    : "hover:bg-red-50"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* ACTION BAR */}
          <div className="flex justify-between mb-6">

            <button
              onClick={() => setShowModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              + Add Subject
            </button>

            <div className="flex gap-4">

              <select
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="border px-3 py-2 rounded"
              >
                {batches.map((b) => (
                  <option key={b.batch_id} value={b.batch_id}>
                    {b.batch_id}
                  </option>
                ))}
              </select>

              {!level.startsWith("PUC") && (
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="border px-3 py-2 rounded"
                >
                  <option value="">Branch</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                </select>
              )}

              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="border px-3 py-2 rounded"
              >
                <option value="Sem1">Semester 1</option>
                <option value="Sem2">Semester 2</option>
              </select>

              <button
                onClick={initializeSemester}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Initialize Semester
              </button>
            </div>
          </div>

          {/* TABLE */}
          <table className="w-full border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Code</th>
                <th className="p-2">Name</th>
                <th className="p-2">Credits</th>
                <th className="p-2">Type</th>
                <th className="p-2">Scheme</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {subjects.map((s) => (
                <tr key={s.id} className="border-b hover:bg-red-50">
                  <td className="p-2">{s.code}</td>
                  <td className="p-2">{s.name}</td>
                  <td className="p-2 text-center">{s.credits}</td>
                  <td className="p-2 text-center">{s.subject_type}</td>
                  <td className="p-2 text-center">{s.exam_scheme || "-"}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* MODAL */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
              <div className="bg-white p-6 rounded-xl w-96 shadow-lg">

                <h2 className="text-lg font-bold mb-4 text-red-600">
                  Add New Subject
                </h2>

                <input
                  placeholder="Subject Code"
                  className="w-full border p-2 mb-3 rounded"
                  value={newSubject.code}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, code: e.target.value })
                  }
                />

                <input
                  placeholder="Subject Name"
                  className="w-full border p-2 mb-3 rounded"
                  value={newSubject.name}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, name: e.target.value })
                  }
                />

                <input
                  type="number"
                  placeholder="Credits"
                  className="w-full border p-2 mb-3 rounded"
                  value={newSubject.credits}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, credits: e.target.value })
                  }
                />

                {/* SUBJECT TYPE */}
                <select
                  className="w-full border p-2 mb-3 rounded"
                  value={newSubject.subject_type}
                  onChange={(e) =>
                    setNewSubject({
                      ...newSubject,
                      subject_type: e.target.value,
                    })
                  }
                >
                  <option value="THEORY">Theory</option>
                  <option value="LAB">Lab</option>
                  <option value="PROJECT">Project</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="ELECTIVE">Elective</option>
                </select>

                {/* SCHEME */}
                {newSubject.subject_type === "THEORY" && (
                  <select
                    className="w-full border p-2 mb-3 rounded"
                    value={newSubject.exam_scheme}
                    onChange={(e) =>
                      setNewSubject({
                        ...newSubject,
                        exam_scheme: e.target.value,
                      })
                    }
                  >
                    <option value="MID20">Mid 20 (Best of 2)</option>
                    <option value="MID15_AT4">Mid 15 + AT</option>
                    <option value="MID40">Mid 40 (Best of 2 Avg)</option>
                    <option value="ZERO_CREDIT">
                      Zero Credit (Only EST 100)
                    </option>
                  </select>
                )}

                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowModal(false)}>Cancel</button>

                  <button
                    onClick={handleCreateSubject}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}