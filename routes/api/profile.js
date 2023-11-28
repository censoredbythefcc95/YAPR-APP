const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const { check, validationResult } = require('express-validator');

// @route  GET api/profile/me
// @desc   Get current users profile
// @access Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user.'}); //Adding return to avoid HTTP HEADER ERROR
        }
        console.log('Profile acquired.');
        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('There was a server error.');
    }
});

// @route  POST api/profile
// @desc   Create or update a user profile.
// @access Private

router.post('/', [auth, [
    check('status', 'Status is required.').not().isEmpty(),
    check ('skills', 'Skills is required.').not().isEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    // Profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());

    // Social object
    profileFields.social = {}
    if(youtube) profileFields.youtube = youtube;
    if(facebook) profileFields.facebook = facebook;
    if(twitter) profileFields.twitter = twitter;
    if(instagram) profileFields.instagram = instagram;
    if(linkedin) profileFields.linkedin = linkedin;

        try {
            let profile = await Profile.findOne({ user: req.user.id });

            if(profile) {
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true}
                );

                return res.json(profile);
            }

            profile = new Profile(profileFields);

            await profile.save();
            res.json(profile);

        } catch(err) {
            console.error(err.message);
            res.status(500).send('There was a server error.');
        }
    }
});

// @route  GET api/profile
// @desc   Get all public profiles.
// @access Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('There was a server error.');
    }
});

// @route  GET api/profile/user/:user_id
// @desc   Get profile by user ID
// @access Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

        if(!profile) return res.status(400).json({ msg: "Profile was not found."});
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId') {
            return res.status(400).send('Profile was not found.');
        }
        res.status(500).send('There was a server error.');
    }
});

// @route  DELETE api/profile
// @desc   Delete profile, user and posts
// @access Private

router.delete('/', auth, async (req, res) => {
    try {
        await Profile.findOneAndDelete({ user: req.user.id }); //findoneAndRemove is now deprecated. New function is findOneAndDelete

        await User.findOneAndDelete({ _id: req.user.id }); //findoneAndRemove is now deprecated. New function is findOneAndDelete

        res.json({ msg: "User has been removed from the database."});
    } catch(err) {
        console.error(err.message);
        res.status(500).send("There was a server error.");
    }
});

// @route  PUT api/profile/experience
// @desc   Add profile experience
// @access Private

router.put('/experience', [ auth, [
    check('title', 'Title is required for profile experience.').not().isEmpty(),
    check('company', 'Company is required for profile experience.').not().isEmpty(),
    check('from', 'From date is required for profile experience.').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.experience.unshift(newExp);

            await profile.save();

            res.json(profile);

        } catch(err) {
            console.error(err.message);
            res.status(500).send('There was a server error.');
        }
    }
);

// @route  DELETE api/profile/experience/:exp_id
// @desc   Delete profile experience
// @access Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('There was a server error.');
    }
});

module.exports = router;