const express = require('express');
const router = express.Router();

const users = []; // This should be replaced with a database in a real application

// Register new user
router.post('/users/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }
    const userExists = users.find(u => u.username === username);
    if (userExists) {
        return res.status(400).send('User already exists');
    }
    const newUser = { id: users.length + 1, username, password }; // Password should be hashed
    users.push(newUser);
    res.status(201).json(newUser);
});

// Login user
router.post('/users/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ message: 'Login successful', user });
    } else {
        res.status(401).send('Invalid username or password');
    }
});

module.exports = router;
