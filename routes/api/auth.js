const express = require('express');
const router = express.Router();
const config = require('config');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');


// @route  GET api/auth
// @desc   This will test the route.
// @access Public route 
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('There was a server error.');
    }
});

// @route  POST api/auth
// @desc   This will authenticate user and return bearer token.
// @access Public route 
router.post('/', [
    check('email', 'Please include a valid email address.').isEmail(),
    check('password', 'Password is required.').exists()
    ], 

    async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            // Nodemon was crashing when this was returning. Added return statement to avoid headers being sent again and again.
            return res.status(400).json({ errors: [{ msg: "Invalid Credentials."}] });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: "Invalid Credentials."}] });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            (err, token) => {
                if(err) throw err;
                res.json({ token });
            }
        );
    } catch(err){
        console.error(err.message);
        res.status(500).send('There was a server error.');
    }
});

module.exports = router;