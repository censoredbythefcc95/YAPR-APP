const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
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
    async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            // Nodemon was crashing when this was returning. Added return statement to avoid headers being sent again and again.
            return res.status(400).json({ errors: [{ msg: "User already exists!"}] });
        }

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        //Return webtoken
    res.send('User has been successfully registered.');
    } catch(err){
        console.error(err.message);
        res.status(500).send('There was a server error.');
    }
});


module.exports = router;