import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Sidebar from "../components/Sidebar";

export default function CertificatePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [step, setStep] = useState(1);
  const [studentId, setStudentId] = useState("");
  const [type, setType] = useState("Engineering");
  const [student, setStudent] = useState(null);
  const [image, setImage] = useState(null);
  const [certType, setCertType] = useState("");
  const [loading, setLoading] = useState(false);

  const certificateRef = useRef();

    const fetchStudent = async () => {
    setLoading(true);
    setTimeout(() => {
      setStudent({
        name: "BAYANABOINA LIKHITHANJALI",
        fatherName: "BAYANABOINA PRATHAP",
        id: studentId || "0170773",
        branch: "COMPUTER SCIENCE AND ENGINEERING",
        completionDate: "May-2026",
        cgpa: "9.74",
        class: "First Class with Distinction",
        serialNo: "24004000",

        // ✅ MULTI SEM DATA
        semesters: [
          {
            sem: "Semester 1",
            sgpa: "9.5",
            subjects: [
              { code: "MA1101", title: "Engineering Mathematics-I", credits: 4, grade: "Ex" },
              { code: "PH1102", title: "Physics", credits: 3, grade: "A" },
            ],
          },
          {
            sem: "Semester 2",
            sgpa: "9.7",
            subjects: [
              { code: "CS1201", title: "Programming in C", credits: 4, grade: "Ex" },
              { code: "EE1202", title: "Basic Electrical", credits: 3, grade: "A" },
            ],
          },
          {
            sem: "Semester 3",
            sgpa: "9.8",
            subjects: [
              { code: "CS2101", title: "Data Structures", credits: 4, grade: "Ex" },
              { code: "MA2102", title: "Discrete Math", credits: 3, grade: "A+" },
            ],
          },
          {
            sem: "Semester 4",
            sgpa: "9.9",
            subjects: [
              { code: "CS2201", title: "DBMS", credits: 4, grade: "Ex" },
              { code: "CS2202", title: "Operating Systems", credits: 3, grade: "A+" },
            ],
          },
        ],
      });

      setLoading(false);
      setStep(2);
    }, 1000);
  };


  const handleNext = () => setStep(3);
  const handleBack = () => setStep(step - 1);

  const handleImageUpload = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const generatePDF = async () => {
    const canvas = await html2canvas(certificateRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`${student.id}_${certType}.pdf`);
  };

  const certOptions = [
    {
      key: "CMM",
      title: "Consolidated Marks Memo",
      desc: "Complete marks statement for all semesters",
    },
    {
      key: "PC",
      title: "Provisional Certificate",
      desc: "Temporary certificate with photo",
    },
    {
      key: "OD",
      title: "Original Degree",
      desc: "Official university degree certificate",
    },
  ];
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 p-6 overflow-y-auto">

        {/* STEP INDICATOR */}
        <div className="flex items-center gap-6 mb-6 text-[#991b1b] font-medium">
          {["Search ---->", "Type ---->", "Preview"].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step === i + 1 ? "bg-[#991b1b] text-white" : "bg-gray-300"}`}>
                {i + 1}
              </div>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto">

          {step > 1 && (
            <button onClick={handleBack} className="mb-4 text-[#991b1b] hover:underline">
              ← Back
            </button>
          )}

          {/* STEP 1 */}
          {/* STEP 1 */}
          {step === 1 && (
            <div className="bg-white p-6 rounded-xl shadow">

              <h2 className="font-semibold mb-4 text-[#991b1b]">
                Select Course Type
              </h2>

              <div className="flex gap-6 mb-4">
                <label>
                  <input
                    type="radio"
                    value="PUC"
                    checked={type === "PUC"}
                    onChange={(e) => setType(e.target.value)}
                  />{" "}
                  PUC
                </label>

                <label>
                  <input
                    type="radio"
                    value="Engineering"
                    checked={type === "Engineering"}
                    onChange={(e) => setType(e.target.value)}
                  />{" "}
                  BTech
                </label>
              </div>

              <input
                type="text"
                placeholder="Enter Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="border p-2 w-full mb-4"
              />

              <button
                onClick={fetchStudent}
                className="bg-[#991b1b] text-white px-4 py-2 rounded"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          )}
          {/* STEP 2 */}
          {step === 2 && (
            <div className="bg-white p-6 rounded-xl shadow">

              <div className="bg-gray-100 p-4 rounded mb-6">
                <p><b>Name:</b> {student.name}</p>
                <p><b>ID:</b> {student.id}</p>
                <p><b>Branch:</b> {student.branch}</p>
                <p><b>Type:</b> {type}</p>
              </div>

              <h2 className="font-bold mb-4 text-[#991b1b]">
                Choose Certificate Type
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                {certOptions.map((cert) => {
                  const disabled = type === "PUC" && cert.key !== "CMM";

                  return (
                    <div
                      key={cert.key}
                      onClick={() => !disabled && setCertType(cert.key)}
                      className={`p-4 border rounded-xl cursor-pointer transition
                      ${certType === cert.key ? "border-[#991b1b] bg-red-50" : ""}
                      ${disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}
                      `}
                    >
                      <h3 className="font-semibold">{cert.title}</h3>
                      <p className="text-sm text-gray-600">{cert.desc}</p>
                    </div>
                  );
                })}
              </div>

              {certType === "PC" && (
                <input type="file" onChange={handleImageUpload} className="mt-4" />
              )}

              <button
                onClick={handleNext}
                disabled={!certType}
                className="bg-[#991b1b] text-white px-4 py-2 rounded mt-6 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

{step === 3 && (
            <div className="flex flex-col items-center">
              <button onClick={generatePDF} className="bg-red-700 text-white px-8 py-3 rounded-full font-bold mb-6 shadow-lg hover:bg-green-800">
                Download Official PDF
              </button>

              <div
                ref={certificateRef}
                className="bg-white shadow-2xl relative"
                style={{
                  width: "210mm",
                  height: "297mm",
                  padding: "15mm",
                  fontFamily: "'Times New Roman', serif",
                  color: "#000"
                }}
              >
                {/* Double Border [cite: 3, 34, 52] */}
                <div className="absolute inset-4 border-[6px] border-double border-[#991b1b]" />

                {/* HEADER SECTION [cite: 3, 4, 12, 34, 52, 57] */}
                <div className="relative z-10 text-center">
                  <p className="text-xs font-bold text-right pr-4">S.No. {student.serialNo}</p>
                  <div className="flex justify-center items-center gap-4 mt-2">
                    <div className="w-24 h-24 bg-red-800 flex items-center justify-center rounded-full text-white text-xs text-center font-bold">
                       RGUKT 
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-[#991b1b] leading-tight">
                        Rajiv Gandhi University of Knowledge Technologies
                      </h1>
                      <h2 className="text-lg font-semibold">Andhra Pradesh</h2>
                      <p className="text-[10px] italic">(Established through Act 18 of 2008, Andhra Pradesh)</p>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-6">
                   <h3 className="text-xl font-bold underline tracking-widest uppercase">
                    {certOptions.find(c => c.key === certType)?.title}
                   </h3>
                </div>

                {/* PROVISIONAL CERTIFICATE CONTENT [cite: 93, 94, 96, 100, 102, 105, 110] */}
                {certType === "PC" && (
                  <div className="mt-10 px-11 text-lg leading-[2.5rem]">
                    {image && (
                      <div className="absolute top-48 right-20 border-2 border-black w-25 h-40">
                         <img src={image} className="w-full h-full object-cover" alt="Student" />
                      </div>
                    )}
                    <p>This is to certify that Ms. / Mr. <b>{student.name}</b></p>
                    <p>son / daughter of Smt. / Sri <b>{student.fatherName}</b></p>
                    <p>is qualified for the award of the degree of <b>{student.degree || "Bachelor of Technology"}</b></p>
                    <p>in <b>{student.branch}</b> of this university for having passed the prescribed</p>
                    <p>examination held during <b>{student.completionDate}</b> with <b>{student.class}</b>.</p>
                    <p className="mt-10">The Degree will be conferred on him / her at the next Convocation or thereafter.</p>

                    <div className="flex justify-between mt-40 font-bold">
                      <div className="text-left">
                        <p>Place: R. K. Valley</p>
                        <p>Date: {new Date().toLocaleDateString('en-GB')}</p>
                      </div>
                      <div className="text-center">
                        <p className="mb-10 text-sm italic">(Official Seal)</p>
                        <p>DIRECTOR</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* CONSOLIDATED STATEMENT CONTENT [cite: 58, 64, 84, 85, 86] */}
                {certType === "CMM" && (
                  <div className="mt-6 px-4">
                    <div className="grid grid-cols-2 text-sm mb-4 border-b pb-2">
                      <p><b>Name:</b> {student.name}</p>
                      <p className="text-right"><b>Roll No:</b> {student.id}</p>
                      <p><b>Course:</b> B.Tech</p>
                      <p className="text-right"><b>Major:</b> {student.branch}</p>
                    </div>

                    <table className="w-full border-collapse border border-black text-[10px]">
                      <thead className="bg-gray-100 uppercase">
                        <tr>
                          <th className="border border-black p-1">Code</th>
                          <th className="border border-black p-1">Subject Title</th>
                          <th className="border border-black p-1">Cr.</th>
                          <th className="border border-black p-1">Gr.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Example rows based on document [cite: 64] */}
                        <tr>
                          <td className="border border-black p-1 text-center">MA1101</td>
                          <td className="border border-black p-1">Engineering Mathematics-I</td>
                          <td className="border border-black p-1 text-center">4.0</td>
                          <td className="border border-black p-1 text-center">Ex</td>
                        </tr>
                        <tr>
                          <td className="border border-black p-1 text-center">CY1104</td>
                          <td className="border border-black p-1">Engineering Chemistry</td>
                          <td className="border border-black p-1 text-center">3.0</td>
                          <td className="border border-black p-1 text-center">Ex</td>
                        </tr>
                        {/* Remaining rows can be mapped here */}
                      </tbody>
                    </table>


                    
                    <table className="w-full border-collapse border border-black text-[10px]">
                      <thead className="bg-gray-100 uppercase">
                        <tr>
                          <th className="border border-black p-1">Code</th>
                          <th className="border border-black p-1">Subject Title</th>
                          <th className="border border-black p-1">Cr.</th>
                          <th className="border border-black p-1">Gr.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Example rows based on document [cite: 64] */}
                        <tr>
                          <td className="border border-black p-1 text-center">MA1101</td>
                          <td className="border border-black p-1">Engineering Mathematics-I</td>
                          <td className="border border-black p-1 text-center">4.0</td>
                          <td className="border border-black p-1 text-center">Ex</td>
                        </tr>
                        <tr>
                          <td className="border border-black p-1 text-center">CY1104</td>
                          <td className="border border-black p-1">Engineering Chemistry</td>
                          <td className="border border-black p-1 text-center">3.0</td>
                          <td className="border border-black p-1 text-center">Ex</td>
                        </tr>
                        {/* Remaining rows can be mapped here */}
                      </tbody>
                    </table>

                    
                    <table className="w-full border-collapse border border-black text-[10px]">
                      <thead className="bg-gray-100 uppercase">
                        <tr>
                          <th className="border border-black p-1">Code</th>
                          <th className="border border-black p-1">Subject Title</th>
                          <th className="border border-black p-1">Cr.</th>
                          <th className="border border-black p-1">Gr.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Example rows based on document [cite: 64] */}
                        <tr>
                          <td className="border border-black p-1 text-center">MA1101</td>
                          <td className="border border-black p-1">Engineering Mathematics-I</td>
                          <td className="border border-black p-1 text-center">4.0</td>
                          <td className="border border-black p-1 text-center">Ex</td>
                        </tr>
                        <tr>
                          <td className="border border-black p-1 text-center">CY1104</td>
                          <td className="border border-black p-1">Engineering Chemistry</td>
                          <td className="border border-black p-1 text-center">3.0</td>
                          <td className="border border-black p-1 text-center">Ex</td>
                        </tr>
                        {/* Remaining rows can be mapped here */}
                      </tbody>
                    </table>
                    
                    <table className="w-full border-collapse border border-black text-[10px]">
                      <thead className="bg-gray-100 uppercase">
                        <tr>
                          <th className="border border-black p-1">Code</th>
                          <th className="border border-black p-1">Subject Title</th>
                          <th className="border border-black p-1">Cr.</th>
                          <th className="border border-black p-1">Gr.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Example rows based on document [cite: 64] */}
                        <tr>
                          <td className="border border-black p-1 text-center">MA1101</td>
                          <td className="border border-black p-1">Engineering Mathematics-I</td>
                          <td className="border border-black p-1 text-center">4.0</td>
                          <td className="border border-black p-1 text-center">Ex</td>
                        </tr>
                        <tr>
                          <td className="border border-black p-1 text-center">CY1104</td>
                          <td className="border border-black p-1">Engineering Chemistry</td>
                          <td className="border border-black p-1 text-center">3.0</td>
                          <td className="border border-black p-1 text-center">Ex</td>
                        </tr>
                        {/* Remaining rows can be mapped here */}
                      </tbody>
                    </table>
                    

                    <div className="mt-6 flex justify-between items-end">
                       <div className="text-sm font-bold border-2 border-black p-2">
                          MAJOR CGPA: {student.cgpa}
                       </div>
                       <div className="text-center text-xs font-bold">
                          <p className="mb-12 underline">Controller of Examinations</p>
                          <p>DIRECTOR</p>
                       </div>
                    </div>
                  </div>
                )}
                
                {/* Background Watermark [cite: 16, 31, 91, 112] */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <h1 className="text-[120px] font-bold rotate-45">RGUKT-AP</h1>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}