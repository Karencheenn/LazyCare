const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');

/**
 * Data validation middleware
 * Only `username` and `email` are required
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

    // `birthday` is optional but must be a past date
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
 * @route GET /user/:userId
 * @desc Get user information by user ID
 */
router.get('/:userId', async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Failed to retrieve user:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve user: " + error.message });
    }
});

/**
 * @route PUT /user/:userId
 * @desc Update user information (only updates provided fields)
 */
router.put('/:userId', async (req, res) => {
    try {
        const updatedUser = await userService.updateUserById(req.params.userId, req.body);
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
 * @route DELETE /user/:userId
 * @desc Delete a user (also deletes their chat history)
 */
router.delete('/:userId', async (req, res) => {
    try {
        const result = await userService.deleteUserById(req.params.userId);
        if (!result) {
            return res.status(404).json({ success: false, message: 'User not found, unable to delete' });
        }
        res.status(200).json({ success: true, message: 'User successfully deleted' });
    } catch (error) {
        console.error("Failed to delete user:", error);
        res.status(500).json({ success: false, message: "Failed to delete user: " + error.message });
    }
});

/**
 * @route GET /user/email/:email
 * @desc Get user information by email
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
        res.status(500).json({ success: false, message: "Failed to retrieve user: " + error.message });
    }
});

/**
 * @route PUT /user/email/:email
 * @desc Update user information by email (only updates provided fields)
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
 * @desc Clear specific user fields by email
 */
router.delete('/email/:email', async (req, res) => {
    try {
        const user = await userService.getUserByEmail(req.params.email);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found, unable to delete' });
        }

        // Clear specific fields
        user.birthday = null;
        user.weight = null;
        user.gender = null;

        // Update user information
        await userService.updateUserByEmail(req.params.email, user);

        res.status(200).json({ success: true, message: 'User profile updated, specific fields removed' });
    } catch (error) {
        console.error("Failed to delete user fields:", error);
        res.status(500).json({ success: false, message: "Failed to delete user fields: " + error.message });
    }
});

module.exports = router;
