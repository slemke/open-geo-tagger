const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        location: {
            type: Array,
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
        votes: {
            type: Number,
            required: true,
            min: 0
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