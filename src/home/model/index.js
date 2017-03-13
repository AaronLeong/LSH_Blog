'use strict';
/**
 * model
 */
export default class extends think.model.base {
    updateViewNums(id) {
        return this.model('post').where({_id: id}).increment("view_nums", 1);
    }

    recentPosts(item_nums) {
        return this.model('post').where({
            delete: 0,
            publish: "on"
        }).limit(item_nums).field("_id,title").order('create_time DESC').select();
    }
}