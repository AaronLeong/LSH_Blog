/**
 * Created by AaronLeong on 09/12/2016.
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
        return this.display();
    }

    async uploadeditorAction() {
        //auto render template file index_index.html
        if (this.isGet()) {
            let sys_setting = await this.model('setting').find({_id: '5849709981be5002840e1dca'})
            this.assign('sys_setting', sys_setting)
            return this.display();
        } else {

            let login_data = this.post();
            let keep_me_logged_in = this.post('keep_me_logged_in')
            console.log(keep_me_logged_in)

            return this.redirect('/admin/index')
        }
    }
}