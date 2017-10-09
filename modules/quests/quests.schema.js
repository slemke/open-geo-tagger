const mongoose = require('mongoose');
const objectivesSchema = require('./objectives.schema.js');

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        points: {
            type: Number,
            required: true,
            min: 0
        },
        objectives: {
            type: [objectivesSchema],
            required: true
        }
    }
);

module.exports = schema;

/*
{
  "id": 1,
  "name": "Alles of einmal",
  "description": "Tagge 5 Objecte an einem Tag."
  "points": 5,
  "objectives": [
    { "type": 1, "objective": 5 } // type = siehe enum, objective = ziel (5 Tags)
  ]
}
*/
