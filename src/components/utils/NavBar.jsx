import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { setIsLoggedIn, setUserinfo } from '../../store/slice/userinfoSlice';
import { searchService } from '../../services/searchService';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

// Search Section Component
const SearchSection = ({ title, items, onItemClick, icon, type = 'search' }) => {
    return (
        <div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-white/60 text-xs sm:text-sm mb-1.5 sm:mb-2">
                {icon === 'clock' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
                {icon === 'lightning' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                )}
                {icon === 'trending' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                )}
                <span>{title}</span>
            </div>
            <div className="space-y-0.5 sm:space-y-1">
                {items.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => onItemClick(item)}
                        className="w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors duration-200 text-xs sm:text-sm flex items-center gap-2"
                    >
                        {type === 'suggestion' && item.avatar && (
                            <img src={item.avatar} alt="" className="w-4 h-4 rounded-full" />
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="truncate">{item.title || item}</div>
                            {type === 'suggestion' && item.subtitle && (
                                <div className="text-xs text-white/60 truncate">{item.subtitle}</div>
                            )}
                        </div>
                        {type === 'suggestion' && (
                            <span className="text-xs text-white/40 capitalize">{item.type}</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Trending Skills Component
const TrendingSkills = ({ skills, onSkillClick }) => {
    return (
        <div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-white/60 text-xs sm:text-sm mb-1.5 sm:mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>Trending Skills</span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {skills.map((skill, index) => (
                    <button
                        key={index}
                        onClick={() => onSkillClick(skill.skill || skill)}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/5 text-white/80 hover:bg-white/10 transition-colors duration-200 text-xs sm:text-sm"
                    >
                        {skill.skill || skill}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Enhanced Search Component with real-time functionality
const SearchBar = ({ isLoggedIn, onSearch }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [trendingSearches, setTrendingSearches] = useState({ skills: [], hashtags: [], users: [] });
    const [isLoading, setIsLoading] = useState(false);
    const searchRef = useRef(null);

    // Load recent searches and trending data
    useEffect(() => {
        if (isLoggedIn) {
            setRecentSearches(searchService.getSearchHistory());
            loadTrendingSearches();
        }
    }, [isLoggedIn]);

    const loadTrendingSearches = async () => {
        try {
            const trending = await searchService.getTrendingSearches(5);
            setTrendingSearches(trending.trending || { skills: [], hashtags: [], users: [] });
        } catch (error) {
            console.error('Error loading trending searches:', error);
        }
    };

    // Debounced search with suggestions
    useEffect(() => {
        if (searchQuery.trim().length >= 2) {
            setIsLoading(true);
            searchService.debouncedSearch(searchQuery, (results) => {
                setSuggestions(results.suggestions || []);
                setIsLoading(false);
            }, 300);
        } else {
            setSuggestions([]);
            setIsLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setIsSearchOpen(false);
        searchService.addToSearchHistory(query);
        onSearch(query);
    };

    const handleSuggestionClick = (suggestion) => {
        if (suggestion.type === 'user') {
            handleSearch(suggestion.title);
        } else if (suggestion.type === 'skill') {
            handleSearch(suggestion.title);
        } else if (suggestion.type === 'post') {
            handleSearch(suggestion.title);
        } else {
            handleSearch(suggestion);
        }
    };

    if (!isLoggedIn) return null;

    return (
        <div className="relative w-full max-w-md mx-auto" ref={searchRef}>
            <div className="relative group">
                <input
                    type="text"
                    placeholder="Search developers, skills, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                    className="w-full bg-white/5 text-white placeholder-white/40 rounded-lg pl-8 sm:pl-10 pr-4 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:bg-white/10 group-hover:bg-white/10"
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-white/40 absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 group-hover:text-white/60 transition-colors duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
                {isLoading && (
                    <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white/40"></div>
                    </div>
                )}
            </div>
            {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#2A2B2E] rounded-lg shadow-lg border border-white/10 overflow-hidden transform transition-all duration-200 ease-in-out z-50 max-h-96 overflow-y-auto">
                    {searchQuery ? (
                        <div className="p-2 sm:p-4">
                            <div className="flex items-center gap-2 text-white/60 text-xs sm:text-sm mb-2 sm:mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span>Search for "{searchQuery}"</span>
                            </div>
                            
                            {/* Suggestions */}
                            {suggestions.length > 0 && (
                                <div className="mb-4">
                                    <div className="text-xs sm:text-sm text-white/60 mb-2">Suggestions</div>
                                    <SearchSection
                                        title=""
                                        items={suggestions}
                                        onItemClick={handleSuggestionClick}
                                        type="suggestion"
                                    />
                                </div>
                            )}
                            
                            <button
                                onClick={() => handleSearch(searchQuery)}
                                className="w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors duration-200 text-xs sm:text-sm"
                            >
                                Search for "{searchQuery}"
                            </button>
                        </div>
                    ) : (
                        <div className="p-2 sm:p-4 space-y-4 sm:space-y-6">
                            {/* Recent Searches */}
                            {recentSearches.length > 0 && (
                                <SearchSection
                                    title="Recent Searches"
                                    items={recentSearches}
                                    onItemClick={handleSearch}
                                    icon="clock"
                                />
                            )}
                            
                            {/* Trending Skills */}
                            {trendingSearches.skills.length > 0 && (
                                <TrendingSkills
                                    skills={trendingSearches.skills}
                                    onSkillClick={handleSearch}
                                />
                            )}
                            
                            {/* Popular Users */}
                            {trendingSearches.users.length > 0 && (
                                <SearchSection
                                    title="Popular Users"
                                    items={trendingSearches.users.map(user => ({
                                        title: user.fullName,
                                        subtitle: `@${user.username}`,
                                        avatar: user.avatar,
                                        type: 'user'
                                    }))}
                                    onItemClick={handleSuggestionClick}
                                    icon="lightning"
                                    type="suggestion"
                                />
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Enhanced Notifications Component
const Notifications = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications] = useState([]); // This can be replaced with real data later
    const notificationsRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={notificationsRef}>
            <button
                className="btn btn-ghost btn-circle hover:bg-white/10 transition-colors duration-200"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notifications"
            >
                <div className="indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {notifications.length > 0 && (
                        <span className="badge badge-xs badge-primary indicator-item"></span>
                    )}
                </div>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 bg-[#2A2B2E] rounded-lg shadow-lg border border-white/10 transform transition-all duration-200 ease-in-out z-50">
                    <div className="p-4 border-b border-white/10">
                        <h3 className="text-white font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <div key={index} className="p-4 border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                                    {notification}
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-white/60">
                                No new notifications
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t border-white/10">
                        <button
                            className="w-full text-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
                            onClick={() => { setIsOpen(false); navigate('/notifications'); }}
                        >
                            View all notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Logout Confirmation Modal Component
const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm, isLoggingOut }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#2A2B2E] rounded-xl shadow-xl border border-white/10 w-full max-w-md transform transition-all duration-300 scale-95 opacity-0"
                style={{ animation: 'modalIn 0.2s ease-out forwards' }}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-white">Sign Out</h3>
                        <button
                            onClick={onClose}
                            className="text-white/60 hover:text-white transition-colors duration-200"
                            disabled={isLoggingOut}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-white/80 mb-6">Are you sure you want to sign out? You'll need to sign in again to access your account.</p>
                    <div className="flex gap-3">
                        <button
                            onClick={onConfirm}
                            disabled={isLoggingOut}
                            className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoggingOut ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing out...
                                </span>
                            ) : (
                                'Yes, sign out'
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={isLoggingOut}
                            className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Enhanced Profile Menu Component
const ProfileMenu = ({ userinfo, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogoutClick = async () => {
        setIsLoggingOut(true);
        try {
            await onLogout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
            setShowLogoutConfirm(false);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:bg-white/10 p-2 rounded-lg transition-colors duration-200"
            >
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/20">
                    <img
                        src={userinfo?.avatar || "https://i.pravatar.cc/40?img=3"}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                    />
                </div>
                <span className="text-white/80 hidden sm:block">{userinfo?.name || 'User'}</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-52 bg-[#2A2B2E] rounded-lg shadow-lg border border-white/10 transform transition-all duration-200 ease-in-out z-50">
                    <div className="p-2">
                        <Link
                            to="/profile"
                            className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                            onClick={() => setIsOpen(false)}
                        >
                            Profile
                        </Link>
                        <Link
                            to="/settings"
                            className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                            onClick={() => setIsOpen(false)}
                        >
                            Settings
                        </Link>
                        <div className="divider my-1 border-white/10"></div>
                        <button
                            onClick={() => {
                                setShowLogoutConfirm(true);
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors duration-200"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
            <LogoutConfirmationModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogoutClick}
                isLoggingOut={isLoggingOut}
            />
        </div>
    );
};

// Enhanced Mobile Menu Component
const MobileMenu = ({ isOpen, onClose, isActive }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden">
            <div className="absolute top-0 right-0 bottom-0 w-[80%] max-w-sm bg-[#2A2B2E] transform transition-transform duration-300 ease-in-out">
                <div className="p-4 border-b border-white/10">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-4 space-y-2">
                    <Link
                        to="/feed"
                        className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/feed')
                                ? 'bg-white/10 text-white'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                        onClick={onClose}
                    >
                        Feed
                    </Link>
                    <Link
                        to="/explore"
                        className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/explore')
                                ? 'bg-white/10 text-white'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                        onClick={onClose}
                    >
                        Explore
                    </Link>
                    <Link
                        to="/bookmarks"
                        className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/bookmarks')
                                ? 'bg-white/10 text-white'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                        onClick={onClose}
                    >
                        Bookmarks
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Toast Component
const Toast = ({ message, type = 'success', onClose }) => {
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const icon = type === 'success' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
    );

    return (
        <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full flex items-center gap-2`}
            style={{ animation: 'toastIn 0.3s ease-out forwards' }}>
            <div className="flex-shrink-0">
                {icon}
            </div>
            <p className="flex-1">{message}</p>
            <button
                onClick={onClose}
                className="flex-shrink-0 ml-2 hover:opacity-80 transition-opacity duration-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
};

// Main Enhanced NavBar Component
const NavBar = () => {
    const userinfo = useSelector((state) => state.userinfo);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [logoutError, setLogoutError] = useState(null);
    const [toast, setToast] = useState(null);
    const mobileMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const showToast = (message, type = 'success') => {
        const toastElement = document.createElement('div');
        toastElement.className = `fixed top-4 right-4 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2`;
        toastElement.style.transform = 'translateX(120%)'; // Start off-screen
        toastElement.style.transition = 'transform 0.3s ease-out';
        
        const icon = type === 'success' ? (
            '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>'
        ) : (
            '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>'
        );
        
        toastElement.innerHTML = `
            <div class="flex-shrink-0">${icon}</div>
            <p class="flex-1">${message}</p>
            <button class="flex-shrink-0 ml-2 hover:opacity-80 transition-opacity duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </button>
        `;
        
        document.body.appendChild(toastElement);
        
        // Force a reflow to ensure the initial transform is applied
        toastElement.offsetHeight;
        
        // Animate in
        requestAnimationFrame(() => {
            toastElement.style.transform = 'translateX(0)';
        });
        
        // Add click handler for close button
        const closeButton = toastElement.querySelector('button');
        closeButton.addEventListener('click', () => {
            toastElement.style.transform = 'translateX(120%)';
            setTimeout(() => {
                if (document.body.contains(toastElement)) {
                    document.body.removeChild(toastElement);
                }
            }, 300);
        });
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (document.body.contains(toastElement)) {
                toastElement.style.transform = 'translateX(120%)';
                setTimeout(() => {
                    if (document.body.contains(toastElement)) {
                        document.body.removeChild(toastElement);
                    }
                }, 300);
            }
        }, 3000);
    };

    const handleLogout = async () => {
        setLogoutError(null);
        try {
            await axios.get(`${API_URL}/api/auth/logout`, { withCredentials: true });
            dispatch(setUserinfo(null));
            dispatch(setIsLoggedIn(false));
            // Clear any local storage or session storage if needed
            localStorage.removeItem('userPreferences');
            sessionStorage.clear();
            
            // Show success message
            showToast('Successfully signed out. See you soon! 👋');
            
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            setLogoutError(error.response?.data?.message || 'Failed to sign out. Please try again.');
            showToast(logoutError, 'error');
            throw error;
        }
    };

    const handleSearch = (query) => {
        navigate(`/explore?q=${encodeURIComponent(query)}`);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <>
            <nav className="bg-[#1A1B1E] border-b border-white/10 shadow-lg sticky top-0 z-50">
                <div className="max-w-[1440px] mx-auto px-2 sm:px-4 py-2 sm:py-3">
                    <div className="flex items-center justify-between gap-2">
                        {/* Left: Logo and Navigation */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Link
                                to="/"
                                className="text-lg sm:text-xl font-extrabold text-white tracking-wide hover:bg-white/10 px-1 sm:px-2 py-1 rounded-lg transition-colors duration-200"
                            >
                                SYNAPSE
                            </Link>
                            {userinfo?.isLoggedIn && (
                                <div className="hidden md:flex items-center gap-2">
                                    <Link
                                        to="/feed"
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/feed')
                                                ? 'bg-white/10 text-white'
                                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        Feed
                                    </Link>
                                    <Link
                                        to="/explore"
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/explore')
                                                ? 'bg-white/10 text-white'
                                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        Explore
                                    </Link>
                                    <Link
                                        to="/bookmarks"
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/bookmarks')
                                                ? 'bg-white/10 text-white'
                                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        Bookmarks
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Center: Search Bar */}
                        <div className="flex-1 max-w-2xl mx-2 sm:mx-4 min-w-0">
                            <SearchBar isLoggedIn={userinfo?.isLoggedIn} onSearch={handleSearch} />
                        </div>

                        {/* Right: Actions and Profile */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            {userinfo?.isLoggedIn ? (
                                <>
                                    <button
                                        className="md:hidden btn btn-ghost btn-circle hover:bg-white/10 transition-colors duration-200 p-1 sm:p-2"
                                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                        aria-label="Toggle mobile menu"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                    <div className="hidden sm:block">
                                        <Notifications />
                                    </div>
                                    <ProfileMenu userinfo={userinfo} onLogout={handleLogout} />
                                </>
                            ) : (
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <Link
                                        to="/auth/signin"
                                        className="btn btn-ghost text-white hover:bg-white/10 transition-colors duration-200 text-sm sm:text-base px-2 sm:px-4"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/auth/signup"
                                        className="btn bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 text-sm sm:text-base px-2 sm:px-4"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            {/* Mobile Menu */}
            <MobileMenu
                isOpen={isMobileMenuOpen && userinfo?.isLoggedIn}
                onClose={() => setIsMobileMenuOpen(false)}
                isActive={isActive}
            />
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
};

export default NavBar; 