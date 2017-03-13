'use strict';

import Base from './base.js';

export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        //auto render template file index_index.html

        let menu = await this.model('setting').where({sys_name: 'menu'}).select();
        let admin_info = await this.model('system').where({sys_name: 'admin_info'}).find();

        let torecomPosts = await this.model('post').where({
            delete: 0,
            publish: "on"
        }).limit(3).field("_id,title,abstract,cover_pic").order('create_time DESC').select();

        for (var i = 1; i <= torecomPosts.length; i++) {
            torecomPosts[i - 1].cover_pic = '/static/home/images/blog/blog-' + i + '.jpg';
        }

        this.assign('menu', menu)
        this.assign('torecomPosts', torecomPosts)
        this.assign('admin_info', admin_info)


        return this.display();
    }

    async contactAction() {

        if (this.isPost()) {
            let data = this.http.post()
            let res = await this.model('contact').add(data)
            return this.json({message: 'Thanks! I have got it !'})
        }
    }

    async aboutAction() {
        let about_me = await this.model('system').where({sys_name: 'about_me'}).find();
        this.assign('about_me', about_me)
        return this.display();
    }
}