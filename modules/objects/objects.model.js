const mongoose = require('mongoose');
const schema = require('./objects.schema.js');

const model = mongoose.model('Object', schema);

module.exports.get = function(find, limit, offset, sort, callback) {
    let result = model.find(find);

    if(limit != undefined || limit != null)
        result = result.limit(limit);

    if(offset != undefined || offset != null)
        result = result.skip(offset);

    result.sort(sort)
        .exec(callback);
};

module.exports.insert = function(object, callback) {
    model.create(object, callback);
};

module.exports.update = function(id, data, callback) {
    model.update({ _id : id }, { $set : data }, callback);
};

module.exports.delete = function(id, callback) {
    model.remove({ _id : id }, callback);
};
