import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "@/store/reducers/authSlice";
import { RootState } from "@/store/store/store";
import type { User as IUser } from "../../../backend/types/database/user";

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const signInMutation = useMutation({
    mutationFn: async (data: Partial<IUser>) => {
      const response = await axios.post("/api/v1/user/signin", data);
      return response.data;
    },
    onSuccess: (data: any) => {
      navigate("/colleges");
      dispatch(loginSuccess(data.data.user));
      // Redirect after login
    },
    onError: (error: any) => {
      console.error(
        "Login Failed:",
        error.response?.data?.message || error.message
      );
    },
  });

  const onSubmit = (data: any) => {
    signInMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

        {user && (
          <p className="text-green-500 text-sm italic text-center">
            Welcome, {user.email}!
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
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

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
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

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={signInMutation.isPending}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {signInMutation.isPending ? "Signing In..." : "Sign In"}
            </button>
            <Link
              to="/signup"
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            >
              Create an account
            </Link>
          </div>

          {signInMutation.isError && (
            <p className="text-red-500 text-xs italic mt-4">
              {signInMutation.error?.response?.data?.message ||
                "Login failed. Please try again."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signin;
