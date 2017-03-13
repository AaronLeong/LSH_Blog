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
        let sys_setting = await this.model('setting').find({_id: '5849709981be5002840e1dca'})
        console.log(sys_setting)
        this.assign('sys_setting', sys_setting)
        return this.display();
    }

    async saveAction() {
        let sys_setting = this.post()
        //auto render template file index_index.html
        let uid = await this.model('setting').where({_id: "5849709981be5002840e1dca"}).update(sys_setting);
        console.log(uid)
        let id = await this.model('setting').find({_id: '5849709981be5002840e1dca'})
        console.log(id)
        return this.success();
    }

    async postAction() {

        if(this.isPost()){


        }else{
            this.assign('post', {title:'标题',abstract:'',content:'',keywords:'',author:'',from:'',allowcomment:1,totop:1,torecom:1,topicrecom:1})
            this.assign('cates', [{id:0,catename:'科研'}])
            this.assign('tagsList', [{id:0,tagname:'科研'}])
            this.assign('tagselectedId', 0)
            // this.assign('sys_setting', sys_setting)
            return this.display();
        }

        // let sys_setting = this.post()
        // //auto render template file index_index.html
        // let uid = await this.model('setting').where({_id: "5849709981be5002840e1dca"}).update(sys_setting);
        // console.log(uid)
        // let id = await this.model('setting').find({_id: '5849709981be5002840e1dca'})
        // console.log(id)
        // return this.success();

    }
}