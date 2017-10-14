const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        location: {
            type: Array,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        categories: {
            type: Array,
            required: true
        },
        description: {
            type: String,
            unique: false,
            required: true,
            trim: false
        },
        upvote: {
            type: Number,
            required: true,
            min: 0,
            max: 1
        },
        downvote: {
            type: Number,
            required: true,
            min: 0,
            max: 1
        },
        userID: {
            type: String,
            unique: false,
            required: true,
            trim: false
        },
        themeID: {
            type: String,
            unique: false,
            required: true,
            trim: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = schema;
