const express = require('express');
const router = express.Router();

// @route  GET api/auth
// @desc   This will test the route.
// @access Public route 
router.get('/', (req, res) => res.send('This is the YAPR Auth route.'));

module.exports = router;