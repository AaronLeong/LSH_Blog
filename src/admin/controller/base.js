'use strict';

export default class extends think.controller.base {
    /**
     * some base method in here
     */
    async __before() {
        await this.getConfig();
        let thisUrl = this.http.module + "/" + this.http.controller + "/" + this.http.action;
        //判断登陆
        let userinfo = await this.session("userInfo");
        // console.log(userinfo)
        // console.log(this.http.action)
        if ((this.http.action != 'login') && (this.http.action != 'logout')) {
            let userinfo = await this.session("userInfo");
            if (think.isEmpty(userinfo)) {
                return this.redirect("/admin/index/login");
            } else {
                this.assign('userinfo', userinfo);
            }
        }

        //判断登陆

        //判断权限

        // let uinfo = await this.session('userInfo');
        // let username = uinfo.name;
        // let userData = await this.model('admin').findOne('user', {name: username});
        // let roleData = await this.model('admin').findOne('manage_role', {id: userData.role});
        // let permissions = (roleData.permission).split(",");
        //没有权限

        // if (myurl != 'admin/mail/warning') {
        //     if (permissions.indexOf(myurl) < 0) {
        //         if (this.http.method === 'POST') {
        //             return this.fail("抱歉，您没有权限访问,请与系统管理员联系!");
        //         } else {
        //             return this.display("admin/error/nopermission");
        //         }
        //     }
        // }

        //判断权限

        // csrf 防止模拟提交
        let csrf = await this.session("__CSRF__");
        this.assign("csrf", csrf);
        //}
    }

    async getConfig() {
        let sys_setting = await this.model('setting').where({sys_name:'web_setting'}).find()
        this.assign('_web', sys_setting);
    }

    /**
     * 判断是否登录
     * @returns {boolean}
     */
    async islogin() {
        //前台判断是否登录
        let user = await this.session('userInfo');
        let res = think.isEmpty(user) ? false : user.id;
        return res;
    }

    async weblogin() {
        let islogin = await this.islogin();
        if (!islogin) {
            //判断浏览客户端
            this.redirect('/user/login')
            //if (checkMobile(this.userAgent())) {
            //    //手机端直接跳转到登录页面
            //    this.redirect('/user/login')
            //} else {
            //    //pc端跳转到错误页面
            //    return think.statusAction(700,this.http);
            //}

        }
    }
}
