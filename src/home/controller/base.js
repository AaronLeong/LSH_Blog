'use strict';

export default class extends think.controller.base {
    /**
     * some base method in here
     */
    async __before() {
        let userinfo = await this.model("system").where({sys_name: 'view_nums'}).increment("view_nums", 1);
    }
}