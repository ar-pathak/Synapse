// Search service for advanced search functionality
const API_BASE_URL = (() => {
    // Try Vite environment variable first
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
        return import.meta.env.VITE_API_URL
    }
    // Default fallback
    return 'http://localhost:5000/api'
})()

export const searchService = {
    // Advanced search
    async search(query, options = {}) {
        try {
            const {
                type = 'all',
                page = 1,
                limit = 20,
                skills = '',
                location = '',
                experience = '',
                sortBy = 'relevance'
            } = options;

            const queryParams = new URLSearchParams({
                q: query,
                type,
                page,
                limit,
                skills,
                location,
                experience,
                sortBy
            });

            const response = await fetch(`${API_BASE_URL}/search?${queryParams}`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Search error:', error);
            throw error;
        }
    },

    // Search suggestions/autocomplete
    async getSuggestions(query, type = 'all') {
        try {
            const queryParams = new URLSearchParams({
                q: query,
                type
            });

            const response = await fetch(`${API_BASE_URL}/search/suggestions?${queryParams}`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Suggestions error:', error);
            throw error;
        }
    },

    // Get trending searches
    async getTrendingSearches(limit = 10) {
        try {
            const response = await fetch(`${API_BASE_URL}/search/trending?limit=${limit}`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Trending searches error:', error);
            throw error;
        }
    },

    // Get search filters
    async getSearchFilters() {
        try {
            const response = await fetch(`${API_BASE_URL}/search/filters`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Search filters error:', error);
            throw error;
        }
    },

    // Get search analytics
    async getSearchAnalytics(period = 'week') {
        try {
            const response = await fetch(`${API_BASE_URL}/search/analytics?period=${period}`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Search analytics error:', error);
            throw error;
        }
    },

    // Search users specifically
    async searchUsers(query, options = {}) {
        return this.search(query, { ...options, type: 'users' });
    },

    // Search posts specifically
    async searchPosts(query, options = {}) {
        return this.search(query, { ...options, type: 'posts' });
    },

    // Search skills specifically
    async searchSkills(query, options = {}) {
        return this.search(query, { ...options, type: 'skills' });
    },

    // Advanced user search with filters
    async searchUsersAdvanced(filters = {}) {
        try {
            const {
                query = '',
                skills = [],
                location = '',
                experience = '',
                sortBy = 'relevance',
                page = 1,
                limit = 20
            } = filters;

            const searchOptions = {
                type: 'users',
                page,
                limit,
                skills: skills.join(','),
                location,
                experience,
                sortBy
            };

            return await this.search(query, searchOptions);
        } catch (error) {
            console.error('Advanced user search error:', error);
            throw error;
        }
    },

    // Search with real-time suggestions
    async searchWithSuggestions(query, callback) {
        try {
            // Get suggestions first
            const suggestions = await this.getSuggestions(query);
            
            // Then perform the actual search
            const searchResults = await this.search(query);
            
            // Call callback with both results
            if (callback) {
                callback({
                    suggestions: suggestions.suggestions || [],
                    results: searchResults.results || {},
                    query
                });
            }

            return {
                suggestions: suggestions.suggestions || [],
                results: searchResults.results || {},
                query
            };
        } catch (error) {
            console.error('Search with suggestions error:', error);
            throw error;
        }
    },

    // Debounced search for real-time search
    debouncedSearch: (() => {
        let timeoutId;
        return (query, callback, delay = 300) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
                try {
                    if (query.trim().length < 2) {
                        callback({ suggestions: [], results: {}, query });
                        return;
                    }

                    const results = await searchService.searchWithSuggestions(query, callback);
                    callback(results);
                } catch (error) {
                    console.error('Debounced search error:', error);
                    callback({ suggestions: [], results: {}, query, error: error.message });
                }
            }, delay);
        };
    })(),

    // Search history management
    addToSearchHistory(query) {
        try {
            const history = this.getSearchHistory();
            const newHistory = [query, ...history.filter(item => item !== query)].slice(0, 10);
            localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        } catch (error) {
            console.error('Error adding to search history:', error);
        }
    },

    getSearchHistory() {
        try {
            const history = localStorage.getItem('searchHistory');
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('Error getting search history:', error);
            return [];
        }
    },

    clearSearchHistory() {
        try {
            localStorage.removeItem('searchHistory');
        } catch (error) {
            console.error('Error clearing search history:', error);
        }
    }
}; 