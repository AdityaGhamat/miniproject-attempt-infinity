import { useState, useEffect } from "react";
import axios from "axios";
import { format, parseISO, startOfMonth, endOfMonth, isValid } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useParams } from "react-router";

// Main Dashboard Component
const AttendanceDashboard = () => {
  const { collegeId } = useParams(); // Get collegeId from URL parameters
  const [attendanceData, setAttendanceData] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);

  // Filter states
  const [fromDate, setFromDate] = useState(
    format(startOfMonth(new Date()), "yyyy-MM-dd")
  );
  const [toDate, setToDate] = useState(
    format(endOfMonth(new Date()), "yyyy-MM-dd")
  );
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [minHours, setMinHours] = useState("");
  const [maxHours, setMaxHours] = useState("");

  // Stats
  const [stats, setStats] = useState({
    totalStaff: 0,
    presentToday: 0,
    absentToday: 0,
    averageHours: 0,
  });
  console.log(stats);
  useEffect(() => {
    if (collegeId) {
      fetchStaffMembers();
      fetchTodayAttendance();
    }
  }, [collegeId]);

  // Fetch filtered attendance data
  const fetchAttendanceData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (fromDate) queryParams.append("fromDate", fromDate);
      if (toDate) queryParams.append("toDate", toDate);
      if (selectedStaffId) queryParams.append("staffId", selectedStaffId);
      if (selectedStatus) queryParams.append("status", selectedStatus);
      if (minHours) queryParams.append("minHours", minHours);
      if (maxHours) queryParams.append("maxHours", maxHours);

      // Using the viewAttendance method according to your backend
      const response = await axios.get(
        `/api/v1/attendance/view/${collegeId}?${queryParams.toString()}`
      );

      setAttendanceData(response.data.data);
      calculateStats(response.data.data);
    } catch (err) {
      console.error("Error fetching attendance data:", err);
      setError("Failed to load attendance data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch staff members list
  const fetchStaffMembers = async () => {
    try {
      setIsLoadingStaff(true);
      // Using the correct endpoint with dynamic collegeId
      const response = await axios.get(`/api/v1/college/staff/${collegeId}`);

      if (response.data.success) {
        setStaffMembers(response.data.data);
        console.log("Staff members loaded:", response.data.data.length);
      } else {
        console.error("API returned error:", response.data.message);
        setError("Failed to load staff members: " + response.data.message);
      }
    } catch (err) {
      console.error("Error fetching staff members:", err);
      setError("Failed to load staff members. Please try again later.");
    } finally {
      setIsLoadingStaff(false);
    }
  };

  // Fetch today's attendance for quick stats
  const fetchTodayAttendance = async () => {
    try {
      // Using the viewAttendanceOfToday method according to your backend
      const response = await axios.get(`/api/v1/attendance/today/${collegeId}`);
      const todayData = response.data.data;

      const present = todayData.filter(
        (record: any) => record.isPresent
      ).length;
      const total = todayData.length;

      setStats((prev) => ({
        ...prev,
        totalStaff: total,
        presentToday: present,
        absentToday: total - present,
      }));
    } catch (err) {
      console.error("Error fetching today's attendance:", err);
    }
  };

  // Calculate statistics from the fetched data
  const calculateStats = (data: any) => {
    if (!data || data.length === 0) return;

    const totalHours = data.reduce((sum: any, record: any) => {
      // Make sure workingHours is a number before adding
      const hours =
        typeof record.workingHours === "number" ? record.workingHours : 0;
      return sum + hours;
    }, 0);

    const avgHours =
      data.length > 0 ? (totalHours / data.length).toFixed(1) : 0;

    setStats((prev: any) => ({
      ...prev,
      averageHours: avgHours,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: any) => {
    e.preventDefault();
    fetchAttendanceData();
  };

  // Reset all filters
  const handleReset = () => {
    setFromDate(format(startOfMonth(new Date()), "yyyy-MM-dd"));
    setToDate(format(endOfMonth(new Date()), "yyyy-MM-dd"));
    setSelectedStaffId("");
    setSelectedStatus("");
    setMinHours("");
    setMaxHours("");
  };

  // Handle manual attendance update
  const handleUpdateAttendance = async (attendanceId: any, isPresent: any) => {
    try {
      await axios.patch(`/api/v1/attendance/${attendanceId}`, { isPresent });
      fetchAttendanceData(); // Refresh data after update
    } catch (err) {
      console.error("Error updating attendance:", err);
      setError("Failed to update attendance. Please try again.");
    }
  };

  // Handle staff checkout
  const handleCheckout = async (attendanceId: any) => {
    try {
      await axios.patch(`/api/v1/attendance/${attendanceId}`, {
        checkOut: new Date().toISOString(),
      });
      fetchAttendanceData(); // Refresh data after update
    } catch (err) {
      console.error("Error checking out staff member:", err);
      setError("Failed to check out staff member. Please try again.");
    }
  };

  // Custom date/time formatting functions
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A";

    const date =
      typeof dateString === "string" ? parseISO(dateString) : dateString;
    if (!isValid(date)) return "N/A";

    return format(date, "MMM dd, yyyy");
  };

  const formatTime = (dateString: string | Date, timeZone = "Asia/Kolkata") => {
    if (!dateString) return "N/A";

    const date =
      typeof dateString === "string" ? parseISO(dateString) : dateString;
    if (!isValid(date)) return "N/A";

    const zonedDate = toZonedTime(date, timeZone); // Convert UTC to local timezone
    return format(zonedDate, "hh:mm a");
  };
  // Trigger initial data fetch
  useEffect(() => {
    if (collegeId) {
      fetchAttendanceData();
    }
  }, [collegeId]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Attendance Dashboard
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Staff"
            value={stats.totalStaff}
            color="bg-blue-500"
          />
          <StatCard
            title="Present Today"
            value={stats.presentToday}
            color="bg-green-500"
          />
          <StatCard
            title="Absent Today"
            value={stats.absentToday}
            color="bg-red-500"
          />
          <StatCard
            title="Avg. Working Hours"
            value={`${stats.averageHours} hrs`}
            color="bg-purple-500"
          />
        </div> */}

        <div className="bg-white rounded-lg shadow mb-6 p-6">
          {/* <h2 className="text-xl font-semibold mb-4">
            Filter Attendance Records
          </h2> */}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>

              {/* Staff Member Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Staff Member
                </label>
                {isLoadingStaff ? (
                  <div className="flex items-center space-x-2 py-2 border border-gray-300 rounded-md px-3 bg-gray-50">
                    <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-500">
                      Loading staff...
                    </span>
                  </div>
                ) : (
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                  >
                    <option value="">All Staff Members</option>
                    {staffMembers.map((staff: any) => (
                      <option key={staff._id} value={staff._id}>
                        {staff.name} {staff.role ? `(${staff.role})` : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Status Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </div>

              {/* Hours Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Hours
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={minHours}
                  onChange={(e) => setMinHours(e.target.value)}
                  min="0"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Hours
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={maxHours}
                  onChange={(e) => setMaxHours(e.target.value)}
                  min="0"
                  step="0.5"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Apply Filters"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Attendance Records Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-xl font-semibold p-6 border-b">
            Attendance Records
          </h2>

          {isLoading ? (
            <div className="text-center p-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-500">Loading attendance data...</p>
            </div>
          ) : attendanceData.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              No attendance records found for the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Staff Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check Out
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Working Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Round Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceData.map((record: any) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                        {record._id
                          ? record._id.toString().substring(0, 8) + "..."
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.user ? record.user.name : "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.checkIn
                          ? formatTime(record.checkIn)
                          : "Not checked in"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.checkOut ? (
                          formatTime(record.checkOut)
                        ) : record.checkIn && record.isPresent ? (
                          <button
                            onClick={() => handleCheckout(record._id)}
                            className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                          >
                            Check Out
                          </button>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            record.isPresent
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {record.isPresent ? "Present" : "Absent"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {Number(record.workingHours)
                          ? Number(Number(record.workingHours).toFixed(1))
                          : 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleUpdateAttendance(
                                record._id,
                                !record.isPresent
                              )
                            }
                            className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                              record.isPresent
                                ? "text-red-700 bg-red-100 hover:bg-red-200"
                                : "text-green-700 bg-green-100 hover:bg-green-200"
                            }`}
                          >
                            {record.isPresent ? "Mark Absent" : "Mark Present"}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.currentRoundTime ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                            {formatTime(record.currentRoundTime)}
                          </span>
                        ) : (
                          <span className="text-gray-400">No round time</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Stat Card Component
// const StatCard = ({ title, value, color }: any) => {
//   return (
//     <div className="bg-white rounded-lg shadow overflow-hidden">
//       <div className={`h-2 ${color}`}></div>
//       <div className="p-5">
//         <h3 className="text-lg font-medium text-gray-500">{title}</h3>
//         <p className="mt-1 text-3xl font-semibold">{value}</p>
//       </div>
//     </div>
//   );
// };

export default AttendanceDashboard;
