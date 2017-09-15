const mongoose = require('mongoose');
const schema = require('./categories.schema.js')

// setup model
const model = mongoose.model('Category', schema);

module.exports.get = function(find, limit, offset, sort, callback) {
    let result = model.find(find);

    if(limit != undefined || limit != null)
        result = result.limit(limit);

    if(offset != undefined || offset != null)
        result = result.skip(offset);

    result.sort(sort)
        .exec(callback);
};

module.exports.insert = function(category, callback) {
    model.create({ name: category }, callback);
};

module.exports.update = function(id, data, callback) {
    model.update({_id : id}, { $set : data }, callback);
};

module.exports.delete = function(id, callback) {
    model.remove({_id : id}, callback);
};
