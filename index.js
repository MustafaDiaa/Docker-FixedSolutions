const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(bodyParser.json());

// Helper functions
const readUsers = () => {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
};

const writeUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Get all users
app.get('/users', (req, res) => {
    const users = readUsers();
    res.json(users);
});

// Get single user by id
app.get('/users/:id', (req, res) => {
    const users = readUsers();
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
});

// Create a new user
app.post('/users', (req, res) => {
    const users = readUsers();
    const newUser = {
        id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
        name: req.body.name,
        email: req.body.email
    };
    users.push(newUser);
    writeUsers(users);
    res.status(201).json(newUser);
});

// Update user by id
app.put('/users/:id', (req, res) => {
    const users = readUsers();
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'User not found' });

    users[index] = { ...users[index], ...req.body };
    writeUsers(users);
    res.json(users[index]);
});

// Delete user by id
app.delete('/users/:id', (req, res) => {
    let users = readUsers();
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: 'User not found' });

    users = users.filter(u => u.id !== parseInt(req.params.id));
    writeUsers(users);
    res.json({ message: 'User deleted' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
