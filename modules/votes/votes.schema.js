const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
        userID: {
            type: String,
            required: true,
            trim: true
        },
        vote: {
            type: Number,
            required: true,
            min: 0,
            max: 1
        },
        objectID: {
            type: String,
            required: true,
            trim: true
        }
    }
);

module.exports = schema;
