/**
 * Created by AaronLeong on 11/12/2016.
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
        let userInfo = await this.session("userInfo");
        let user = await this.model('user').where({_id: userInfo._id}).find();
        await this.session("userInfo", user);
        this.assign('userInfo', user)
        return this.display();
    }

    async saveAction() {
        let data = this.post()
        //auto render template file index_index.html
        let userInfo = await this.session("userInfo");


        await this.model('system').where({sys_name: 'admin_info'}).update(data);
        let uid = await this.model('user').where({_id: userInfo._id}).update(data);
        data._id = userInfo._id
        // console.log(uid)
        // console.log(id)
        await this.session("userInfo", data);
        this.assign('userInfo', data)
        return this.redirect('/admin/user')
    }

    async updatepasswordAction() {


        if (this.http.isPost()) {
            let data = this.post()

            if (think.isEmpty(data.password) && think.isEmpty(data.repassword)) {
                this.assign("info", "密码不能为空，请重新填写！")
                return this.display()
            } else {
                if (data.password != data.repassword) {
                    this.assign("info", "两次输入的密码不一致，请重新填写！")

                    return this.display()
                }
            }

            let userInfo = await this.session("userInfo");
            let pwd = think.md5('lsh_' + data.oldpassword)


            if (userInfo.password == pwd) {
                let mydata = await this.model("user").where({
                    id: userInfo._id
                }).update({password: think.md5('lsh_' + data.newpassword)});

            } else {
                this.assign("info", "old password is wrong！")

            }
            return this.display()
        } else {
            return this.display()
        }
    }

    async aboutAction() {

        if (this.http.isPost()) {
            let data = this.post()
            let mydata = await this.model("system").where({
                sys_name: 'about_me'
            }).update(data);
            return this.redirect('/admin/user/about')
        } else {
            let about_me = await this.model('system').where({sys_name: 'about_me'}).find();
            this.assign('about_me', about_me)
            return this.display()
        }
    }

}