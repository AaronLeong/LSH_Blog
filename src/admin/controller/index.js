'use strict';

import Base from './base.js';

export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        //auto render template file index_index.html
        let userCount = await this.model('user').count();
        let postCount = await this.model('post').count();
        let tagsCount = await this.model('tags').count();
        let categoryCount = await this.model('categories').count();
        let contactCount = await this.model('contact').count();
        let viewNums = await this.model("system").where({sys_name: 'view_nums'}).find();


        // console.log(viewNums)
        this.assign('userCount', userCount)
        this.assign('postCount', postCount)
        this.assign('tagsCount', tagsCount)
        this.assign('categoryCount', categoryCount)
        this.assign('contactCount', contactCount)
        this.assign('viewNums', viewNums)


        return this.display();
    }

    async loginAction() {
        //auto render template file index_index.html
        if (this.isGet()) {
            let sys_setting = await this.model('setting').find({_id: '5849709981be5002840e1dca'})
            this.assign('sys_setting', sys_setting)
            return this.display();
        } else {

            let login_data = this.post();
            let keep_me_logged_in = this.post('keep_me_logged_in')


            login_data.password = think.md5("lsh_" + login_data.password);


            let userInfo = await this.model('user').where({
                password: login_data.password,
                username: login_data.username
            }).find();

            if (think.isEmpty(userInfo)) {
                return this.display()
            } else {
                await this.session('userInfo', userInfo);
                return this.redirect('/admin/index')
            }
        }
    }

    //退出登录
    async logoutAction() {
        //退出登录
        await this.session('userInfo', null);
        this.redirect("/admin/index/login");
    }

}