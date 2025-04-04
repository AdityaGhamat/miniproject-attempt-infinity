import { useNavigate } from "react-router";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Track attendance with</span>{" "}
                <span className="block text-indigo-600 xl:inline">
                  pinpoint accuracy
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Owl helps businesses and schools track attendance using reliable
                geolocation data. Say goodbye to buddy punching and hello to
                effortless attendance management.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <button
                    onClick={() => navigate("/signup")}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started
                  </button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <button
                    onClick={() => navigate("/demo")}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                  >
                    Live Demo
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="/location-map.jpg"
          alt="Attendance tracking with geolocation"
          onError={(e: any) => {
            e.target.onerror = null;
            e.target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' fill='%23e2e8f0'%3E%3Crect width='600' height='400' /%3E%3Cpath d='M300 180 L340 120 L380 160 L420 150 L440 100' stroke='%234f46e5' stroke-width='5' fill='none'/%3E%3Ccircle cx='300' cy='180' r='12' fill='%234f46e5'/%3E%3Ccircle cx='340' cy='120' r='6' fill='%234f46e5'/%3E%3Ccircle cx='380' cy='160' r='6' fill='%234f46e5'/%3E%3Ccircle cx='420' cy='150' r='6' fill='%234f46e5'/%3E%3Ccircle cx='440' cy='100' r='6' fill='%234f46e5'/%3E%3C/svg%3E";
          }}
        />
      </div>
    </div>
  );
};

export default Hero;
