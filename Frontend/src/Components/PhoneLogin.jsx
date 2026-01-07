import { useEffect, useState } from "react";
import axios from "axios";

export default function PhoneLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Send OTP
  const sendOtp = async () => {
    if (!phone) {
      setError("Please enter your phone number");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/auth/send-otp", { phone });
      setStep(2);
      setTimer(30);
    } catch (err) {
      console.error("Send OTP error:", err.response || err);
      setError(
        err.response?.data?.message || "Failed to send OTP. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    setOtp("");
    await sendOtp();
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!otp) {
      setError("Please enter OTP");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/auth/verify-otp", {
        phone,
        otp,
      });

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(res.data));

      // Navigate to Home
      window.location.href = "/home";
    } catch (err) {
      console.error("Verify OTP error:", err.response || err);
      setError(
        err.response?.data?.message || "OTP verification failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      {step === 1 && (
        <>
          <h2 className="text-xl font-bold mb-4">Login with Phone</h2>
          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border w-full p-2 mb-4 rounded"
          />
          <button
            onClick={sendOtp}
            disabled={loading}
            className="bg-pink-600 text-white w-full p-2 rounded hover:bg-pink-700 transition"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border w-full p-2 mb-4 rounded"
          />
          <button
            onClick={verifyOtp}
            disabled={loading}
            className="bg-green-600 text-white w-full p-2 rounded hover:bg-green-700 transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          {timer === 0 ? (
            <button
              onClick={resendOtp}
              disabled={loading}
              className="text-blue-600 mt-3 underline"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-gray-500 mt-3">Resend in {timer}s</p>
          )}

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </>
      )}
    </div>
  );
}
