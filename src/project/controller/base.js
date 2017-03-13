'use strict';

export default class extends think.controller.base {
    /**
     * some base method in here
     */
    async __before() {
        // let userinfo = await this.model("system").where({sys_name: 'view_nums'}).increment("view_nums", 1);

        // let thisUrl = this.http.module + "/" + this.http.controller + "/" + this.http.action;
        //判断登陆

        // if ((this.http.action != 'login') && (this.http.action != 'register')) {
        //     let user_id = this.http.get('user_id')
        //     // console.log('__before', user_id)
        //     let token = await think.cache(user_id);
        //     if (think.isEmpty(token)) {
        //         return this.fail("token失效");
        //     }
        // }
    }


    async getConfig() {

    }

}