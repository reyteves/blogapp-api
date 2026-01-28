const User = require('../models/User');
const bcrypt = require('bcrypt');
const auth = require('../auth');

// Register User
module.exports.registerUser = (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send({ message: 'All fields are required' });
    }

    let newUser = new User({
        username,
        email,
        password: bcrypt.hashSync(password, 10)
    });

    return newUser.save()
        .then(result => res.status(201).send({ message: 'Registered Successfully', user: result }))
        .catch(err => {
            console.error(err);
            res.status(500).send({ message: 'Error in registration', error: err });
        });
};

// Login User
module.exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    return User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: 'No user found' });
            } else {
                const isPasswordCorrect = bcrypt.compareSync(password, user.password);
                if (isPasswordCorrect) {
                    return res.status(200).send({
                        message: 'Login Successful',
                        access: auth.createAccessToken(user)
                    });
                } else {
                    return res.status(401).send({ message: 'Email and password do not match' });
                }
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ message: 'Error in login', error: err });
        });
};
