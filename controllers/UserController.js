const User = require("../models/User"); // Adjust path if your model is elsewhere

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single user by email
exports.getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const result = await User.create({ username, email, password });
        res.status(201).json({ 
            message: "User created successfully", 
            userId: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};