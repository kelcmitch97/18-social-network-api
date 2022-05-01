const { User } = require('../models');
const { db } = require('../models/User');

const userController = {

    // get all users
    getAllUsers(req, res) {

        User.find({})

        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .sort({
            _id: -1
        })

        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // get user by Id

    getUserById({ params }, res) {

        User.findOne({ _id: params.id })

        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .select('-__v')

        .then(dbUserData => {

            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with that Id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // Create new user

    createUser( { body }, res) {

        User.create(body)

        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },

    // Update User

    updateUser( { params, body }, res) {
        User.findOneAndUpdate( { _id: params.id }, body, { new: true })

        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with that Id.'})
                return;
            }
            res.json(dbUserData)
        })

        .catch(err => res.status(400).json(err));
    },

    // Delete User

    deleteUser({ params }, res) {

        User.findByIdAndDelete({ _id: params.id })

        .then(dbUserData => {

            if (!dbUserData) {

            res.status(404).json({ message: 'No user found with this Id.' });

            return;
            }

            return dbUserData;
        })
        
        .catch(err => res.status(400).json(err));
    },

    addFriend({ params }, res) {

        User.findOneAndUpdate(
            { _id: params.userId},
            { $push: {friends: params.friendId }},
            { new: true }
        )

        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this Id.' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    deleteFriend({ params }, res) {

        User.findOneAndUpdate(
            { _id: params.userId},
            { $pull: {friends: params.friendId }},
            { new: true }
        )

        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this Id.' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    }
};


module.exports = userController;