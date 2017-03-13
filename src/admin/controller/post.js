/**
 * Created by AaronLeong on 08/12/2016.
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

        let posts = await this.model('post').where({delete: 0}).field("_id,title,view_nums,create_time").page(this.get("page"), 10).countSelect();
        let html = pagination(posts, this.http, {
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

        this.assign('posts', posts)
        this.assign('navigator', html)
        return this.display();
    }


    async newAction() {
        let categories = await this.model('categories').select();
        let tags = await this.model('tags').select();
        this.assign('categories', categories)
        this.assign('tags', tags)
        return this.display(`admin/post/item.html`);
    }

    async itemAction() {
        //auto render template file index_index.html
        let id = this.http.get('id')
        let categories = await this.model('categories').select();
        let tags = await this.model('tags').select();
        let post = await this.model('post').where({_id: id}).find();
        // console.log('tags', tags)
        this.assign('tags', tags)
        this.assign('categories', categories)
        if (post.post_style == 'markdown') {
            this.assign('post', post)
            return this.display(`admin/post/markdown.html`);
        }
        console.log('not markdown')
        this.assign('post', post)
        return this.display(`admin/post/item.html`);
    }

    async delectAction() {
        //auto render template file index_index.html
        let id = this.http.get('id')
        let delect = await this.model('post').where({_id: id}).update({'delete': 1});
        if (think.isEmpty(delect)) {
            this.assign('info', 'delete successful!')
        } else {
            this.assign('info', 'delete failed!')
        }
        return this.redirect('/admin/post/list')
    }


    /**
     * add and update post
     * @returns {*}
     */
    async updateAction() {

        if (this.isPost()) {
            let data = this.post()
            // console.log('data', data)
            if (think.isEmpty(data._id)) {
                data.create_time = new Date()
                data.view_nums = 0
                data._id = null;
                data.delete = 0;
                let categories = await this.model('categories').where({_id: data.category}).increment("post_nums", 1)
                let res = await this.model('post').add(data)
                console.log('create_res', res)
                if (!think.isEmpty(res)) {
                    return this.redirect('/admin/post/list')
                } else {
                    let categories = await this.model('categories').select();
                    let tags = await this.model('tags').select();
                    this.assign('categories', categories)
                    this.assign('tags', tags)
                    this.assign('post', data)

                    return this.redirect('/admin/post/new')
                }
            } else {
                data.update_time = new Date();
                data.delete = 0;
                let res = await this.model('post').where({_id: data._id}).update(data)
                console.log('update_res', res)
                if (!think.isEmpty(res)) {
                    return this.redirect('/admin/post/list')
                } else {
                    return this.redirect('/admin/post/item/' + data._id)
                }
            }
        }
    }

    /**
     * markdown
     * @returns {*}
     */
    async markdownAction() {
        let categories = await this.model('categories').select();
        let tags = await this.model('tags').select();
        this.assign('categories', categories)
        this.assign('tags', tags)
        return this.display();
    }

    /**
     * draftlist
     * @returns {*}
     */
    async draftlistAction() {
        let sys_setting = this.post()
        //auto render template file index_index.html
        let uid = await this.model('setting').where({sys_name: 'web_setting'}).update(sys_setting);
        console.log(uid)
        let id = await this.model('setting').where({sys_name: 'web_setting'}).find()
        console.log(id)
        return this.success();
    }

}