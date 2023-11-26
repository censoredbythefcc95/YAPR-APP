const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('The YAPR API is now running at this time.');
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`You have successfully connected to the API on port ${PORT}`);
});