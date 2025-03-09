const fs = require('fs').promises;
const path = require('path');

class DatabaseService {
    constructor() {
        this.dbPath = path.join(__dirname, '../data/historicalchats.json');
    }

    /**
     * Read data file
     * @returns {Promise<object>} Returns stored chat data
     */
    async readData() {
        try {
            await fs.access(this.dbPath).catch(async () => {
                await this.writeData({ chatHistory: [] });
            });

            const data = await fs.readFile(this.dbPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error("Failed to read database file:", error);
            if (error.name === 'SyntaxError') {
                console.warn("Invalid JSON format detected, resetting database.");
                await this.writeData({ chatHistory: [] });
                return { chatHistory: [] };
            }
            throw new Error("Failed to read chat history: " + error.message);
        }
    }

    /**
     * Write data file
     * @param {object} data Chat data to write
     */
    async writeData(data) {
        try {
            await fs.writeFile(this.dbPath, JSON.stringify(data, null, 2), 'utf8');
        } catch (error) {
            console.error("Failed to write database file:", error);
            throw new Error("Failed to save chat history.");
        }
    }
}

module.exports = new DatabaseService();
