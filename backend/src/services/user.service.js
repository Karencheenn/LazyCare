const fs = require('fs');
const path = require('path');

// 数据文件路径
const dataFilePath = path.join(__dirname, '../data/users.json');

// 读取用户数据
const readUsers = () => {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

// 写入用户数据
const writeUsers = (users) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));
};

// 用户服务对象
const userService = {
    // 创建新用户
    createUser: async function(userData) {
        const users = readUsers();
        const newUser = { id: Date.now().toString(), ...userData }; // 使用时间戳作为用户 ID
        users.push(newUser);
        writeUsers(users);
        return newUser;
    },

    // 根据用户 ID 获取用户
    getUserById: async function(userId) {
        const users = readUsers();
        return users.find(user => user.id === userId);
    },

    // 根据电子邮件获取用户
    getUserByEmail: async function(email) {
        const users = readUsers();
        return users.find(user => user.email === email);
    },

    // 根据用户 ID 删除用户
    deleteUserById: async function(userId) {
        const users = readUsers();
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return null; // 用户不存在
        }
        const deletedUser = users.splice(userIndex, 1);
        writeUsers(users);
        return deletedUser;
    },

    // 根据电子邮件删除用户
    deleteUserByEmail: async function(email) {
        const users = readUsers();
        const userIndex = users.findIndex(user => user.email === email);
        if (userIndex === -1) {
            return null; // 用户不存在
        }
        const deletedUser = users.splice(userIndex, 1);
        writeUsers(users);
        return deletedUser;
    },

    // 根据用户 ID 更新用户信息
    updateUserById: async function(userId, updateData) {
        const users = readUsers();
        const user = users.find(user => user.id === userId);
        if (!user) {
            return null; // 用户不存在
        }
        Object.assign(user, updateData); // 更新用户信息
        writeUsers(users);
        return user;
    },

    // 根据电子邮件更新用户信息
    updateUserByEmail: async function(email, updateData) {
        const users = readUsers();
        const user = users.find(user => user.email === email);
        if (!user) {
            return null; // 用户不存在
        }
        Object.assign(user, updateData); // 更新用户信息
        writeUsers(users);
        return user;
    }
};

// 导出用户服务
module.exports = userService;