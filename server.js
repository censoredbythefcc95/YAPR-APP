const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connecting to datbase
connectDB();

// Initial middleware for body parser.
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
    res.send('The YAPR API is now running at this time.');
})

//Defining our route

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// Changing port to process.env
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`You have successfully connected to the API on port ${PORT}`);
});