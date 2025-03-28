import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const { verifyOTP, loading, error, verificationData } = useAuth();
  const location = useLocation();

  // Check for OTP in URL (from email link)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlOtp = params.get("otp");
    const urlEmail = params.get("email");

    if (urlOtp && verificationData?.email === urlEmail) {
      verifyOTP(urlOtp)
        .then(() => toast.success("OTP verified successfully!")) // Show success message
        .catch(() => toast.error("Invalid OTP! Please try again.")); // Show error message
    }
  }, [location, verificationData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyOTP(otp);
      toast.success("OTP verified successfully!"); // Show success message
    } catch {
      toast.error("Invalid OTP! Please try again."); // Show error message
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Verify Your Email
        </h2>
        <p className="text-gray-600 text-center mb-4">
          We've sent an OTP to <span className="font-semibold">{verificationData?.email}</span>
        </p>
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className={`bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
