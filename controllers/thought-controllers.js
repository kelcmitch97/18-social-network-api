const { User, Thought  } = require('../models');

const thoughtController = {

    // get all thoughts
    getAllThoughts(req, res) {

        Thought.find({})

        .populate({
            path: 'reactions',
            select: "-__v"
        })
        .select('-__v')
        .sort({
            _id: -1
        })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

        // get thought by Id

        getThoughtById({ params }, res) {

            Thought.findOne({ _id: params.id })
    
            .populate({
                path: 'reactions',
                select: "-__v"
            })
            .select('-__v')
            .sort({
                _id: -1
            })
        
            .then(dbThoughtData => {
    
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with that Id'});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
        },
    
            // Create new thought

        createThought({ body }, res) {

            Thought.create(body)

            .then(({_id }) => {
                return User.findOneAndUpdate(
                    {
                        _id: body.userId
                    },
                    {
                        $push: {
                            thoughts: _id 
                        }
                    },
                    {
                        new: true
                    }
                );
            })

            .then(dbThoughtData => {
    
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with that Id'});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
        },

        // UpdateThought

        updateThought ({ params, body }, res) {
                Thought.findOneAndUpdate( { _id: params.id }, body, { runValidators: true, new: true })

                .then(dbThoughtData => {
                    if (!dbThoughtData) {
                        res.status(404).json({ message: 'No thought found with that Id.'})
                        return;
                    }
                    res.json(dbThoughtData)
                })

                .catch(err => res.status(400).json(err));
            },

            // Delete Thought

            deleteThought({ params }, res) {

                Thought.findOneAndDelete({ _id: params.id })

                .then(dbThoughtData => {

                    if (!dbThoughtData) {

                    res.status(404).json({ message: 'No thought found with this Id.' });
                    }

                    return User.findOneAndUpdate(
                        {
                        _id: params.userId
                        },
                        {
                            $pull: {
                                thoughts: params.Id
                            }
                        },
                        {
                            new: true
                        }
                    );
                })
                .then(dbUserData => {
                    if (!dbUserData) {
                        res.status(404).json({
                            message: "No User found with this id!"
                        });
                        return;
                    }
                    res.json(dbUserData);
                })
                
                .catch(err => res.status(400).json(err));
            },

            // Create Reaction

            createReaction({ params, body}, res) {
                
                Thought.findOneAndUpdate( 
                    { _id: params.thoughtId }, 
                    {$push: {reactions: body}}, 
                    { new: true })

                .then(dbThoughtData => {
                    if (!dbThoughtData) {
                        res.status(404).json({message: 'No thought with this Id'});
                        return;
                    }
                    res.json(dbThoughtData);
                })
                .catch(err => res.status(400).json(err))
    
            },

            // Delete reaction
            deleteReaction({ params }, res) {
                
                Thought.findOneAndUpdate( 
                    { _id: params.thoughtId }, 
                    {$pull: {reactions: {reactionId: params.reactionId}}}, 
                    { new: true })

                .then(dbThoughtData => {
                    res.json(dbThoughtData);
                })
                .catch(err => res.json(err))
            }
};

module.exports = thoughtController;