import { Trash2, Users as UsersIcon, ChevronDown, Mail, User, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../axiosInstance';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const limit = 9;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/api/v1/user/all-users?startIndex=0&limit=${limit}`
        );
        if (res) {
          setUsers(res.data?.data?.users || []);
          if (res.data?.data?.users.length < limit) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(`User Error: ${error.message}`);
        toast.error(error.response?.data?.message || "Failed to fetch Users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleShowMore = async () => {
    const startIndex = users.length;
    setLoading(true);
    try {
      const res = await api.get(
        `/api/v1/user/all-users?startIndex=${startIndex}&limit=${limit}`
      );
      if (res) {
        setUsers((prev) => [...prev, ...res.data?.data?.users]);
        if (res.data?.data?.users.length < limit) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(`Users Error: ${error.message}`);
      toast.error("Failed to load more users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userEmail) => {
    if (window.confirm(`Are you sure you want to delete user: ${userEmail}?`)) {
      try {
        const res = await api.delete(`/api/v1/user/delete-user/${userEmail}`);
        if (res) {
          toast.success("User Deleted Successfully");
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.email !== userEmail)
          );
        }
      } catch (error) {
        console.log(`User deletion Error: ${error.message}`);
        toast.error(error.response?.data?.message || "Failed to delete user");
      }
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="loader"></div>
          <p className="text-primary">Loading Users...</p>
        </div>
      </div>
    );
  }

  if (users.length === 0 && !loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-6">
        <div className="p-6 bg-secondary rounded-full">
          <UsersIcon size={64} className="text-btn dark:text-btn-dark" />
        </div>
        <h3 className="sub-text text-center">No Users Found</h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-btn dark:bg-btn-dark rounded-full">
            <UsersIcon size={28} className="text-white" />
          </div>
          <div>
            <h1 className="head-text text-2xl sm:text-3xl">Users Management</h1>
            <p className="text-primary text-sm">
              {users.length} user{users.length !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block bg-secondary rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-btn dark:bg-btn-dark text-white">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-semibold">Sr. No</th>
                <th className="px-4 py-4 text-left text-sm font-semibold">Full Name</th>
                <th className="px-4 py-4 text-left text-sm font-semibold">Username</th>
                <th className="px-4 py-4 text-left text-sm font-semibold">Email</th>
                <th className="px-4 py-4 text-left text-sm font-semibold">Role</th>
                <th className="px-4 py-4 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id || index}
                  className="border-b border-bg-secondary-dark dark:border-bg-secondary hover:bg-bg-light dark:hover:bg-bg-dark transition-colors"
                >
                  <td className="px-4 py-4 text-primary font-medium">{index + 1}</td>
                  <td className="px-4 py-4 text-primary font-semibold">
                    {user.fullname}
                  </td>
                  <td className="px-4 py-4 text-primary max-w-xs truncate">
                    {user.username || "N/A"}
                  </td>
                  <td className="px-4 py-4 text-primary max-w-xs truncate">
                    {user.email}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-purple-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleDeleteUser(user.email)}
                        className="p-2 hover:bg-red-500 hover:text-white rounded-md transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user, index) => (
          <div
            key={user._id || index}
            className="bg-secondary rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-btn dark:bg-btn-dark rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {user.fullname?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-primary font-bold text-base">
                    {user.fullname}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-purple-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDeleteUser(user.email)}
                className="p-2 hover:bg-red-500 hover:text-white rounded-md transition-colors"
                title="Delete User"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary text-sm">
                <User size={14} className="opacity-70" />
                <span className="truncate">{user.username || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-primary text-sm">
                <Mail size={14} className="opacity-70" />
                <span className="truncate">{user.email}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-bg-secondary-dark dark:border-bg-secondary">
              <p className="text-primary text-xs opacity-70">User #{index + 1}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {showMore && !loading && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleShowMore}
            className="product-links text-white hover:bg-hover dark:hover:bg-hover-dark"
          >
            <ChevronDown size={20} />
            <span>Show More</span>
          </button>
        </div>
      )}

      {loading && users.length > 0 && (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center gap-3">
            <div className="loader"></div>
            <p className="text-primary">Loading more users...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;