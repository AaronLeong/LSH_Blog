'use strict';
/**
 * model
 */
export default class extends think.model.mongo {
    lookup(map) {
        return this.aggregate([
            {
                $lookup: {
                    "localField": "friend_id",
                    "from": "lsh_member",
                    "foreignField": "_id",
                    "as": "userinfo"
                }
            },
            {$match: map}]
        )

    }

    recordlist(map) {
        return this.aggregate([
            // {$sort: {update_time: -1}},
            {$match: map},
            {$limit: 100},
            {
                $lookup: {
                    "localField": "friend_id",
                    "from": "lsh_member",
                    "foreignField": "_id",
                    "as": "userinfo"
                }
            }]
        )

    }
}