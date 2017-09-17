const auth = require('http-auth');
const model = require('./modules/user/user.model.js');

let basic = auth.basic({
        realm: "Users",
    }, function(username, password, callback) {
        model.authenticate(username, password, function(err, result) {
            if(err)
                return callback(false);

            if(result)
                return callback(true);

            return callback(false);

        });
    }
);

module.exports = basic;
