import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { searchService } from '../../services/searchService';

const Explore = () => {
    const [developers, setDevelopers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedExperience, setSelectedExperience] = useState('all');
    const [sortBy, setSortBy] = useState('relevance');
    const [followedDevelopers, setFollowedDevelopers] = useState(new Set());
    const [availableSkills, setAvailableSkills] = useState([]);
    const [availableLocations, setAvailableLocations] = useState([]);
    const [availableExperience, setAvailableExperience] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        hasMore: false
    });
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Helper function to format location
    const formatLocation = (location) => {
        if (!location) return 'Location not specified';
        
        // If location is a string, return it directly
        if (typeof location === 'string') return location;
        
        // If location is an object, format it
        if (typeof location === 'object') {
            const parts = [];
            if (location.city) parts.push(location.city);
            if (location.state) parts.push(location.state);
            if (location.country) parts.push(location.country);
            
            if (parts.length > 0) {
                return parts.join(', ');
            }
            
            // If no city/state/country, try address
            if (location.address) return location.address;
            
            return 'Location not specified';
        }
        
        return 'Location not specified';
    };

    // Initialize from URL params
    useEffect(() => {
        const query = searchParams.get('q') || '';
        const skills = searchParams.get('skills') || '';
        const experience = searchParams.get('experience') || 'all';
        const sort = searchParams.get('sort') || 'relevance';

        setSearchQuery(query);
        setSelectedSkills(skills ? skills.split(',') : []);
        setSelectedExperience(experience);
        setSortBy(sort);
    }, [searchParams]);

    // Load filters
    useEffect(() => {
        loadSearchFilters();
    }, []);

    // Load developers based on current filters
    useEffect(() => {
        loadDevelopers();
    }, [searchQuery, selectedSkills, selectedExperience, sortBy, pagination.currentPage]);

    const loadSearchFilters = async () => {
        try {
            const filters = await searchService.getSearchFilters();
            setAvailableSkills(filters.filters?.skills || []);
            setAvailableLocations(filters.filters?.locations || []);
            setAvailableExperience(filters.filters?.experience || []);
        } catch (error) {
            console.error('Error loading filters:', error);
        }
    };

    const loadDevelopers = async () => {
        setLoading(true);
        try {
            const filters = {
                query: searchQuery,
                skills: selectedSkills,
                experience: selectedExperience === 'all' ? '' : selectedExperience,
                sortBy,
                page: pagination.currentPage,
                limit: 12
            };

            const results = await searchService.searchUsersAdvanced(filters);
            
            if (results.success) {
                setDevelopers(results.results?.users || []);
                setPagination({
                    currentPage: results.pagination?.currentPage || 1,
                    totalPages: results.pagination?.totalPages || 1,
                    hasMore: results.pagination?.hasMore || false
                });
            }
        } catch (error) {
            console.error('Error loading developers:', error);
            // Fallback to mock data
            setDevelopers([
                {
                    _id: '1',
                    fullName: 'John Doe',
                    username: 'johndoe',
                    title: 'Full Stack Developer',
                    skills: ['React', 'Node.js', 'Python'],
                    avatar: 'https://i.pravatar.cc/150?img=1',
                    experience: '5+ years',
                    location: 'San Francisco, CA',
                    bio: 'Passionate about building scalable web applications and mentoring junior developers.',
                    github: 'johndoe',
                    linkedin: 'johndoe',
                    projects: 12,
                    connections: 156,
                    followers: []
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileClick = (developerId) => {
        navigate(`/profile/${developerId}`);
    };

    const handleSkillToggle = (skill) => {
        const newSkills = selectedSkills.includes(skill)
            ? selectedSkills.filter(s => s !== skill)
            : [...selectedSkills, skill];
        
        setSelectedSkills(newSkills);
        updateURLParams({ skills: newSkills.join(',') });
    };

    const handleFollow = async (developerId, e) => {
        e.stopPropagation();
        try {
            // TODO: Implement follow/unfollow API call
            setFollowedDevelopers(prev => {
                const newSet = new Set(prev);
                if (newSet.has(developerId)) {
                    newSet.delete(developerId);
                } else {
                    newSet.add(developerId);
                }
                return newSet;
            });
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const updateURLParams = (newParams) => {
        const current = Object.fromEntries(searchParams.entries());
        const updated = { ...current, ...newParams };
        setSearchParams(updated);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        updateURLParams({ q: query });
    };

    const handleExperienceChange = (e) => {
        const experience = e.target.value;
        setSelectedExperience(experience);
        updateURLParams({ experience });
    };

    const handleSortChange = (e) => {
        const sort = e.target.value;
        setSortBy(sort);
        updateURLParams({ sort });
    };

    const loadMore = () => {
        if (pagination.hasMore) {
            setPagination(prev => ({
                ...prev,
                currentPage: prev.currentPage + 1
            }));
        }
    };

    if (loading && developers.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-8 gap-2 sm:gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Explore Developers</h1>
                <div className="flex flex-wrap gap-2 sm:gap-4">
                    <select
                        value={sortBy}
                        onChange={handleSortChange}
                        className="bg-[#2A2B2E] text-white border border-white/10 rounded-lg px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="relevance">Most Relevant</option>
                        <option value="recent">Most Recent</option>
                        <option value="popular">Most Popular</option>
                    </select>
                    <select
                        value={selectedExperience}
                        onChange={handleExperienceChange}
                        className="bg-[#2A2B2E] text-white border border-white/10 rounded-lg px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Experience</option>
                        {availableExperience.map(exp => (
                            <option key={exp} value={exp}>{exp}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-4 sm:mb-8 space-y-3 sm:space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search developers by name, title, or skills..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full bg-[#2A2B2E] text-white border border-white/10 rounded-lg pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 text-white/40 absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2"
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
                </div>

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {availableSkills.slice(0, 20).map((skill) => (
                        <button
                            key={skill}
                            onClick={() => handleSkillToggle(skill)}
                            className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition ${
                                selectedSkills.includes(skill)
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                            }`}
                        >
                            {skill}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Count */}
            <p className="text-white/60 text-xs sm:text-sm mb-4 sm:mb-6">
                Found {developers.length} developer{developers.length !== 1 ? 's' : ''}
            </p>

            {/* Developer Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {developers.map((developer) => (
                    <div
                        key={developer._id}
                        onClick={() => handleProfileClick(developer._id)}
                        className="bg-[#2A2B2E] rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-white/10 cursor-pointer hover:border-white/20 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10"
                    >
                        <div className="flex items-start gap-3 sm:gap-4">
                            <img
                                src={developer.avatar || `https://i.pravatar.cc/150?img=${developer._id}`}
                                alt={developer.fullName}
                                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full hover:opacity-80 transition-opacity"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-sm sm:text-base truncate hover:text-blue-400 transition-colors">
                                            {developer.fullName}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-white/60 truncate">@{developer.username}</p>
                                        <p className="text-xs sm:text-sm text-white/40 mt-1">
                                            {typeof developer.location === 'string' 
                                                ? developer.location 
                                                : developer.location && typeof developer.location === 'object'
                                                    ? [developer.location.city, developer.location.state, developer.location.country].filter(Boolean).join(', ') || developer.location.address || 'Location not specified'
                                                    : 'Location not specified'
                                            }
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => handleFollow(developer._id, e)}
                                        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                                            followedDevelopers.has(developer._id)
                                                ? 'bg-white/10 text-white/60 hover:bg-white/20'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        {followedDevelopers.has(developer._id) ? 'Following' : 'Follow'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs sm:text-sm text-white/80 mt-3 sm:mt-4 line-clamp-2">{developer.bio}</p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                            {developer.skills?.slice(0, 5).map((skill) => (
                                <span
                                    key={skill}
                                    className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/5 text-white/80 rounded-full text-xs sm:text-sm hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="text-center">
                                    <p className="text-sm sm:text-base font-semibold">{developer.projects || 0}</p>
                                    <p className="text-xs sm:text-sm text-white/60">Projects</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm sm:text-base font-semibold">{developer.followers?.length || 0}</p>
                                    <p className="text-xs sm:text-sm text-white/60">Followers</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {developer.socialLinks?.github && (
                                    <a
                                        href={`https://github.com/${developer.socialLinks.github}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white/60 hover:text-white transition-colors duration-200 hover:scale-110 transform"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                )}
                                {developer.socialLinks?.linkedin && (
                                    <a
                                        href={`https://linkedin.com/in/${developer.socialLinks.linkedin}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white/60 hover:text-white transition-colors duration-200 hover:scale-110 transform"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            {pagination.hasMore && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}

            {/* No Results */}
            {!loading && developers.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-white/60 text-lg">No developers found matching your criteria.</p>
                    <p className="text-white/40 text-sm mt-2">Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
};

export default Explore; 