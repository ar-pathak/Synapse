# Social Links Feature

## Overview
The social links feature allows users to add and manage their social media profiles and other important links on their profile page. Each link is displayed with an appropriate icon and opens in a new tab when clicked.

## Features

### Supported Platforms
The following social media platforms are supported with custom icons:

- **GitHub** 🐙 - For developers to showcase their code
- **Twitter/X** 🐦 - For social media presence
- **LinkedIn** 💼 - For professional networking
- **YouTube** 📺 - For video content creators
- **Instagram** 📷 - For visual content
- **Facebook** 📘 - For social networking
- **WhatsApp** 💬 - For direct messaging
- **Telegram** 📱 - For messaging and groups
- **Discord** 🎮 - For gaming and community
- **Medium** 📝 - For blog posts and articles
- **Dev.to** 💻 - For developer articles
- **Stack Overflow** 🔍 - For developer Q&A
- **Portfolio** 🎨 - For personal websites
- **Other** 🔗 - For any other links

### Key Features

1. **Auto-Detection**: When you paste a URL, the platform is automatically detected based on the domain
2. **URL Validation**: All URLs are validated to ensure they start with http:// or https://
3. **Quick Add**: Popular platforms can be added quickly with one click
4. **Visual Display**: Links are displayed with platform-specific icons and colors
5. **Responsive Design**: Works well on both desktop and mobile devices

## How to Use

### Adding Social Links

1. Go to your profile page
2. Click "Edit Profile"
3. Navigate to the "Social Links" step (🔗)
4. Choose a platform from the dropdown or use the quick add buttons
5. Enter your profile URL
6. Click "Add" to save the link
7. Repeat for additional platforms

### Managing Links

- **Edit**: Click on a link to modify it
- **Remove**: Click the "✕" button to delete a link
- **Reorder**: Links are displayed in the order they were added

### Viewing Links

- **Profile Overview**: Links appear in the overview tab
- **Dedicated Links Tab**: All links are displayed in a dedicated "Links" tab
- **Click to Visit**: Click any link to open it in a new tab

## Technical Implementation

### Frontend Components
- `EditProfileModal.jsx` - Modal for adding/editing links
- `Profile.jsx` - Display of links on profile page
- `socialLinks.js` - Utility functions for platform detection and formatting

### Data Structure
Each link is stored as an object:
```javascript
{
  platform: "github", // Platform identifier
  url: "https://github.com/username" // Full URL
}
```

### API Integration
The links are saved as part of the user profile data and sent to the backend via the existing user update endpoint.

## Customization

### Adding New Platforms
To add a new platform, update the `socialPlatforms` array in `src/utils/socialLinks.js`:

```javascript
{ value: "newplatform", label: "New Platform", icon: "🎯", color: "#FF0000" }
```

### Platform Detection
Add detection logic in the `detectPlatformFromUrl` function:

```javascript
if (urlLower.includes("newplatform.com")) return "newplatform";
```

## Future Enhancements

- [ ] Link analytics and click tracking
- [ ] Custom link ordering
- [ ] Link categories (social, professional, portfolio, etc.)
- [ ] Link preview cards
- [ ] Integration with platform APIs for profile verification
- [ ] Bulk import from other platforms 