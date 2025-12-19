import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_URL } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setUserinfo } from "../../store/slice/userinfoSlice";
import { 
  socialPlatforms, 
  detectPlatformFromUrl, 
  validateUrl, 
  formatUrlForDisplay 
} from "../../utils/socialLinks";

const EditProfileModal = ({ isOpen, onClose, userinfo }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    fullName: userinfo?.fullName || "",
    bio: userinfo?.bio || "",
    location: userinfo?.location || "",
    skills: userinfo?.skills || [],
    interests: userinfo?.interests || [],
    avatar: userinfo?.avatar || "",
    coverImage: userinfo?.coverImage || "",
    links: userinfo?.links || [],
  });
  const [step, setStep] = useState(0);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [newLink, setNewLink] = useState({ platform: "", url: "" });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const avatarInput = useRef();
  const coverInput = useRef();
  // Add preview state at the top
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const avatarReduxUrl = useSelector((state) => state.userinfo.profilePictureUrl);
  const coverReduxUrl = useSelector((state) => state.userinfo.coverPhotoUrl);
  // Add state at the top
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [avatarUploadError, setAvatarUploadError] = useState("");
  const [coverUploadError, setCoverUploadError] = useState("");
  const [location, setLocation] = useState({
    city: userinfo?.location?.city || "",
    state: userinfo?.location?.state || "",
    country: userinfo?.location?.country || "",
    address: userinfo?.location?.address || "",
    postalCode: userinfo?.location?.postalCode || "",
    coordinates: userinfo?.location?.coordinates || { type: 'Point', coordinates: [0, 0] },
  });
  const [locationError, setLocationError] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  // Reset form when userinfo changes or modal opens
  useEffect(() => {
    if (isOpen && userinfo) {
      setForm({
        fullName: userinfo.fullName || "",
        bio: userinfo.bio || "",
        location: userinfo.location || "",
        skills: userinfo.skills || [],
        interests: userinfo.interests || [],
        avatar: userinfo.avatar || "",
        coverImage: userinfo.coverImage || "",
        links: userinfo.socialLinks || userinfo.links || [],
      });
      setError("");
      setIsSuccess(false);
      setStep(0);
      setAvatarPreview("");
      setCoverPreview("");
      setIsUploadingAvatar(false);
      setIsUploadingCover(false);
      setAvatarUploadError("");
      setCoverUploadError("");
      // Don't clear fetchedAvatarUrl/fetchedCoverUrl here, let them persist for preview
    }
  }, [isOpen, userinfo]);

  useEffect(() => {
    // Remove the fetchImages function and its call if not needed anymore
  }, [isOpen]);

  if (!isOpen) return null;

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill && !form.skills.includes(newSkill)) {
      setForm((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }));
      setNewSkill("");
    }
  };
  const handleRemoveSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };
  const handleAddInterest = () => {
    if (newInterest && !form.interests.includes(newInterest)) {
      setForm((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest],
      }));
      setNewInterest("");
    }
  };
  const handleRemoveInterest = (interest) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const handleAddLink = () => {
    if (newLink.platform && newLink.url && !form.links.some(link => link.platform === newLink.platform)) {
      // Validate URL
      if (!validateUrl(newLink.url)) {
        setError("Please enter a valid URL starting with http:// or https://");
        return;
      }
      
      setForm((prev) => ({
        ...prev,
        links: [...prev.links, { ...newLink }],
      }));
      setNewLink({ platform: "", url: "" });
      setError("");
    }
  };

  const handleRemoveLink = (platform) => {
    setForm((prev) => ({
      ...prev,
      links: prev.links.filter((link) => link.platform !== platform),
    }));
  };

  const handleLinkChange = (e) => {
    const { name, value } = e.target;
    setNewLink((prev) => ({ ...prev, [name]: value }));
    
    // Auto-detect platform when URL is entered
    if (name === "url" && value && !newLink.platform) {
      const detectedPlatform = detectPlatformFromUrl(value);
      setNewLink((prev) => ({ ...prev, platform: detectedPlatform }));
    }
  };

  // Update handleImageChange to handle loading and error
  const handleImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    if (type === "avatar") setAvatarPreview(localUrl);
    if (type === "coverImage") setCoverPreview(localUrl);

    const formData = new FormData();
    if (type === "avatar") {
      formData.append("profilePicture", file);
      setIsUploadingAvatar(true);
      setAvatarUploadError("");
    } else if (type === "coverImage") {
      formData.append("coverPhoto", file);
      setIsUploadingCover(true);
      setCoverUploadError("");
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/media/upload-profile`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data.success) {
        if (type === "avatar" && response.data.data.profilePicture) {
          setForm((prev) => ({
            ...prev,
            avatar: response.data.data.profilePicture.url,
          }));
          setAvatarPreview(response.data.data.profilePicture.url);
        }
        if (type === "coverImage" && response.data.data.coverPhoto) {
          setForm((prev) => ({
            ...prev,
            coverImage: response.data.data.coverPhoto.url,
          }));
          setCoverPreview(response.data.data.coverPhoto.url);
        }
      } else {
        if (type === "avatar") setAvatarUploadError(response.data.message || "Failed to upload image");
        if (type === "coverImage") setCoverUploadError(response.data.message || "Failed to upload image");
      }
    } catch (err) {
      if (type === "avatar") setAvatarUploadError("Failed to upload image. Please try again.");
      if (type === "coverImage") setCoverUploadError("Failed to upload image. Please try again.");
    } finally {
      if (type === "avatar") setIsUploadingAvatar(false);
      if (type === "coverImage") setIsUploadingCover(false);
    }
  };
  const handleDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    handleImageChange({ target: { files: [file] } }, type);
  };

  // Reverse geocoding function
  const fetchAddressFromCoords = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const res = await fetch(url);
    const data = await res.json();
    return {
      city: data.address.city || data.address.town || data.address.village || "",
      state: data.address.state || "",
      country: data.address.country || "",
      address: data.display_name || "",
      postalCode: data.address.postcode || "",
    };
  };

  // Add handler for geolocation
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setLocationError("");
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const details = await fetchAddressFromCoords(lat, lng);
          setLocation({
            ...details,
            coordinates: {
              type: 'Point',
              coordinates: [lng, lat],
            },
          });
        } catch (err) {
          setLocationError("Failed to fetch address from coordinates. Please try again or enter manually.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setLocationError("Unable to fetch your location. Please allow location access or enter manually.");
        setIsLocating(false);
      }
    );
  };

  const validate = () => {
    if (!form.fullName.trim()) return "Full name is required.";
    return "";
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      // Prepare the data to send
      const updateData = {
        fullName: form.fullName,
        bio: form.bio,
        location: location,
        skills: form.skills,
        interests: form.interests,
        avatar: form.avatar,
        coverImage: form.coverImage,
        socialLinks: form.links,
      };

      // Make API call to update profile
      const response = await axios.put(
        `${API_URL}/api/users/${userinfo._id}`,
        updateData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response)

      if (response.data.success) {
        // Update Redux store with new user data
        dispatch(setUserinfo(response.data.user));

        // Show success state
        setIsSuccess(true);

        // Close modal after showing success
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 1500);
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };



  // Steps
  const steps = [
    {
      label: "Basic Info",
      icon: "👤",
              content: (
          <div className="space-y-4 sm:space-y-6">
            <div className="floating-label-group">
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleInputChange}
                className="floating-input"
                required
                autoFocus
                placeholder=" "
              />
              <label className="floating-label">Full Name</label>
            </div>
            <div className="floating-label-group">
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleInputChange}
                className="floating-input resize-none"
                rows={3}
                required
                placeholder=" "
              />
              <label className="floating-label">Bio</label>
            </div>
            <div className="space-y-2">
              <label className="text-white/80 text-sm font-medium">Location</label>
              <div className="flex flex-col gap-2">
                <input type="text" placeholder="City" value={location.city} onChange={e => setLocation({ ...location, city: e.target.value })} className="input" />
                <input type="text" placeholder="State" value={location.state} onChange={e => setLocation({ ...location, state: e.target.value })} className="input" />
                <input type="text" placeholder="Country" value={location.country} onChange={e => setLocation({ ...location, country: e.target.value })} className="input" />
                <input type="text" placeholder="Address" value={location.address} onChange={e => setLocation({ ...location, address: e.target.value })} className="input" />
                <input type="text" placeholder="Postal Code" value={location.postalCode} onChange={e => setLocation({ ...location, postalCode: e.target.value })} className="input" />
                <button type="button" onClick={handleUseMyLocation} className="bg-blue-500 text-white rounded px-3 py-1 mt-2 w-fit flex items-center gap-2" disabled={isLocating}>
                  {isLocating && <span className="loader border-2 border-t-2 border-white w-4 h-4 rounded-full animate-spin"></span>}
                  Use my location
                </button>
                {locationError && <p className="text-red-500 text-xs mt-1">{locationError}</p>}
                {location.coordinates && location.coordinates.coordinates && (
                  <p className="text-xs text-white/60">Coordinates: [{location.coordinates.coordinates[1]}, {location.coordinates.coordinates[0]}]</p>
                )}
              </div>
            </div>
          </div>
        ),
    },
    {
      label: "Skills & Interests",
      icon: "⭐",
              content: (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Skills</label>
              <div className="flex flex-col sm:flex-row gap-2 mb-2">
                <input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 px-3 py-2 rounded bg-[#23242a] text-white focus:ring-2 focus:ring-[#3B82F6] text-sm sm:text-base"
                  placeholder="Add skill"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-2 bg-[#3B82F6] text-white rounded shadow hover:bg-[#2563eb] transition-all text-sm sm:text-base"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    layout
                    className="chip-skill flex items-center gap-1 text-xs sm:text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 text-xs"
                      aria-label={`Remove ${skill}`}
                    >
                      ✕
                    </button>
                  </motion.span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Interests</label>
              <div className="flex flex-col sm:flex-row gap-2 mb-2">
                <input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  className="flex-1 px-3 py-2 rounded bg-[#23242a] text-white focus:ring-2 focus:ring-[#10B981] text-sm sm:text-base"
                  placeholder="Add interest"
                />
                <button
                  type="button"
                  onClick={handleAddInterest}
                  className="px-3 py-2 bg-[#10B981] text-white rounded shadow hover:bg-[#059669] transition-all text-sm sm:text-base"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.interests.map((interest) => (
                  <motion.span
                    key={interest}
                    layout
                    className="chip-interest flex items-center gap-1 text-xs sm:text-sm"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="ml-1 text-xs"
                      aria-label={`Remove ${interest}`}
                    >
                      ✕
                    </button>
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        ),
    },
    {
      label: "Social Links",
      icon: "🔗",
      content: (
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Add Social Links</label>
            
            {/* Helpful Note */}
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-300">
                💡 <strong>Tip:</strong> Use "Portfolio" for your personal website, "GitHub" for your code, and other platforms for social media profiles.
              </p>
            </div>
            
            {/* Quick Add Popular Platforms */}
            <div className="mb-4">
              <p className="text-xs text-white/60 mb-2">Quick add popular platforms:</p>
              <div className="flex flex-wrap gap-2">
                {socialPlatforms.slice(0, 6).map((platform) => (
                  <button
                    key={platform.value}
                    type="button"
                    onClick={() => setNewLink({ platform: platform.value, url: "" })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      newLink.platform === platform.value
                        ? "bg-[#8B5CF6] text-white"
                        : "bg-white/10 text-white/80 hover:bg-white/20"
                    }`}
                  >
                    {platform.icon} {platform.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  name="platform"
                  value={newLink.platform}
                  onChange={handleLinkChange}
                  className="flex-1 px-3 py-2 rounded bg-[#23242a] text-white focus:ring-2 focus:ring-[#8B5CF6] text-sm sm:text-base"
                >
                  <option value="">Select Platform</option>
                  {socialPlatforms.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.icon} {platform.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  name="url"
                  value={newLink.url}
                  onChange={handleLinkChange}
                  className="flex-1 px-3 py-2 rounded bg-[#23242a] text-white focus:ring-2 focus:ring-[#8B5CF6] text-sm sm:text-base"
                  placeholder="https://your-profile-url"
                />
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="px-3 py-2 bg-[#8B5CF6] text-white rounded shadow hover:bg-[#7C3AED] transition-all text-sm sm:text-base"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Your Links</label>
            <div className="space-y-2">
              {form.links.map((link) => {
                const platform = socialPlatforms.find(p => p.value === link.platform);
                return (
                  <motion.div
                    key={link.platform}
                    layout
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{platform?.icon || "🔗"}</span>
                      <div>
                        <p className="font-medium text-sm">{platform?.label || link.platform}</p>
                        <p className="text-xs text-white/60 truncate max-w-[200px]">{formatUrlForDisplay(link.url)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(link.platform)}
                      className="text-red-400 hover:text-red-600 text-sm"
                      aria-label={`Remove ${link.platform}`}
                    >
                      ✕
                    </button>
                  </motion.div>
                );
              })}
              {form.links.length === 0 && (
                <p className="text-white/40 text-sm text-center py-4">
                  No social links added yet
                </p>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Profile Images",
      icon: "🖼️",
              content: (
          <div className="space-y-4 sm:space-y-6">
            <div
              className="relative border-2 border-dashed border-[#3B82F6]/40 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer"
              onClick={() => avatarInput.current.click()}
              onDrop={(e) => handleDrop(e, "avatar")}
              onDragOver={(e) => e.preventDefault()}
              aria-label="Upload profile image"
            >
              <input
                ref={avatarInput}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "avatar")}
                className="hidden"
              />
              <span className="text-[#3B82F6] text-xl sm:text-2xl mb-2">🖼️</span>
              <span className="text-white/80 text-xs sm:text-sm text-center">
                Drag & drop or click to upload profile image
              </span>
              {(avatarPreview || form.avatar || avatarReduxUrl) && (
                <div className="mt-3 sm:mt-4 flex flex-col items-center gap-2">
                  <div className="relative">
                    <img
                      src={avatarReduxUrl || avatarPreview || form.avatar}
                      alt="Avatar preview"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-[#3B82F6]/60 shadow-lg"
                    />
                    {isUploadingAvatar && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                        <span className="loader border-2 border-t-2 border-[#3B82F6] w-8 h-8 rounded-full animate-spin"></span>
                      </div>
                    )}
                  </div>
                  {avatarUploadError && (
                    <div className="text-xs text-red-400 text-center mt-1">{avatarUploadError}</div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, avatar: "" }));
                      setAvatarPreview("");
                      setAvatarUploadError("");
                    }}
                    className="text-xs text-red-400 hover:text-red-600 bg-white/10 px-2 py-1 rounded transition-all duration-150"
                    aria-label="Remove avatar"
                    disabled={isUploadingAvatar}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
            <div
              className="relative border-2 border-dashed border-[#10B981]/40 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer"
              onClick={() => coverInput.current.click()}
              onDrop={(e) => handleDrop(e, "coverImage")}
              onDragOver={(e) => e.preventDefault()}
              aria-label="Upload cover image"
            >
              <input
                ref={coverInput}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "coverImage")}
                className="hidden"
              />
              <span className="text-[#10B981] text-xl sm:text-2xl mb-2">🖼️</span>
              <span className="text-white/80 text-xs sm:text-sm text-center">
                Drag & drop or click to upload cover image
              </span>
              {(coverPreview || form.coverImage || coverReduxUrl) && (
                <div className="mt-3 sm:mt-4 flex flex-col items-center gap-2 w-full">
                  <div className="relative w-full">
                    <img
                      src={coverPreview || form.coverImage || coverReduxUrl}
                      alt="Cover preview"
                      className="w-full h-20 sm:h-24 object-cover rounded shadow-lg"
                    />
                    {isUploadingCover && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded">
                        <span className="loader border-2 border-t-2 border-[#10B981] w-8 h-8 rounded-full animate-spin"></span>
                      </div>
                    )}
                  </div>
                  {coverUploadError && (
                    <div className="text-xs text-red-400 text-center mt-1">{coverUploadError}</div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, coverImage: "" }));
                      setCoverPreview("");
                      setCoverUploadError("");
                    }}
                    className="text-xs text-red-400 hover:text-red-600 bg-white/10 px-2 py-1 rounded transition-all duration-150"
                    aria-label="Remove cover image"
                    disabled={isUploadingCover}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        ),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#23242a]/90 glass-card rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-8 relative"
            initial={{ scale: 0.95, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl focus:outline-none"
              aria-label="Close"
            >
              ×
            </button>
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 tracking-tight bg-gradient-to-r from-[#3B82F6] to-[#10B981] bg-clip-text text-transparent">
                Edit Profile
              </h2>
              <p className="text-white/60 text-xs sm:text-sm">
                Step {step + 1} of {steps.length}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center mb-6 gap-2">
              {steps.map((s, idx) => (
                <motion.div
                  key={s.label}
                  className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                    step > idx
                      ? "bg-gradient-to-r from-[#3B82F6] to-[#10B981]"
                      : step === idx
                      ? "bg-gradient-to-r from-[#3B82F6] to-[#10B981]"
                      : "bg-white/10"
                  }`}
                  layout
                />
              ))}
            </div>

            {/* Step Navigation */}
            <div className="flex justify-center gap-3 sm:gap-6 mb-6 sm:mb-8 overflow-x-auto">
              {steps.map((s, idx) => (
                <button
                  key={s.label}
                  onClick={() => setStep(idx)}
                  className={`relative flex flex-col items-center gap-1 sm:gap-2 transition-all duration-200 flex-shrink-0 ${
                    step === idx
                      ? "text-[#3B82F6]"
                      : step > idx
                      ? "text-[#10B981]"
                      : "text-white/40 hover:text-white/60"
                  }`}
                  aria-current={step === idx ? "step" : undefined}
                  aria-label={s.label}
                  tabIndex={0}
                  title={s.label}
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold transition-all duration-200 ${
                      step === idx
                        ? "bg-gradient-to-br from-[#3B82F6] to-[#10B981] text-white shadow-lg scale-110 ring-4 ring-[#3B82F6]/40"
                        : step > idx
                        ? "bg-[#10B981]/20 text-[#10B981]"
                        : "bg-white/10 text-white/60 hover:bg-white/20"
                    }`}
                  >
                    {s.icon}
                  </div>
                  <span className="text-xs font-medium text-center">{s.label}</span>
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-6"
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm text-center"
                >
                  ✅ Profile updated successfully!
                </motion.div>
              )}
                              <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.4 }}
                    className="min-h-[250px] sm:min-h-[300px]"
                  >
                    {steps[step].content}
                  </motion.div>
                </AnimatePresence>
              <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6 sm:mt-8">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="px-4 sm:px-6 py-2 bg-white/10 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-white/20 focus:ring-2 focus:ring-[#3B82F6] transition-all duration-150 text-sm sm:text-base"
                  aria-label="Back"
                >
                  Back
                </button>
                <div className="flex gap-2 sm:gap-3">
                  {step < steps.length - 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setStep((s) => Math.min(steps.length - 1, s + 1))
                      }
                      className="px-4 sm:px-6 py-2 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 focus:ring-2 focus:ring-[#3B82F6] transition-all duration-150 text-sm sm:text-base"
                      aria-label="Next"
                    >
                      Next
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-6 sm:px-8 py-2 bg-gradient-to-r from-[#3B82F6] to-[#10B981] text-white rounded-lg font-bold disabled:opacity-50 hover:from-[#2563eb] hover:to-[#059669] focus:ring-2 focus:ring-[#10B981] transition-all duration-150 text-sm sm:text-base"
                    disabled={isSaving}
                    aria-label={
                      step === steps.length - 1
                        ? "Save Profile"
                        : "Save & Continue"
                    }
                  >
                    {isSaving
                      ? "Saving..."
                      : step === steps.length - 1
                      ? "Save Profile"
                      : "Save & Continue"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
