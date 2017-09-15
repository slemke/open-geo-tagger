const mongoose = require('mongoose');
const schema = require('./theme.schema.js');

const model = mongoose.model('theme', schema);

module.exports.get = function(find, limit, offset, sort, callback) {
    let result = model.find(find);

    if(limit != undefined || limit != null)
        result = result.limit(limit);

    if(offset != undefined || offset != null)
        result = result.skip(offset);

    result.sort(sort)
        .exec(callback);
};

module.exports.insert = function(theme, callback) {
    model.create({ name: theme }, callback);
};

module.exports.update = function(id, data, callback) {
    model.update({_id : id}, { $set : data }, callback);
};

module.exports.delete = function(id, callback) {
    model.remove({_id : id}, callback);
};
