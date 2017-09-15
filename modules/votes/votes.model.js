const mongoose = require('mongoose');
const schema = require('./votes.schema.js');

let model = mongoose.model('votes', schema);

module.exports.get = function(find, limit, offset, {_id: 1}, callback) {
    let result = model.find(find);

    if(limit != undefined || limit != null)
        result = result.limit(limit);

    if(offset != undefined || offset != null)
        result = result.skip(offset);

    result.sort( {_id: 1})
        .exec(callback);
};

module.exports.insert = function(vote, callback) {
    model.create(vote, callback);
};

module.exports.update = function(id, data, callback) {
    model.update({_id : id}, { $set : data }, callback);
};

module.exports.delete = function(id, callback) {
    model.remove({_id : id}, callback);
};
