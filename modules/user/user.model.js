const model = require('./user.schema.js')

// define model
module.exports.get = function(find, limit, offset, sort, callback) {
    let result = model.find(find);

    if(limit != undefined || limit != null)
        result = result.limit(limit);

    if(offset != undefined || offset != null)
        result = result.skip(offset);

    result.sort(sort)
        .exec(callback);
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
