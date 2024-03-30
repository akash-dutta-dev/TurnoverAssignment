import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { verifyCode } from "../api/userApi";
import { useNavigate } from "react-router-dom";

export const EmailVerify = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { userDetails, setUserDetails } = useAppContext();
  const [maskedEmail, setMaskedEmail] = useState("");
  const navigate = useNavigate();

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key >= "0" && event.key <= "9") {
      const newOtp = [...otp];
      newOtp[index] = event.key;
      setOtp(newOtp);

      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (event.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (event.key === "ArrowLeft") {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (event.key === "ArrowRight") {
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (otp.some((value) => value === "")) {
      alert("Please fill in all OTP fields");
      return;
    }

    setLoading(true);
    const response = await verifyCode(otp.join(""));
    setLoading(false);
    if (response.statusCode == 200) {
      console.log(response.responseBody);
      setUserDetails(response.responseBody);
      navigate("/home");
    } else {
      setError(response.responseBody.message);
    }
    console.log(response.responseBody);
  };

  useEffect(() => {
    if (userDetails) {
      const maskEmail = (email: string) => {
        const [username, domain] = email.split("@");
        const maskedUsername =
          username.slice(0, 3) + "*".repeat(username.length - 3);
        return maskedUsername + "@" + domain;
      };
      setMaskedEmail(maskEmail(userDetails.email));
    } else {
      navigate("/sign-up");
    }
  }, [userDetails, navigate]);

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="container mx-auto flex flex-col gap-5 sm:w-1/3 border border-black-800 items-center rounded-lg p-12">
        <div className="text-3xl">Verify your email</div>
        <div className="text-base text-center">
          Enter the 6-digit code you have received on {maskedEmail}
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold ml-1">Code</span>
          <div className="flex mt-1">
            {otp.map((value: string, index: number) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={value}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className="w-12 h-12 border border-gray-300 rounded-md mx-1 text-center"
                required
              />
            ))}
          </div>
          <span className="text-sm italic ml-1 text-gray-400">
            Hint- Type 123456, if not recieved mail.
          </span>
          {error && (
            <span className="text-red-500 text-sm font-bold">{error}</span>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white p-3 px-6 mt-5 font-bold text-xl rounded-md"
        >
          {(loading && "Verifying...") || "Verify"}
        </button>
      </div>
    </form>
  );
};
