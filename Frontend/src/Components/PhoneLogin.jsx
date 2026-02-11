// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function PhoneLogin() {
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [step, setStep] = useState(1);
//   const [timer, setTimer] = useState(30);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Countdown timer for OTP resend
//   useEffect(() => {
//     let interval;
//     if (step === 2 && timer > 0) {
//       interval = setInterval(() => setTimer((t) => t - 1), 1000);
//     }
//     return () => clearInterval(interval);
//   }, [step, timer]);

//   // Send OTP
//   const sendOtp = async () => {
//     if (!phone) {
//       setError("Please enter your phone number");
//       return;
//     }
//     setError("");
//     setLoading(true);
//     try {
//       await axios.post("http://localhost:8080/auth/send-otp", { phone });
//       setStep(2);
//       setTimer(30);
//     } catch (err) {
//       console.error("Send OTP error:", err.response || err);
//       setError(
//         err.response?.data?.message || "Failed to send OTP. Try again later."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Resend OTP
//   const resendOtp = async () => {
//     setOtp("");
//     await sendOtp();
//   };

//   // Verify OTP
//   const verifyOtp = async () => {
//     if (!otp) {
//       setError("Please enter OTP");
//       return;
//     }
//     setError("");
//     setLoading(true);
//     try {
//       const res = await axios.post("http://localhost:8080/auth/verify-otp", {
//         phone,
//         otp,
//       });

//       localStorage.setItem("isLoggedIn", "true");
//       localStorage.setItem("user", JSON.stringify(res.data));

//       // Navigate to Home
//       window.location.href = "/home";
//     } catch (err) {
//       console.error("Verify OTP error:", err.response || err);
//       setError(
//         err.response?.data?.message || "OTP verification failed. Try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-yellow-100 p-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
//         <div className="flex flex-col items-center mb-6">
//           <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
//             🍞
//           </div>
//           <h1 className="text-2xl font-bold mt-4 text-gray-800">
//             ChapatiMart Login
//           </h1>
//           <p className="text-gray-500 mt-1 text-center">
//             Login quickly using your phone number
//           </p>
//         </div>

//         {step === 1 && (
//           <>
//             <input
//               type="tel"
//               placeholder="Phone number"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               className="border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none rounded-xl w-full p-3 mb-4 shadow-sm transition"
//             />
//             <button
//               onClick={sendOtp}
//               disabled={loading}
//               className="bg-green-500 text-white w-full p-3 rounded-xl font-semibold hover:bg-green-600 transition duration-200 shadow-md"
//             >
//               {loading ? "Sending OTP..." : "Send OTP"}
//             </button>
//             {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
//           </>
//         )}

//         {step === 2 && (
//           <>
//             <input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="border border-gray-300 focus:ring-2 focus:ring-green-600 focus:outline-none rounded-xl w-full p-3 mb-4 shadow-sm transition"
//             />
//             <button
//               onClick={verifyOtp}
//               disabled={loading}
//               className="bg-green-500 text-white w-full p-3 rounded-xl font-semibold hover:bg-green-600 transition duration-200 shadow-md"
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>

//             {timer === 0 ? (
//               <button
//                 onClick={resendOtp}
//                 disabled={loading}
//                 className="text-yellow-500 mt-4 underline font-medium"
//               >
//                 Resend OTP
//               </button>
//             ) : (
//               <p className="text-gray-500 mt-4 text-center">
//                 Resend in {timer}s
//               </p>
//             )}

//             {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
