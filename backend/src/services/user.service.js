const fs = require('fs');
const path = require('path');

// Path to the data file
const dataFilePath = path.join(__dirname, '../data/users.json');

// Read user data
const readUsers = () => {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

// Write user data
const writeUsers = (users) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));
};

// User service object
const userService = {
    // Create a new user
    createUser: async function(userData) {
        const users = readUsers();
        const newUser = { id: Date.now().toString(), ...userData }; // Use timestamp as user ID
        users.push(newUser);
        writeUsers(users);
        return newUser;
    },

    // Get user by ID
    getUserById: async function(userId) {
        const users = readUsers();
        return users.find(user => user.id === userId);
    },

    // Get user by email
    getUserByEmail: async function(email) {
        const users = readUsers();
        return users.find(user => user.email === email);
    },

    // Delete user by ID
    deleteUserById: async function(userId) {
        const users = readUsers();
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return null; // User does not exist
        }
        const deletedUser = users.splice(userIndex, 1);
        writeUsers(users);
        return deletedUser;
    },

    // Delete user by email
    deleteUserByEmail: async function(email) {
        const users = readUsers();
        const userIndex = users.findIndex(user => user.email === email);
        if (userIndex === -1) {
            return null; // User does not exist
        }
        const deletedUser = users.splice(userIndex, 1);
        writeUsers(users);
        return deletedUser;
    },

    // Update user information by ID
    updateUserById: async function(userId, updateData) {
        const users = readUsers();
        const user = users.find(user => user.id === userId);
        if (!user) {
            return null; // User does not exist
        }
        Object.assign(user, updateData); // Update user information
        writeUsers(users);
        return user;
    },

    // Update user information by email
    updateUserByEmail: async function(email, updateData) {
        const users = readUsers();
        const user = users.find(user => user.email === email);
        if (!user) {
            return null; // User does not exist
        }
        Object.assign(user, updateData); // Update user information
        writeUsers(users);
        return user;
    }
};

// Export user service
module.exports = userService;