import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store/store";
import { logout } from "@/store/reducers/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = Boolean(user);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      if (user.college) {
        navigate(`/college/${user.college._id}`);
      } else {
        navigate("/college");
      }
    } else {
      navigate("/signin");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-10 w-10"
                src="/logo.svg"
                alt="Owl Logo"
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src =
                    "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3ccircle cx='12' cy='12' r='10'%3e%3c/circle%3e%3cpath d='M8 14s1.5 2 4 2 4-2 4-2'%3e%3c/path%3e%3cline x1='9' y1='9' x2='9.01' y2='9'%3e%3c/line%3e%3cline x1='15' y1='9' x2='15.01' y2='9'%3e%3c/line%3e%3c/svg%3e";
                  e.target.style.filter =
                    "invert(30%) sepia(85%) saturate(1467%) hue-rotate(215deg) brightness(92%) contrast(97%)";
                }}
              />
              <span className="ml-2 text-xl font-bold text-gray-800">Owl</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-indigo-700"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-indigo-700"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-indigo-700"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-indigo-700"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleAuthAction}
                  className="ml-4 px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleAuthAction}
                className="ml-4 px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
