const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    passwordconfirm: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        required: true,
        min: 0
    }
});

// authenticate input against database
schema.statics.authenticate = function (username, password, callback) {
    this.findOne({ username: username })
        .exec(function (err, user) {

            if(err)
                return callback(err);

            if(!user) {
                let err = new Error("User not found.");
                err.status = 401;
                return callback(err);
            }

            bcrypt.compare(password, user.password, function (err, result) {
                if(err)
                    return callback(err);

                if(result)
                    return callback(null, user);
                else
                    return callback();
            });
        });
};

// hashing a password before saving it to the database
schema.pre('save', function (next) {
    let user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {

        if (err)
            return next(err);

        user.password = hash;
        user.passwordconfirm = hash;
        next();
    });
});

module.exports = schema;
