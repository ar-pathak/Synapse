import React, { useState, lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserinfo, setProfilePictureUrl, setCoverPhotoUrl } from "../../store/slice/userinfoSlice";
import LoadingFallback from "../utils/LoadingFallback";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_URL } from "../../utils/constants";
import {
  getPlatformIcon,
  getPlatformName,
  formatUrlForDisplay,
} from "../../utils/socialLinks";

const EditProfileModal = lazy(() => import("./EditProfileModal"));

const Profile = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.userinfo.userId);
  const userinfo = useSelector((state) => state.userinfo.userinfo);
  const avatarUrl = useSelector((state) => state.userinfo.profilePictureUrl);
  const coverUrl = useSelector((state) => state.userinfo.coverPhotoUrl);

  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserinfo = async () => {
      if (!userId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${API_URL}/api/users/${userId}`, {
          withCredentials: true,
        });
        dispatch(setUserinfo(response.data));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserinfo();
  }, [userId, dispatch]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const [avatarRes, coverRes] = await Promise.all([
          axios.get(`${API_URL}/api/media/user/profile_picture`, { withCredentials: true }),
          axios.get(`${API_URL}/api/media/user/cover_photo`, { withCredentials: true }),
        ]);
        dispatch(setProfilePictureUrl(avatarRes.data.data?.[0]?.publicUrl || ""));
        dispatch(setCoverPhotoUrl(coverRes.data.data?.[0]?.publicUrl || ""));
      } catch (err) {
        dispatch(setProfilePictureUrl(""));
        dispatch(setCoverPhotoUrl(""));
      }
    };
    if (userId) fetchImages();
  }, [userId, dispatch]);

  // Profile completion calculation
  const fields = [
    "fullName",
    "bio",
    "avatar",
    "location",
    "skills",
    "interests",
    "links",
  ];
  const completedFields = fields.filter((field) => userinfo && userinfo[field]);
  const profileCompletion = Math.round(
    (completedFields.length / fields.length) * 100
  );

  // Tab content renderers
  const renderOverview = () => (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="glass-card">
        <h3 className="text-xl font-semibold mb-2">About</h3>
        <p className="text-white/80">{userinfo?.bio || "No bio added yet."}</p>
      </div>

      <div className="glass-card">
        <h3 className="text-xl font-semibold mb-4">Skills & Interests</h3>
        <div className="flex flex-wrap gap-3">
          {(userinfo?.skills || []).map((skill) => (
            <span key={skill} className="chip-skill">
              {skill}
            </span>
          ))}
          {(userinfo?.interests || []).map((interest) => (
            <span key={interest} className="chip-interest">
              {interest}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderActivity = () => (
    <motion.div
      key="activity"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="glass-card"
    >
      <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {(userinfo?.notifications || []).map((notification, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.01 }}
            className="flex items-center gap-4 p-4 bg-white/5 rounded-lg shadow-md hover:bg-white/10 transition-colors duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-[#3B82F6]/10 flex items-center justify-center">
              <span role="img" aria-label="activity">
                📝
              </span>
            </div>
            <div>
              <p className="text-white/80">{notification.type}</p>
              <p className="text-xs text-white/60">
                {new Date(notification.createdAt).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderFollowers = () => (
    <motion.div
      key="followers"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="glass-card"
    >
      <h3 className="text-xl font-semibold mb-4">Followers</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(userinfo?.followers || []).map((follower) => (
          <motion.div
            key={follower._id}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 p-4 bg-white/5 rounded-lg shadow-md hover:bg-white/10 transition-all duration-200"
          >
            <img
              src={follower.avatar || "https://i.pravatar.cc/300"}
              alt={follower.fullName}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h4 className="font-medium">{follower.fullName}</h4>
              <p className="text-xs text-white/60">@{follower.username}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderLinks = () => (
    <motion.div
      key="links"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="glass-card"
    >
      <h3 className="text-xl font-semibold mb-4">Social Links</h3>
      {userinfo?.socialLinks && userinfo.socialLinks.length > 0 ? (
        <div className="flex gap-3 overflow-x-auto py-2">
          {userinfo.socialLinks.map((link) => (
            <motion.a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10 hover:bg-white/20 hover:border-white/20 transition-all duration-200 min-w-max"
            >
              <span className="text-xl">{getPlatformIcon(link.platform)}</span>
              <span className="font-semibold text-sm">{getPlatformName(link.platform)}</span>
              <span className="text-xs text-white/60 max-w-[120px] truncate">{formatUrlForDisplay(link.url)}</span>
              <span className="text-white/40 text-base">↗</span>
            </motion.a>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <span className="text-4xl mb-4 block">🔗</span>
          <p className="text-white/60 mb-4">No social links added yet</p>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-6 py-2 bg-gradient-to-r from-[#3B82F6] to-[#10B981] text-white rounded-lg font-semibold hover:from-[#2563EB] hover:to-[#059669] transition-all duration-200"
          >
            Add Links
          </button>
        </div>
      )}
    </motion.div>
  );

  const renderFollowing = () => (
    <motion.div
      key="following"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="glass-card"
    >
      <h3 className="text-xl font-semibold mb-4">Following</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(userinfo?.following || []).map((following) => (
          <motion.div
            key={following._id}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 p-4 bg-white/5 rounded-lg shadow-md hover:bg-white/10 transition-all duration-200"
          >
            <img
              src={following.avatar || "https://i.pravatar.cc/300"}
              alt={following.fullName}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h4 className="font-medium">{following.fullName}</h4>
              <p className="text-xs text-white/60">@{following.username}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderLocation = () => {
    const loc = userinfo?.location;
    if (!loc || (!loc.city && !loc.state && !loc.country && !loc.address && !loc.postalCode)) {
      return <span className="text-white/60">No location added yet.</span>;
    }
    return (
      <div className="text-white/80 text-sm">
        {loc.address && <div>{loc.address}</div>}
        <div>
          {[loc.city, loc.state, loc.country].filter(Boolean).join(", ")}
        </div>
        {loc.postalCode && <div>Postal Code: {loc.postalCode}</div>}
        {loc.coordinates && loc.coordinates.coordinates && Array.isArray(loc.coordinates.coordinates) && (
          <div className="text-xs text-white/40 mt-1">Coordinates: [{loc.coordinates.coordinates[1]}, {loc.coordinates.coordinates[0]}]</div>
        )}
      </div>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A1B1E] via-[#23242a] to-[#101113] text-white py-8 px-4 font-sans">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6] mx-auto mb-4"></div>
            <p className="text-white/80">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A1B1E] via-[#23242a] to-[#101113] text-white py-8 px-4 font-sans">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB]"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show message if no userinfo available
  if (!userinfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A1B1E] via-[#23242a] to-[#101113] text-white py-8 px-4 font-sans">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card text-center py-12">
            <p className="text-white/80 mb-4">No profile data available</p>
            <p className="text-white/60 text-sm">
              User ID: {userId || "Not set"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1B1E] via-[#23242a] to-[#101113] text-white py-4 sm:py-8 px-2 sm:px-4 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <motion.div
          className="relative rounded-xl sm:rounded-2xl shadow-2xl border border-white/10 overflow-hidden mb-6 sm:mb-8 glass-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative h-40 sm:h-56 group overflow-hidden">
            <motion.img
              src={
                coverUrl ||
                "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1740&q=80"
              }
              alt="Cover"
              className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-700"
              style={{ filter: "blur(0.5px) brightness(0.85)" }}
              initial={{ scale: 1 }}
              animate={{ scale: 1.1 }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
            <motion.button
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2.5 shadow-lg backdrop-blur-md focus:outline-none border border-white/20 transition-all duration-200"
              aria-label="Edit cover image"
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsEditModalOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </motion.button>
          </div>
          <div className="flex flex-col items-center -mt-16 sm:-mt-20 pb-6 sm:pb-8">
            <motion.div
              className="relative group"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.img
                src={avatarUrl || "https://i.pravatar.cc/300"}
                alt="Profile"
                className="w-24 h-24 sm:w-36 sm:h-36 rounded-full border-4 sm:border-8 border-[#3B82F6]/60 object-cover shadow-xl bg-[#23242a] transition-transform duration-300"
                whileHover={{ scale: 1.02 }}
              />
              <motion.button
                className="absolute -bottom-1 -right-1 sm:bottom-2 sm:right-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-full p-1.5 sm:p-2.5 shadow-lg focus:outline-none border border-white/20 transition-all duration-200"
                aria-label="Edit profile image"
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsEditModalOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 sm:h-4 sm:w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </motion.button>
            </motion.div>
            <h1 className="text-xl sm:text-3xl font-extrabold mt-4 sm:mt-6 tracking-tight drop-shadow-lg text-white/90 text-center px-2">
              {userinfo?.fullName || "Developer Name"}
            </h1>
            <span className="px-3 sm:px-4 py-1 bg-[#3B82F6]/20 text-[#3B82F6] rounded-full text-sm sm:text-base font-semibold mt-2 shadow">
              @{userinfo?.username}
            </span>
            <div className="w-full max-w-xs mt-4 sm:mt-6 px-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-white/60">
                  Profile Completion
                </span>
                <span className="text-xs font-medium">
                  {profileCompletion}%
                </span>
              </div>
              <div className="w-full h-2 sm:h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#06b6d4] rounded-full shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ width: `${profileCompletion}%` }}
                  transition={{ duration: 1 }}
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>
            <motion.button
              onClick={() => setIsEditModalOpen(true)}
              className="mt-4 sm:mt-6 px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[#3B82F6] to-[#06b6d4] hover:from-[#2563EB] hover:to-[#0ea5e9] text-white rounded-xl font-bold text-base sm:text-lg shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
            >
              Edit Profile
            </motion.button>
          </div>
        </motion.div>
        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 border-b border-white/10 mb-6 justify-center overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: "📊" },
            { id: "links", label: "Links", icon: "🔗" },
            { id: "activity", label: "Activity", icon: "📝" },
            { id: "followers", label: "Followers", icon: "👥" },
            { id: "following", label: "Following", icon: "👣" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-2 px-2 sm:px-4 font-semibold text-sm sm:text-lg transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-[#3B82F6] bg-white/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              {activeTab === tab.id && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute left-0 right-0 -bottom-1 h-1 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#06b6d4]"
                />
              )}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="glass-card">
                <h3 className="text-xl font-semibold mb-2">About</h3>
                <p className="text-white/80">{userinfo?.bio || "No bio added yet."}</p>
              </div>

              <div className="glass-card">
                <h3 className="text-xl font-semibold mb-4">Location</h3>
                {renderLocation()}
              </div>

              <div className="glass-card">
                <h3 className="text-xl font-semibold mb-4">Skills & Interests</h3>
                <div className="flex flex-wrap gap-3">
                  {(userinfo?.skills || []).map((skill) => (
                    <span key={skill} className="chip-skill">
                      {skill}
                    </span>
                  ))}
                  {(userinfo?.interests || []).map((interest) => (
                    <span key={interest} className="chip-interest">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === "links" && renderLinks()}
          {activeTab === "activity" && renderActivity()}
          {activeTab === "followers" && renderFollowers()}
          {activeTab === "following" && renderFollowing()}
        </AnimatePresence>
      </div>
      <Suspense fallback={<LoadingFallback />}>
        {isEditModalOpen && (
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            userinfo={userinfo}
          />
        )}
      </Suspense>
    </div>
  );
};

export default Profile;
