const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to build query string from filters
const buildQueryString = (filters) => {
    if (!filters || Object.keys(filters).length === 0) return '';
    
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
    });
    
    return `?${params.toString()}`;
};

export const fetchCaseStats = async (filters = {}) => {
    try {
        const queryString = buildQueryString(filters);
        const response = await fetch(`${API_BASE_URL}/cases/stats${queryString}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching case stats:', error);
        throw error;
    }
};

export const fetchCasesByType = async (filters = {}) => {
    try {
        const queryString = buildQueryString(filters);
        const response = await fetch(`${API_BASE_URL}/cases/by-type${queryString}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching cases by type:', error);
        throw error;
    }
};

export const fetchResolutionTimes = async (filters = {}) => {
    try {
        const queryString = buildQueryString(filters);
        const response = await fetch(`${API_BASE_URL}/cases/resolution-times${queryString}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching resolution times:', error);
        throw error;
    }
};