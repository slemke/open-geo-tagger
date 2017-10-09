const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        type: {
            type: Number,
            required: true,
            min: 0
        },
        objective: {
            type: Number,
            required: true,
            min: 0
        }
    }
);

module.exports = schema;
