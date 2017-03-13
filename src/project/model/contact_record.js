/**
 * Created by AaronLeong on 12/01/2017.
 */
'use strict';
/**
 * model
 */
export default class extends think.model.mongo {
    lookup(map) {
        return this.aggregate([

            {$match: map},
            {$group: {_id: "$friend_id", total: {$sum: "$amount"}}},
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