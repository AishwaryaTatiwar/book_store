const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');

app.use('/api', bookRoutes);
app.use('/api', userRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
