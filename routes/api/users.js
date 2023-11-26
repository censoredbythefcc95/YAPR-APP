const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator'); // Validator-check is deprecated - you need to call express-validator directly instead.

// @route  POST api/users
// @desc   This will register a new user into the database.
// @access Public route 
router.post('/', [
    check ('name', 'Missing name in name field.')
    .not()
    .isEmpty(),
    check('email', 'Please include a valid email address.').isEmail(),
    check('password', 'Please enter a password with at least 6 characters.').isLength({ min: 6 })
    ], 
    (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.send('This is the YAPR User Route.');
})


module.exports = router;