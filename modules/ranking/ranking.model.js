const schema = require('../user/user.schema.js')
const mongoose = require('mongoose');

let model = mongoose.model('user', schema);

module.exports.get = function(find, limit, offset, sort, callback) {
    let result = model.find(find, {email: 1, username: 1, points: 1});

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
