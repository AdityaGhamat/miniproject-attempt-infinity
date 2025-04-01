import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  School,
  Info,
  RefreshCw,
  AlertCircle,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store/store";
import { useNavigate } from "react-router";
import { fetchUserProfile } from "@/lib/services/user";

const CollegeList = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newCollege, setNewCollege] = useState({
    name: "",
    latitude: "",
    longitude: "",
  });
  const [createError, setCreateError] = useState<any>(null);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const fetchColleges = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/v1/college");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setColleges(data.data || []);
    } catch (error) {
      console.error("Error fetching colleges:", error);
      setError("Failed to load colleges. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const formatCoordinates = (coordinates: any) => {
    if (!coordinates || coordinates.length !== 2) return "Location unknown";
    const [lng, lat] = coordinates;
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewCollege((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setNewCollege({
      name: "",
      latitude: "",
      longitude: "",
    });
    setCreateError(null);
  };

  const handleCreateDialogOpen = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleCreateCollege = async (e: any) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);

    // Basic validation
    if (!newCollege.name.trim()) {
      setCreateError("College name is required");
      setCreateLoading(false);
      return;
    }

    // Validate coordinates
    const lat = parseFloat(newCollege.latitude);
    const lng = parseFloat(newCollege.longitude);
    if (isNaN(lat) || isNaN(lng)) {
      setCreateError("Latitude and longitude must be valid numbers");
      setCreateLoading(false);
      return;
    }

    if (lat < -90 || lat > 90) {
      setCreateError("Latitude must be between -90 and 90");
      setCreateLoading(false);
      return;
    }

    if (lng < -180 || lng > 180) {
      setCreateError("Longitude must be between -180 and 180");
      setCreateLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/v1/college?user_id=${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCollege.name,
          location: {
            type: "Point",
            coordinates: [
              parseFloat(newCollege.longitude),
              parseFloat(newCollege.latitude),
            ],
          },
        }),
      });
      console.log(response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      // Success! Close the dialog and refresh the list
      handleCreateDialogClose();
      fetchColleges();
      fetchUserProfile(user._id, dispatch);
      setTimeout(() => {
        navigate(`/college/${user.college}`);
      }, 500);
    } catch (error: any) {
      console.error("Error creating college:", error);
      setCreateError(
        error.message || "Failed to create college. Please try again."
      );
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Colleges Directory</h1>
        <div className="flex gap-2">
          <Button
            onClick={fetchColleges}
            variant="outline"
            className="flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
          <Button
            onClick={handleCreateDialogOpen}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus size={16} />
            Add College
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw size={32} className="animate-spin text-blue-600" />
            <p className="text-gray-500">Loading colleges...</p>
          </div>
        </div>
      ) : colleges.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Info size={48} className="text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No Colleges Found
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-4">
              There are currently no colleges in the database. Click the button
              below to add your first college.
            </p>
            <Button onClick={handleCreateDialogOpen} className="mt-2">
              Add Your First College
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college: any) => (
            <Card
              key={college._id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-2">
                <CardTitle className="flex items-start gap-2">
                  <School
                    className="text-blue-700 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span>{college.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-start gap-2 text-gray-600 mb-3">
                  <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                  <span>
                    {formatCoordinates(college.location?.coordinates)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="outline" className="bg-blue-50">
                    ID: {college._id?.substring(0, 8)}...
                  </Badge>
                  {college.createdAt && (
                    <Badge variant="outline" className="bg-green-50">
                      Added: {new Date(college.createdAt).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create College Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New College</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCollege}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">College Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newCollege.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Harvard University"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={newCollege.latitude}
                    onChange={handleInputChange}
                    placeholder="e.g. 42.3770"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={newCollege.longitude}
                    onChange={handleInputChange}
                    placeholder="e.g. -71.1167"
                    required
                  />
                </div>
              </div>
              {createError && (
                <div className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle size={16} />
                  <span>{createError}</span>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCreateDialogClose}
                disabled={createLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createLoading}>
                {createLoading ? (
                  <>
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create College"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollegeList;
