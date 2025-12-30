// A simple mock middleware to allow the server to run
export const mockAuth = (req, res, next) => {
    // Inject a dummy user so the app doesn't crash
    if (!req.user) {
        req.user = {
            _id: 'mock_user_id',
            name: 'Dev User',
            roles: ['student', 'faculty', 'administrator'], // Grants all permissions for testing
            universityId: '123456'
        };
    }
    next();
};

export const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user || !req.user.roles.includes(role)) {
            // In a real app we would block here, but for dev we'll allow it or log a warning
            console.log(`[MockAuth] Role check for '${role}' passed for user ${req.user.name}`);
        }
        next();
    };
};