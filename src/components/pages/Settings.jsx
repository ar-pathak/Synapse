import React, { useState, useEffect } from "react";
import { FiUser, FiSettings, FiLock, FiShield, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { API_URL } from "../../utils/constants";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setUserinfo } from "../../store/slice/userinfoSlice";
import { useSelector } from "react-redux";

// Helper function to validate ObjectId format
const isValidObjectId = (id) => {
  return id && typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
};

// Helper function to extract valid user ID
const getValidUserId = (userId, userinfo) => {
  // Try different possible locations for the user ID
  const possibleIds = [
    userId?._id,
    userId?.id,
    userId,
    userinfo?._id,
    userinfo?.id
  ];
  
  // Find the first valid ObjectId
  const validId = possibleIds.find(id => isValidObjectId(id));
  
  if (!validId) {
    console.error('No valid user ID found:', { userId, userinfo });
    return null;
  }
  
  return validId;
};

const SIDEBAR_TABS = [
  { key: "account", label: "Account", icon: <FiSettings /> },
  { key: "security", label: "Security", icon: <FiLock /> },
  { key: "privacy", label: "Privacy", icon: <FiShield /> },
];

const Settings = () => {
  const [selectedTab, setSelectedTab] = useState("account");
  const dispatch = useDispatch();
  const userinfo = useSelector((state) => state.userinfo.userinfo);
  const userId = useSelector((state) => state.userinfo.userId);


  // Change Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordMsgType, setPasswordMsgType] = useState("");
  // Privacy
  const [isPrivate, setIsPrivate] = useState(false);
  const [privacyLoading, setPrivacyLoading] = useState(false);
  const [privacyMsg, setPrivacyMsg] = useState("");
  // Delete Account
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserinfo = async () => {
      if (!userId) return;

      try {
        // Use helper function to get valid user ID
        const userIdValue = getValidUserId(userId);
        
        if (!userIdValue) {
          console.error('No valid user ID found for fetching user info');
          return;
        }
        
        const response = await axios.get(`${API_URL}/api/users/${userIdValue}`, {
          withCredentials: true,
        });
        dispatch(setUserinfo(response.data));
        setIsPrivate(response.data.isPrivate);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserinfo();
  }, [userId, dispatch]);



  // Change Password Handler
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordMsgType("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg("Please fill all fields.");
      setPasswordMsgType("error");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("New password and confirm password do not match.");
      setPasswordMsgType("error");
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await axios.put(
        `${API_URL}/api/settings/password`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      setPasswordMsg(res.data.message || "Password updated successfully");
      setPasswordMsgType("success");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    } catch (err) {
      setPasswordMsg(err.response?.data?.message || "Failed to change password.");
      setPasswordMsgType("error");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Privacy Toggle Handler
  const handlePrivacyToggle = async () => {
    setPrivacyLoading(true);
    setPrivacyMsg("");
    try {
      const res = await axios.put(
        `${API_URL}/api/settings/privacy`,
        { isPrivate: !isPrivate },
        { withCredentials: true }
      );
      setIsPrivate(res.data.isPrivate);
      setPrivacyMsg(res.data.message || "Privacy updated");
    } catch (err) {
      setPrivacyMsg(err.response?.data?.message || "Failed to update privacy.");
    } finally {
      setPrivacyLoading(false);
    }
  };

  // Delete Account Handler
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setDeleteMsg("");
    try {
      // Use helper function to get valid user ID
      const userIdValue = getValidUserId(userId.id);
      
      if (!userIdValue) {
        setDeleteMsg("User information is missing. Please try logging in again.");
        return;
      }
      
      await axios.delete(`${API_URL}/api/settings/account`, { 
        withCredentials: true,
      });
      Cookies.remove("token", { path: "/" });
      setDeleteMsg("Account deleted successfully.");
      setDeleteConfirm(false);
      // Optionally clear user state here
      navigate("/");
    } catch (err) {
      console.error("Delete account error:", err);
      setDeleteMsg(err.response?.data?.message || "Failed to delete account.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181b] via-[#23242a] to-[#101012] flex font-sans justify-center items-start py-10">
      <div className="w-full max-w-5xl bg-[#18181b] rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-[#23242a] border-r border-[#23242a] flex flex-row md:flex-col items-center md:items-stretch py-6 px-2 md:px-4 gap-2 md:gap-0">
          {SIDEBAR_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-base transition-all duration-150 mb-2 md:mb-0 md:mt-2
                ${selectedTab === tab.key ? "bg-pink-400/10 text-pink-300 shadow" : "text-gray-300 hover:bg-[#23242a]/60"}`}
              onClick={() => setSelectedTab(tab.key)}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 bg-[#18181b] flex flex-col gap-8">
          {/* Account (Profile Data + Delete Account) */}
          {selectedTab === "account" && (
            <section className="max-w-lg mx-auto w-full">
              <h2 className="text-2xl font-bold mb-6 text-white">Account</h2>
              <div className="space-y-5 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                  <div className="w-full px-4 py-2 rounded-lg border border-[#23242a] bg-[#23242a] text-white font-medium">{userinfo ? userinfo.fullName : "Loading..."}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                  <div className="w-full px-4 py-2 rounded-lg border border-[#23242a] bg-[#23242a] text-white font-medium">{userinfo ? userinfo.username : "Loading..."}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <div className="w-full px-4 py-2 rounded-lg border border-[#23242a] bg-[#23242a] text-white font-medium">{userinfo ? userinfo.email : "Loading..."}</div>
                </div>
              </div>
              <button onClick={() => setDeleteConfirm(true)} className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-red-500 hover:to-pink-600 transition flex items-center gap-2"><FiTrash2 /> Delete My Account</button>
              {deleteConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-[#23242a] rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center">
                    <div className="bg-red-400/20 rounded-full w-16 h-16 flex items-center justify-center text-red-400 text-4xl mb-4 shadow-lg">
                      <FiTrash2 />
                    </div>
                    <h3 className="text-xl font-bold text-red-400 mb-2 text-center">Are you sure?</h3>
                    <p className="text-gray-300 mb-4 text-center">This action cannot be undone. Your account and all data will be permanently deleted.</p>
                    <div className="flex gap-4 w-full justify-center">
                      <button onClick={handleDeleteAccount} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold" disabled={deleteLoading}>{deleteLoading ? "Deleting..." : "Yes, Delete"}</button>
                      <button onClick={() => setDeleteConfirm(false)} className="bg-gray-700 text-gray-200 px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
                    </div>
                    {deleteMsg && <div className="text-pink-400 text-sm mt-4">{deleteMsg}</div>}
          </div>
          </div>
              )}
        </section>
          )}
          {/* Security (Change Password) */}
          {selectedTab === "security" && (
            <section className="max-w-lg mx-auto w-full">
              <h2 className="text-2xl font-bold mb-6 text-white">Change Password</h2>
              <form className="space-y-5" onSubmit={handlePasswordChange}>
            <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
                  <input type={showPassword ? "text" : "password"} className="w-full px-4 py-2 rounded-lg border border-[#23242a] focus:ring-2 focus:ring-blue-400 bg-[#23242a] text-white" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            </div>
            <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                  <input type={showPassword ? "text" : "password"} className="w-full px-4 py-2 rounded-lg border border-[#23242a] focus:ring-2 focus:ring-blue-400 bg-[#23242a] text-white" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
                  <input type={showPassword ? "text" : "password"} className="w-full px-4 py-2 rounded-lg border border-[#23242a] focus:ring-2 focus:ring-blue-400 bg-[#23242a] text-white" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={showPassword} onChange={() => setShowPassword((s) => !s)} id="showpass" />
                  <label htmlFor="showpass" className="text-sm text-gray-400">Show Passwords</label>
            </div>
                {passwordMsg && (
                  <div className={`text-sm mt-1 ${passwordMsgType === "success" ? "text-green-400" : "text-pink-400"}`}>{passwordMsg}</div>
                )}
                <button type="submit" className="bg-gradient-to-r from-blue-400 to-pink-400 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-blue-500 hover:to-pink-500 transition" disabled={passwordLoading}>{passwordLoading ? "Changing..." : "Change Password"}</button>
          </form>
        </section>
          )}
        {/* Privacy */}
          {selectedTab === "privacy" && (
            <section className="max-w-lg mx-auto w-full">
              <h2 className="text-2xl font-bold mb-6 text-white">Privacy Settings</h2>
              <div className="flex items-center gap-4 bg-[#23242a] rounded-xl p-5 border border-[#23242a]">
                <span className="text-gray-200 font-medium flex-1">Private Profile</span>
                <button onClick={handlePrivacyToggle} className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-200 ${isPrivate ? 'bg-green-400' : 'bg-gray-600'}`} disabled={privacyLoading}> <span className={`bg-white w-5 h-5 rounded-full shadow transform transition-transform duration-200 ${isPrivate ? 'translate-x-7' : ''}`}></span></button>
                <span className="text-gray-400 text-sm">{isPrivate ? "Private" : "Public"}</span>
              </div>
              {privacyMsg && <div className="text-pink-400 text-sm mt-4">{privacyMsg}</div>}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Settings; 