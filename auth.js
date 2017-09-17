const auth = require('http-auth');

let basic = auth.basic({
        realm: "Users",
    }, function(username, password, callback) {
        callback(true); // ask mongoose db
    }
);

module.exports = basic;
