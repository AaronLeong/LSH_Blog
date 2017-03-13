/**
 * Created by AaronLeong on 08/12/2016.
 */
'use strict';

import Base from './base.js';

export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        //auto render template file index_index.html
        let sys_setting = await this.model('setting').where({sys_name:'web_setting'}).find()
        // console.log(sys_setting)
        this.assign('sys_setting', sys_setting)
        return this.display();
    }

    async saveAction() {
        let sys_setting = this.post()
        //auto render template file index_index.html
        let uid = await this.model('setting').where({sys_name:'web_setting'}).update(sys_setting);
        // console.log(uid)
        // console.log(id)
        this.assign('sys_setting', sys_setting)
        return this.redirect('/admin/setting')
    }
}