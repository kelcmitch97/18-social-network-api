const {Schema, model } = require('mongoose');

const UserSchema = new Schema( 
{
    username: {
        type: String,
        unique: true,
        trim: true,
        required: 'Username is required'
    },

    email: {
        type: String,
        unique: true,
        required: 'Email is required',
        match: [/.+@.+\..+/, 'Please enter a valid e-mail address']
    },

    thoughts: [ThoughtSchema],

    friends: [UserSchema]

    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false
    }
);

// Virtual
UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
})

const User = model('User', UserSchema);

module.exports = User;