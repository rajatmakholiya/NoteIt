import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp } from "../services/api";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sendOtp(email);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.response?.data?.msg || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await verifyOtp(email, otp);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Hello</h1>
          <p className="text-gray-500">Welcome to NoteIT</p>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center font-medium">
            {error}
          </p>
        )}

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path
              fill="#4285F4"
              d="M24 9.5c3.23 0 6.13 1.11 8.4 3.29l6.3-6.3C34.92 2.76 29.88 0 24 0 14.89 0 7.28 5.64 4.13 13.5l7.49 5.82C13.12 13.26 18.27 9.5 24 9.5z"
            ></path>
            <path
              fill="#34A853"
              d="M46.18 24.49c0-1.62-.14-3.18-.4-4.69H24v8.8h12.44c-.54 2.84-2.12 5.23-4.48 6.88l7.15 5.56C42.84 37.6 46.18 31.63 46.18 24.49z"
            ></path>
            <path
              fill="#FBBC05"
              d="M11.62 27.82c-.42-1.27-.65-2.63-.65-4.02s.23-2.75.65-4.02L4.13 13.5C1.53 18.16 0 23.85 0 30c0 6.15 1.53 11.84 4.13 16.5l7.49-5.82c-.42-1.27-.65-2.63-.65-4.02z"
            ></path>
            <path
              fill="#EA4335"
              d="M24 48c5.88 0 10.92-1.94 14.57-5.22l-7.15-5.56c-1.93 1.3-4.4 2.08-7.42 2.08-5.73 0-10.88-3.76-12.38-8.88l-7.49 5.82C7.28 42.36 14.89 48 24 48z"
            ></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center">
          <hr className="w-full border-t border-gray-300" />
          <span className="px-2 text-sm text-gray-500 bg-white">OR</span>
          <hr className="w-full border-t border-gray-300" />
        </div>

        {/* Email/OTP Login */}
        {!otpSent ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Sending..." : "Continue with Email"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <p className="text-center text-sm text-gray-600">
              We've sent an OTP to <strong>{email}</strong>
            </p>
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                OTP Code
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your 6-digit code"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
