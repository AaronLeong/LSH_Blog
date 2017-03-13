/**
 * Created by AaronLeong on 09/12/2016.
 */

'use strict';

import Base from './base.js';
import pagination from'think-pagination';

export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        //auto render template file index_index.html

        return this.display();
    }

    /**
     *  post list
     * @returns {*}
     */
    async listAction() {
        //auto render template file index_index.html
        // let sys_setting = await this.model('setting').find({_id: '5849709981be5002840e1dca'})
        let tags = await this.model('tags').page(this.get("page"), 10).countSelect();

        let html = pagination(tags, this.http, {
            //desc: false, //show description
            // pageNum: 2,
            // url: '', //page url, when not set, it will auto generated
            // class: 'nomargin', //pagenation extra class
            text: {
                next: '>',
                prev: '<',
                total: 'count: ${count} , pages: ${pages}'
            }
        });
        console.log('tags', tags)

        this.assign('tags', tags)
        this.assign('navigator', html)

        return this.display();
    }

    async itemAction() {
        //auto render template file index_index.html
        let id = this.http.get('id')
        console.log('id', id)
        let res = await this.model('tags').where({'name': 'tags'}).find();
        console.log('res', res)
        this.assign('post', res)
        return this.display();
    }

    async delectAction() {
        //auto render template file index_index.html
        let id = this.http.get('id')
        let delect = await this.model('tags').where({_id: id}).delete();
        if (think.isEmpty(delect)) {
            this.assign('info', 'delete successful!')
        } else {
            this.assign('info', 'delete failed!')
        }
        return this.redirect('/admin/tags/list')
    }

    /**
     * add post
     * @returns {*}
     */
    async updateAction() {

        if (this.isPost()) {
            let data = this.post()
            console.log('data', data)
            if (think.isEmpty(data._id)) {
                data.create_time = new Date()
                data.sys_name = "tags"
                let res = await this.model('tags').add(data)
                console.log('create_res', res)
                if (!think.isEmpty(res)) {
                    return this.redirect('/admin/tags/list')
                } else {
                    return this.fail()
                }
            } else {
                data.update_time = new Date();
                let res = await this.model('tags').where({_id: data._id}).update(data)
                console.log('update_res', res)
                if (!think.isEmpty(res)) {
                    return this.success()
                } else {
                    return this.fail()
                }
            }

        } else {
            this.assign('post', {
                title: '标题',
                abstract: 'abstract',
                content: 'content',
                keywords: 'keywords',
                author: '',
                from: '',
                allowcomment: 1,
                totop: 1,
                torecom: 1,
                topicrecom: 1,
                caterecom: 1,
                publish: 1,
            })
            this.assign('cates', [{id: 0, catename: '科研'}, {id: 1, catename: '项目'}])
            this.assign('tags', [{id: 0, tagname: '科研'}])
            this.assign('tagselectedId', 1)
            this.assign('cateId', 0)
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