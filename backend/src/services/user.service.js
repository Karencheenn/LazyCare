const fs = require('fs');
const path = require('path');

// Data file path
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
    /**
     * Create a new user
     */
    createUser: async function(userData) {
        const users = readUsers();
        const newUser = { 
            id: Date.now().toString(),
            username: userData.username,
            email: userData.email,
            birthday: userData.birthday || null,
            weight: userData.weight || 0,
            weight_unit: userData.weight_unit || null, // Ensure weight_unit exists
            gender: userData.gender || null
        };
        users.push(newUser);
        writeUsers(users);
        return newUser;
    },

    /**
     * Get user by email
     */
    getUserByEmail: async function(email) {
        const users = readUsers();
        const user = users.find(user => user.email === email);
        if (!user) return null;

        if (!user.hasOwnProperty("weight_unit")) {
            user.weight_unit = null;
        }
        return user;
    },

    /**
     * "Clear" user information by email instead of deleting
     */
    deleteUserByEmail: async function(email) {
        const users = readUsers();
        const user = users.find(user => user.email === email);
        if (!user) {
            return null; // User does not exist
        }

        // Retain only username and email, clear other fields
        user.birthday = null;
        user.weight = 0;
        user.weight_unit = null; // Ensure weight_unit is also cleared
        user.gender = null;

        writeUsers(users);
        return user;
    },

    /**
     * Update user information by email
     */
    updateUserByEmail: async function(email, updateData) {
        const users = readUsers();
        const user = users.find(user => user.email === email);
        if (!user) {
            return null; // User does not exist
        }

        Object.assign(user, updateData);
        writeUsers(users);
        return user;
    }
};

// Export user service
module.exports = userService;