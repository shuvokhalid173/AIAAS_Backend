// controller for authentication which will use auth.service.js to handle the business logic
const authService = require('../services/auth.service');

const register = async (req, res) => {
    try {
        const { email, password, phone } = req.body;
        const user = await authService.register(email, password, phone);
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await authService.login(email, password); // token -> { accessToken, refreshToken }
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const newTokens = await authService.refresh(refreshToken); // newTokens -> { accessToken, refreshToken }
        res.status(200).json({ message: 'Token refreshed successfully', token: newTokens });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    try {
        const { sessionId } = req.body;
        await authService.logout(sessionId);
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateUserAuthStatus = async (req, res) => {
    const { userId, email, is_email_verified } = req.body;
    try {
        await authService.updateUserAuthStatus({ userId, email }, is_email_verified);
        res.status(200).json({ message: 'User status updated successfully' });
    } catch (error) {
        // try one more
        try {
            await authService.updateUserAuthStatus({ userId, email }, is_email_verified);
            res.status(200).json({ message: 'User status updated successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = {
    register,
    login,
    updateUserAuthStatus,
    refresh,
    logout,
};