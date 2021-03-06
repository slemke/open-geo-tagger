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

    if(sort == undefined || sort == null)
        result.sort({ _id : 1});
    else
        result.sort(sort);

    result.exec(callback);
};

module.exports.insert = function(category, callback) {
    model.create(category, callback);
};

module.exports.update = function(id, data, callback) {
    model.update({_id : id}, { $set : data }, callback);
};

module.exports.delete = function(id, callback) {
    model.remove({_id : id}, callback);
};
