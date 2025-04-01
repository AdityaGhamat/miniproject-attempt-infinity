import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/reducers/authSlice";
import type { User as IUser } from "../../../backend/types/database/user";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password", "");

  const signUpMutation = useMutation({
    mutationFn: async (data: Partial<IUser>) => {
      const response = await axios.post("/api/v1/user/signup", data);
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(loginSuccess(data.data.user));
      navigate("/dashboard");
    },
    onError: (error: any) => {
      console.error(
        "Signup Failed:",
        error.response?.data?.message || error.message
      );
    },
  });

  const onSubmit = (data: Partial<IUser>) => {
    const { email, name, password, role } = data;
    signUpMutation.mutate({ email, name, password, role });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Full Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Full Name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.name.message as any}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.email.message as any}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.password.message as any}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.confirmPassword.message as any}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Role
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register("role", { required: "Role is required" })}
            >
              <option value="ADMIN">ADMIN</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.role.message as any}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={signUpMutation.isPending}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {signUpMutation.isPending ? "Signing Up..." : "Sign Up"}
            </button>
            <Link
              to="/signin"
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            >
              Already have an account?
            </Link>
          </div>

          {signUpMutation.isError && (
            <p className="text-red-500 text-xs italic mt-4">
              {signUpMutation.error?.response?.data?.message ||
                "Signup failed. Please try again."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
