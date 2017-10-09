const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        userID: {
            type: Number,
            required: true,
            min: 0
        },
        questID: {
            type: Number,
            required: true,
            min: 0
        },
        progress: {
            type: Number,
            required: true,
            min: 0
        }
    }
);

module.exports = schema;
