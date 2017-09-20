const mongoose = require('mongoose');
const schema = require('./user.schema.js')

let model = mongoose.model('user', schema);


// define model
module.exports.get = function(find, limit, offset, sort, callback) {
    let result = model.find(find);

    if(limit != undefined || limit != null)
        result = result.limit(limit);

    if(offset != undefined || offset != null)
        result = result.skip(offset);

    if(sort == undefined || sort == null)
        result.sort({ _id : 1});
    else
        result.sort(sort);

    result.exec(callback);
};

module.exports.insert = function(user, callback) {
    model.create(user, callback);
};

module.exports.update = function(id, data, callback) {
    model.update({_id : id}, { $set : data }, callback);
};

module.exports.delete = function(id, callback) {
    model.remove({_id : id}, callback);
};

module.exports.authenticate = function(username, password, callback) {
    model.authenticate(username, password, callback);
};

module.exports.setPoints = function(id, points, callback) {
    model.update({ _id : id}, { $inc : {points : points}}, callback);
}
