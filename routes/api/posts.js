const express = require('express');
const router = express.Router();

// @route  GET api/posts
// @desc   This will test the route.
// @access Public route 
router.get('/', (req, res) => res.send('This is the YAPR Post route.'));

module.exports = router;