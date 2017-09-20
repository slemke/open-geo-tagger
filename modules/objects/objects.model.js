const mongoose = require('mongoose');
const schema = require('./objects.schema.js');
const multer = require('multer');

const model = mongoose.model('Object', schema);

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

module.exports.insert = function(object, callback) {
    model.create(object, callback);
};

module.exports.update = function(id, data, callback) {
    model.update({ _id : id }, { $set : data }, callback);
};

module.exports.delete = function(id, callback) {
    model.remove({ _id : id }, callback);
};

module.exports.upload = function(request, response, callback) {
    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, '/assets/img/upload');
        },
        filename: function(req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now());
        }
    });

    let upload =  multer({storage : storage}).array("image", 1);

    upload(request, response, callback);
};
