const mongoose = require('mongoose');
const questSchema = require('./quests.schema.js');
const progressSchema = require('./progress.schema.js');
const todaysQuestsSchema = require('todaysQuests.schema.js');
const multer = require('multer');

const model = mongoose.model('Quests', questSchema);
const todaysModel = mongoose.model('TodaysQuests', todaysQuestsSchema);
const progressModel = mongoose.model('progressModel')

// stores todays quest for every user
let todaysQuests = {};

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

// update quest progress
module.exports.update = function(user, questID, callback) {

    todaysModel.find({ userID : user, questID : questID}, function(err, result) {

        if(err)
            return callback(err);

        if(result) {
            // we found a matching quest for today

        }

        // no matching todays quest, do nothing

        return callback();
    });

    // 1. todays userquest matches with ids
    // 2. is there a progress object?
    // 2.1: no: create one
    // 3. progress object date matches quest date?
    // 3.1: yes: increment progress object
    // 3.2: no: delete progres object
    // 4: do we still a progress object?
    // 4.1: yes: return
    // 4.2: no: return null
};

module.exports.today = function(id, callback) {

    // is there a todays quest for id?
    todaysModel.find({ userID : id}).exec(function(err, result) {

        // error
        if(err)
            callback(err);

        // we found a quest
        if(result) {

            let createdAt = new Date(result[0].created).getTime();
            let yesterday = new Date().getTime() - (1000 * 60 * 60 * 24); // minus one day

            // quest time still valid?
            if( createdAt >= yesterday ) {
                return callback(null, result);
            }
        }

        // quest wasn't valid, get a new one
        let result = model.find({});

        result = result.aggregate( [ { $sample : { size: 1} } ] );

        result.exec(function(err, random) {

            // we had an error
            if(err)
                callback(err);

            if(random) {
                // found a quest, need to store in todays model!

                return todaysModel.create(result, function(err, result) {
                    // we saved our new quest! time to return

                    if(!err)
                        callback(null, random);
                    else
                        callback(err);
                });
            }

            // we have no quests, throw error
            return callback();
        });
    });
};
