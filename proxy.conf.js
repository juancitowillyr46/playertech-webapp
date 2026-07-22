const apiTarget = process.env.PLAYERTECH_API_TARGET || 'http://localhost:8081';

module.exports = {
    '/api': {
        target: apiTarget,
        secure: false,
        changeOrigin: true,
        logLevel: 'debug'
    }
};
