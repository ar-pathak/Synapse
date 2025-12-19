import React, { useState } from "react";
import { FiBell, FiUser, FiHeart, FiMessageCircle, FiUserPlus, FiCircle } from "react-icons/fi";

const notificationsData = [
  {
    id: 1,
    type: "like",
    user: {
      name: "Alex Smith",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    message: "liked your post",
    time: "2m ago",
    read: false,
  },
  {
    id: 2,
    type: "comment",
    user: {
      name: "Emily Clark",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    message: "commented: 'Great work!'",
    time: "10m ago",
    read: false,
  },
  {
    id: 3,
    type: "follow",
    user: {
      name: "Michael Lee",
      avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    },
    message: "started following you",
    time: "1h ago",
    read: true,
  },
  {
    id: 4,
    type: "like",
    user: {
      name: "Sara Kim",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    message: "liked your photo",
    time: "3h ago",
    read: true,
  },
];

const typeIcon = (type) => {
  switch (type) {
    case "like":
      return <FiHeart className="text-pink-400" size={18} title="Like" />;
    case "comment":
      return <FiMessageCircle className="text-blue-400" size={18} title="Comment" />;
    case "follow":
      return <FiUserPlus className="text-green-400" size={18} title="Follow" />;
    default:
      return <FiUser className="text-gray-400" size={18} title="Other" />;
  }
};

const NotificationCard = ({ notification }) => (
  <div
    className={`flex items-center gap-4 p-5 rounded-2xl shadow-md bg-gradient-to-br from-[#23242a] to-[#18181b] border border-white/10 transition group hover:shadow-lg ${!notification.read ? "ring-2 ring-pink-400/40" : ""}`}
  >
    <div className="relative">
      <img
        src={notification.user.avatar}
        alt={notification.user.name}
        className="w-12 h-12 rounded-full border-2 border-[#23242a] shadow-sm"
      />
      {!notification.read && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full border-2 border-[#18181b] animate-pulse" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-white truncate">{notification.user.name}</span>
        {typeIcon(notification.type)}
      </div>
      <div className="text-gray-300 text-sm truncate">{notification.message}</div>
    </div>
    <div className="flex flex-col items-end gap-2 min-w-[70px]">
      <span className="text-xs text-gray-500 whitespace-nowrap">{notification.time}</span>
      {!notification.read && <FiCircle className="text-pink-400" size={12} title="Unread" />}
    </div>
  </div>
);

const Notifications = () => {
  const [notifications] = useState(notificationsData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181b] via-[#23242a] to-[#101012] flex font-sans justify-center items-start py-10">
      <main className="w-full max-w-2xl flex flex-col items-center px-4 sm:px-10">
        <div className="w-full flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#23242a] shadow-md">
            <FiBell className="text-pink-400" size={26} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Notifications</h2>
        </div>
        <div className="w-full space-y-5">
          {notifications.length === 0 ? (
            <div className="text-center text-gray-500 py-24 text-lg flex flex-col items-center gap-2">
              <FiBell size={48} className="text-pink-400 mb-2 animate-bounce" />
              No notifications.
            </div>
          ) : (
            notifications.map((n) => <NotificationCard key={n.id} notification={n} />)
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications; 