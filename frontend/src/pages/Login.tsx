import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendLoginOtp, verifyOtp } from "../services/api";

import logo from "../assets/logo.svg";
import backgroundImage from "../assets/background-image.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sendLoginOtp(email);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.response?.data?.msg || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await verifyOtp(email, otp, rememberMe);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err: any) {
      setError("Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Desktop-only Header (Top Left) */}
      <div className="hidden lg:flex items-center absolute top-8 left-8 z-10">
        <img src={logo} alt="HD Logo" className="w-50 h-50" />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile-only Header (Centered) */}
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <img src={logo} alt="HD Logo" className="w-50 h-50" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center lg:text-left">
            Sign in
          </h1>
          <p className="text-gray-500 mb-8 text-center lg:text-left">
            Welcome back to HD
          </p>

          {error && (
            <p className="text-red-500 text-sm text-center font-medium mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="relative">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-500"
              >
                Email
              </label>
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pt-6 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || otpSent}
                placeholder="jonas_kahnwald@gmail.com"
                className="mt-1 block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              />
            </div>

            {otpSent && (
              <>
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-500"
                  >
                    OTP Code
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={loading}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter 6-digit code"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Keep me logged in
                  </label>
                </div>
              </>
            )}

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Get OTP"}
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify & Sign In"}
              </button>
            )}
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            Don't have an account?{" "}
            <Link
              to="/"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:block lg:w-1/2 p-2">
        <img
          src={backgroundImage}
          alt="Abstract blue waves"
          className="w-full h-full object-cover rounded-3xl"
        />
      </div>
    </div>
  );
};

export default Login;
