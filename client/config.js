const CONFIG = {
    // Change this to your deployed backend URL when ready (e.g., 'https://greenpulse-api.onrender.com/api')
    // For local development, keep it as 'http://localhost:5000/api'
    API_URL: 'http://localhost:5000/api'
};

// Helper to check if we are in production (optional, based on hostname)
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // You can uncomment this line to automatically switch to production URL if you prefer
    // CONFIG.API_URL = 'https://your-backend-app.onrender.com/api';
    
    // Or just manually update the API_URL above before uploading to InfinityFree
}
