const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connecting to datbase
connectDB();

app.get('/', (req, res) => {
    res.send('The YAPR API is now running at this time.');
})

// Changing port to process.env
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`You have successfully connected to the API on port ${PORT}`);
});