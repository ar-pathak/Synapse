// Social media platforms configuration
export const socialPlatforms = [
  { value: "github", label: "GitHub", icon: "🐙", color: "#333" },
  { value: "twitter", label: "Twitter/X", icon: "🐦", color: "#1DA1F2" },
  { value: "linkedin", label: "LinkedIn", icon: "💼", color: "#0077B5" },
  { value: "youtube", label: "YouTube", icon: "📺", color: "#FF0000" },
  { value: "instagram", label: "Instagram", icon: "📷", color: "#E4405F" },
  { value: "facebook", label: "Facebook", icon: "📘", color: "#1877F2" },
  { value: "whatsapp", label: "WhatsApp", icon: "💬", color: "#25D366" },
  { value: "telegram", label: "Telegram", icon: "📱", color: "#0088CC" },
  { value: "discord", label: "Discord", icon: "🎮", color: "#5865F2" },
  { value: "medium", label: "Medium", icon: "📝", color: "#000000" },
  { value: "dev", label: "Dev.to", icon: "💻", color: "#0A0A0A" },
  { value: "stackoverflow", label: "Stack Overflow", icon: "🔍", color: "#F48024" },
  { value: "portfolio", label: "Portfolio", icon: "🎨", color: "#6366F1" },
  { value: "other", label: "Other", icon: "🔗", color: "#6B7280" },
];

// Get platform icon by platform value
export const getPlatformIcon = (platform) => {
  const platformData = socialPlatforms.find(p => p.value === platform);
  return platformData?.icon || "🔗";
};

// Get platform name by platform value
export const getPlatformName = (platform) => {
  const platformData = socialPlatforms.find(p => p.value === platform);
  return platformData?.label || platform;
};

// Get platform color by platform value
export const getPlatformColor = (platform) => {
  const platformData = socialPlatforms.find(p => p.value === platform);
  return platformData?.color || "#6B7280";
};

// Auto-detect platform from URL
export const detectPlatformFromUrl = (url) => {
  if (!url) return "other";
  
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes("github.com")) return "github";
  if (urlLower.includes("twitter.com") || urlLower.includes("x.com")) return "twitter";
  if (urlLower.includes("linkedin.com")) return "linkedin";
  if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be")) return "youtube";
  if (urlLower.includes("instagram.com")) return "instagram";
  if (urlLower.includes("facebook.com")) return "facebook";
  if (urlLower.includes("wa.me") || urlLower.includes("whatsapp.com")) return "whatsapp";
  if (urlLower.includes("t.me")) return "telegram";
  if (urlLower.includes("discord.com") || urlLower.includes("discord.gg")) return "discord";
  if (urlLower.includes("medium.com")) return "medium";
  if (urlLower.includes("dev.to")) return "dev";
  if (urlLower.includes("stackoverflow.com")) return "stackoverflow";
  
  return "other";
};

// Validate URL format
export const validateUrl = (url) => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
};

// Format URL for display (remove protocol)
export const formatUrlForDisplay = (url) => {
  if (!url) return "";
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "");
};

// Get platform suggestions based on user's profession/role
export const getPlatformSuggestions = (userRole) => {
  const suggestions = {
    developer: ["github", "linkedin", "stackoverflow", "dev", "portfolio"],
    designer: ["linkedin", "instagram", "portfolio", "behance", "dribbble"],
    content_creator: ["youtube", "instagram", "twitter", "medium", "tiktok"],
    business: ["linkedin", "twitter", "facebook", "instagram"],
    student: ["github", "linkedin", "twitter", "instagram"],
    default: ["github", "linkedin", "twitter", "instagram"]
  };
  
  return suggestions[userRole] || suggestions.default;
}; 