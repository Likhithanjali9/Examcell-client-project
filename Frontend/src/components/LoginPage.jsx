import React, { useState } from "react";
import { api } from "../api";

import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  //  Navigation hook from React Router
  const navigate = useNavigate();
  //  State variables
  const [role, setRole] = useState("coe");
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  //const role = localStorage.getItem("role");


  //  Send OTP for COE
  const handleSendOtp = async () => {
    //const userEmail = "rr200286@rguktrkv.ac.in"; // COE email

    try {
      const response = await api.post("/coe/send-otp/", {email});
      console.log(response.data);
      setOtpSent(true);
      alert("OTP sent successfully to your email!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please check the backend or try again.");
    }
  };

  //  Verify OTP for COE
  const handleVerifyOtp = async () => {
    try {
      const response = await api.post("/coe/verify-otp/", {

        email,
        otp,
      });
      console.log(response.data);
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("role", response.data.role);

      alert("OTP verified successfully!");
      navigate("/dashboard",{replace:true}); // redirect using navigate
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP. Please try again.");
    }
  };

  //  Faculty login with email + password
const handleFacultyLogin = async () => {
  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  //  Email validation before sending request
  const collegeEmailPattern = /^[a-zA-Z0-9._%+-]+@rguktrkv\.ac\.in$/;
  if (!collegeEmailPattern.test(email)) {
    alert("Please use your official college email (e.g. name@rguktrkv.ac.in)");
    return;
  }

  try {
    const res = await api.post("/faculty/login/", {

      email,
      password,
    });
    alert("Faculty login successful! Redirecting...");
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    localStorage.setItem("role", res.data.role);
    localStorage.setItem("user_email", email);
    localStorage.setItem("level", res.data.level);

    navigate("/dashboard", {replace:true}); // redirect 
  } catch (err) {
    alert(err.response?.data?.error || "Invalid credentials");
  }
};


  //  JSX Layout
  return (
    <div className="flex flex-col items-center min-h-screen bg-[#f9f9f9] font-sans">
      {/* Graduation Cap */}
      <div className="w-full flex justify-center mt-14">
        <div className="bg-[#991b1b] w-14 h-14 rounded-full flex items-center justify-center shadow-lg mb-[-1.75rem] z-10">
          <svg
            className="w-8 h-8 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon fill="white" points="12,3 2,8.5 12,14 22,8.5" />
            <rect x="7" y="12.2" width="10" height="3" fill="white" rx="1" />
            <line x1="12" y1="14" x2="12" y2="19" stroke="white" strokeWidth={1.3} />
            <circle cx="12" cy="20" r="1" fill="white" />
          </svg>
        </div>
      </div>

      {/* Login Card */}
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-lg border-4 border-gray-200 px-8 py-10 flex flex-col items-center mt-4">
        <div className="text-xl md:text-2xl font-extrabold text-center text-[#22235b] mb-1">
          College Examination Management System
        </div>
        <div className="text-base text-center mb-3 font-extrabold text-[#22235b] tracking-wide">
          RGUKT RK Valley
        </div>
        <div className="text-xl font-bold mb-1 text-center text-black">Login</div>
        <div className="text-xs text-gray-600 mb-2 text-center">
          Choose your login type to continue
        </div>

        {/* Role Selector */}
        <div className="flex justify-center mb-5 gap-2">
          <button
            type="button"
            className={`px-5 py-2 rounded-l-full font-bold text-sm border transition-all duration-200 ${
              role === "coe"
                ? "bg-[#ededed] text-[#991b1b] border-[#e4e4e7]"
                : "bg-white text-gray-600 border-[#e4e4e7] hover:bg-gray-100"
            }`}
            onClick={() => {
              setRole("coe");
              setEmail("");
              setPassword("");
              setOtpSent(false);
            }}
          >
            COE Admin
          </button>

          <button
            type="button"
            className={`px-5 py-2 rounded-r-full font-bold text-sm border transition-all duration-200 ${
              role === "faculty"
                ? "bg-[#ededed] text-[#991b1b] border-[#e4e4e7]"
                : "bg-white text-gray-600 border-[#e4e4e7] hover:bg-gray-100"
            }`}
            onClick={() => {
              setRole("faculty");
              setOtpSent(false);
              setOtp("");
            }}
          >
            Faculty/Staff
          </button>
        </div>

        {/* Login Form */}
        <form className="flex flex-col items-center w-full gap-0" autoComplete="off">
          {/* COE Login with OTP */}
          {role === "coe" && (
            <>
              <label className="mb-1 text-[14px] font-bold text-gray-700 w-full text-left">
                College Email
              </label>
              <input
                className="mb-3 w-full bg-[#f6f6f6] border border-gray-300 rounded-md px-3 py-2 text-sm font-semibold"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter college email"
                style={{ color: "#a3a3a3" }}
              />

              {!otpSent ? (
                <button
                  type="button"
                  className="mt-2 w-full py-2 text-[16px] font-bold rounded-md bg-[#991b1b] text-white hover:bg-[#b91c1c] shadow-sm transition-all duration-200"
                  onClick={handleSendOtp}
                >
                  Send OTP
                </button>
              ) : (
                <>
                  <label className="mb-1 text-[14px] font-bold text-gray-700 w-full text-left">
                    Enter OTP
                  </label>
                  <input
                    className="mb-3 w-full bg-[#f6f6f6] border border-gray-300 rounded-md px-3 py-2 text-sm font-semibold"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter the OTP sent to your email"
                  />
                  <button
                    type="button"
                    className="mt-2 w-full py-2 text-[16px] font-bold rounded-md bg-[#991b1b] text-white hover:bg-[#b91c1c] shadow-sm transition-all duration-200"
                    onClick={handleVerifyOtp}
                  >
                    Verify & Login
                  </button>
                </>
              )}
            </>
          )}

          {/* Faculty Login with Password */}
          {role === "faculty" && (
            <>
              <label className="mb-1 text-[14px] font-bold text-gray-700 w-full text-left">
                College Email
              </label>
              <input
                className={`mb-1 w-full bg-[#f6f6f6] border ${
                  email && !email.endsWith("@rguktrkv.ac.in")
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md px-3 py-2 text-sm font-semibold`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your college email"
              />

              {/* Inline email validation message */}
              {email && !email.endsWith("@rguktrkv.ac.in") && (
                <p className="text-red-500 text-xs mb-2 font-semibold">
                  ⚠️ Please use your official college email (e.g. name@rguktrkv.ac.in)
                </p>
              )}

              <label className="mb-1 text-[14px] font-bold text-gray-700 w-full text-left">
                Password
              </label>
              <input
                className="mb-3 w-full bg-[#f6f6f6] border border-gray-300 rounded-md px-3 py-2 text-sm font-semibold"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />

              <button
                type="button"
                className={`mt-2 w-full py-2 text-[16px] font-bold rounded-md ${
                  email && !email.endsWith("@rguktrkv.ac.in")
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#991b1b] text-white hover:bg-[#b91c1c]"
                } shadow-sm transition-all duration-200`}
                onClick={handleFacultyLogin}
                disabled={email && !email.endsWith("@rguktrkv.ac.in")}
              >
                Login
              </button>
            </>
          )}

          <div className="w-full text-xs text-gray-600 mt-2 text-center font-semibold">
            {role === "coe" ? "2-step verification required" : "Email & password required"}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
