import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/userApi";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

export type SignUpFormData = {
  name: string;
  email: string;
  password: string;
};

export const SignUp = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpFormData>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { userDetails, setUserDetails } = useAppContext();

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      const response = await signup(data);
      setLoading(false);
      if (response.statusCode == 200) {
        console.log(response.responseBody);
        setUserDetails(response.responseBody);
        navigate("/verify-email");
      } else {
        setError(response.responseBody.type, {
          type: "manual",
          message: response.responseBody.message || "An error occurred",
        });
      }
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    if (userDetails && userDetails.isVerified) {
      navigate("/home");
    }
  }, [userDetails, navigate]);

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <div className="container mx-auto flex flex-col sm:w-1/3 border border-black-800 items-center rounded-lg p-12">
        <div className="text-3xl">Create your account</div>
        <div className="flex flex-col gap-3 mt-5 w-full">
          <label className="text-gray-700 text-sm font-semibold">
            Name
            <input
              className="border rounded w-full py-2 px-3 font-normal"
              type="text"
              {...register("name", { required: "This field is required" })}
            />
            {errors.name?.message && (
              <span className="text-red-500 text-sm font-bold">
                {errors.name?.message}
              </span>
            )}
          </label>
          <label className="text-gray-700 text-sm font-semibold">
            Email
            <input
              className="border rounded w-full py-2 px-3 font-normal"
              type="text"
              {...register("email", {
                required: "This field is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email?.message && (
              <span className="text-red-500 text-sm font-bold">
                {errors.email?.message}
              </span>
            )}
          </label>
          <label className="text-gray-700 text-sm font-semibold">
            Password
            <input
              className="border rounded w-full py-2 px-3 font-normal"
              type="password"
              {...register("password", {
                required: "This field is required",
                minLength: {
                  value: 6,
                  message: "Minimum length must be 6 characters",
                },
              })}
            />
            {errors.password?.message && (
              <span className="text-red-500 text-sm font-bold">
                {errors.password?.message}
              </span>
            )}
          </label>
          <button
            type="submit"
            className="bg-black text-white p-3 px-6 mt-5 font-bold text-xl rounded-md"
          >
            {(loading && "Loading...") || "Submit"}
          </button>

          <span className="text-sm mt-5 mx-auto">
            Have an account?{" "}
            <Link className="underline" to="/login">
              Login
            </Link>
          </span>
        </div>
      </div>
    </form>
  );
};
