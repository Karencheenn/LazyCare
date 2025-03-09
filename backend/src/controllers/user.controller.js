const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');

/**
 * Data validation middleware
 * Only `username` and `email` are required fields
 */
const validateUserData = (req, res, next) => {
    const { username, email, birthday, gender } = req.body;

    if (!username || !email) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: username and email are required.'
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format.'
        });
    }

    // `birthday` is optional but must be in the past
    if (birthday) {
        const birthDate = new Date(birthday);
        const today = new Date();
        if (isNaN(birthDate.getTime()) || birthDate >= today) {
            return res.status(400).json({
                success: false,
                message: 'Invalid birthday format. It must be a past date.'
            });
        }
    }

    next();
};

/**
 * @route POST /user
 * @desc Create a new user (only requires username and email)
 */
router.post('/', async (req, res) => {
    const { username, email } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            // If the user exists, update their information
            const updatedUser = await userService.updateUserByEmail(email, { username });
            return res.status(200).json({ success: true, data: updatedUser });
        } else {
            // If the user does not exist, create a new user
            const newUser = await userService.createUser({ username, email });
            return res.status(201).json({ success: true, data: newUser });
        }
    } catch (error) {
        console.error("Failed to create or update user:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

/**
 * @route GET /user/email/:email
 * @desc Retrieve user information by email
 */
router.get('/email/:email', async (req, res) => {
    try {
        const user = await userService.getUserByEmail(req.params.email);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Failed to retrieve user:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve user information: " + error.message });
    }
});

/**
 * @route PUT /user/email/:email
 * @desc Update user information by email (supports weight_unit)
 */
router.put('/email/:email', async (req, res) => {
    try {
        const updatedUser = await userService.updateUserByEmail(req.params.email, req.body);
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found, unable to update' });
        }
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        console.error("Failed to update user:", error);
        res.status(400).json({ success: false, message: "Failed to update user: " + error.message });
    }
});

/**
 * @route DELETE /user/email/:email
 * @desc Clear specific fields from a user by email instead of deleting the user
 */
router.delete('/email/:email', async (req, res) => {
    try {
        const updatedUser = await userService.deleteUserByEmail(req.params.email);
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found, unable to clear data' });
        }

        res.status(200).json({ success: true, message: 'User profile updated, specific fields cleared', data: updatedUser });
    } catch (error) {
        console.error("Failed to clear user fields:", error);
        res.status(500).json({ success: false, message: "Failed to clear user fields: " + error.message });
    }
});

module.exports = router;
