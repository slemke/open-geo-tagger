const mongoose = require('mongoose');
const questSchema = require('./quests.schema.js');

const schema = new mongoose.Schema(
    {
        userID: {
            type: String,
            required: true,
            trim: true
        },
        created: {
            type: Date,
            default: Date.now
        },
        quest: questSchema
    }
);

module.exports = schema;
