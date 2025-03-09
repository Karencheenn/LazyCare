const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');

/**
 * 数据验证中间件
 * 只强制要求 `username` 和 `email`
 */
const validateUserData = (req, res, next) => {
    const { username, email, birthday, gender } = req.body;

    if (!username || !email) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: username and email are required.'
        });
    }

    // validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format.'
        });
    }

    // `birthday` optional, must be in the past
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
 * @desc 创建新用户（只要求 username 和 email）
 */
router.post('/', async (req, res) => {
    const { username, email } = req.body;

    try {
        // 检查用户是否已存在
        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            // 如果用户已存在，更新用户信息
            const updatedUser = await userService.updateUserByEmail(email, { username });
            return res.status(200).json({ success: true, data: updatedUser });
        } else {
            // 如果用户不存在，创建新用户
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
 * @desc 获取指定用户信息
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
 * @desc 更新用户信息（只更新提供的字段）
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
 * @desc 删除用户（同时删除其聊天记录）
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
 * @desc 通过 Email 获取用户信息
 */
router.get('/email/:email', async (req, res) => {
    try {
        const user = await userService.getUserByEmail(req.params.email);
        if (!user) {
            return res.status(404).json({ success: false, message: '用户不存在' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("获取用户失败:", error);
        res.status(500).json({ success: false, message: "获取用户信息失败: " + error.message });
    }
});


/**
 * @route PUT /user/email/:email
 * @desc 通过 Email 更新用户信息（只更新提供的字段）
 */

router.put('/email/:email', async (req, res) => {
    try {
        const updatedUser = await userService.updateUserByEmail(req.params.email, req.body);
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: '用户不存在，无法更新' });
        }
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        console.error("Failed to update user:", error);
        res.status(400).json({ success: false, message: "Failed to update user: " + error.message });
    }
});

/**
 * @route DELETE /user/email/:email
 * @desc 通过 Email 清除用户的特定字段
 */
router.delete('/email/:email', async (req, res) => {
    try {
        const user = await userService.getUserByEmail(req.params.email);
        if (!user) {
            return res.status(404).json({ success: false, message: '用户不存在，无法删除' });
        }

        // 清除特定字段
        user.birthday = null;
        user.weight = null;
        user.gender = null;

        // 更新用户信息
        await userService.updateUserByEmail(req.params.email, user);

        res.status(200).json({ success: true, message: '用户资料已更新，特定字段已删除' });
    } catch (error) {
        console.error("Failed to delete user fields:", error);
        res.status(500).json({ success: false, message: "Failed to delete user fields: " + error.message });
    }
});

module.exports = router;
