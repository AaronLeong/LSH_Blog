'use strict';
/**
 * model
 */
export default class extends think.model.mongo {
    lookup(map) {
        return this.aggregate([
            {
                $lookup: {
                    "localField": "group_id",
                    "from": "lsh_contact_group_info",
                    "foreignField": "_id",
                    "as": "groupinfo"
                }
            },
            {$match: map}]
        )

    }

    memberlist(map) {
        return this.aggregate([
            {
                $lookup: {
                    "localField": "user_id",
                    "from": "lsh_member",
                    "foreignField": "_id",
                    "as": "userinfo"
                }
            },
            {$match: map}]
        )

    }
}