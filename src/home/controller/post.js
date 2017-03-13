'use strict';

import Base from './base.js';
import pagination from'think-pagination';
import mditor from'mditor';
let parser = new mditor.Parser();

export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        //auto render template file index_index.html

        let posts = await this.model('post').where({
            delete: 0,
            publish: "on"
        }).field("_id,title,abstract,category,create_time").page(this.get("page"), 10).order("create_time DESC").countSelect();
        let tags = await this.model('tags').select();
        let categories = await this.model('categories').select();
        let recentPosts = await this.model('index').recentPosts(5)

        let cateColor = {}
        let cateStyle = {}
        let cateName = {}
        for (var i = 0; i < categories.length; i++) {
            // cateJson[categories[i]._id] = categories[i].class;

            let styleItem = [];
            styleItem[0] = categories[i].catename;
            styleItem[1] = categories[i].color;

            cateStyle[categories[i]._id] = styleItem

        }

        // console.log(cateStyle)
        for (var i = 0; i < posts.data.length; i++) {

            let category = posts.data[i].category;
            // console.log(posts.data[i])
            posts.data[i].catename = cateStyle[category][0];
            posts.data[i].color = cateStyle[category][1];

            // console.log(posts.data[i].catename)
            // console.log(posts.data[i].color)
        }


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


        // var pager = new Pager(data, baseUrl);
        // pager.anchor('anchor');
        // let html = pager.render()


        this.assign('posts', posts)
        this.assign('tags', tags)
        this.assign('categories', categories)
        this.assign('recentPosts', recentPosts)
        this.assign('navigator', html)
        return this.display();
    }


    async itemAction() {
        //auto render template file index_index.html
        let id = this.http.get('id')
        // console.log('id', id)

        let categories = await this.model('categories').select();
        let post = await this.model('post').where({
            _id: id,
            delete: 0,
            publish: "on"
        }).find();
        let recentPosts = await this.model('index').recentPosts(5)
        // console.log('post', post)
        post.view_nums += 1


        if (post.post_style == 'markdown') {
            // console.log('markdown')
            post.content = parser.parse(post.content);
        }

        this.model('index').updateViewNums(id)
        this.assign('categories', categories)
        this.assign('recentPosts', recentPosts)
        this.assign('post', post)
        return this.display();
    }

    async categoryAction() {
        //auto render template file index_index.html
        let category_id = this.http.get('id')
        // console.log('category_id', category_id)
        let posts = await this.model('post').where({
            category: category_id,
            delete: 0,
            publish: "on"
        }).field("_id,title,abstract,category,create_time").page(this.get("page"), 10).order("create_time DESC").countSelect();
        let tags = await this.model('tags').select();
        let categories = await this.model('categories').select();
        let recentPosts = await this.model('index').recentPosts(5)

        let cateColor = {}
        let cateStyle = {}
        let cateName = {}
        for (var i = 0; i < categories.length; i++) {
            // cateJson[categories[i]._id] = categories[i].class;

            let styleItem = [];
            styleItem[0] = categories[i].catename;
            styleItem[1] = categories[i].color;

            cateStyle[categories[i]._id] = styleItem

        }

        console.log(cateStyle)
        for (var i = 0; i < posts.data.length; i++) {

            let category = posts.data[i].category;

            posts.data[i].catename = cateStyle[category][0];
            posts.data[i].color = cateStyle[category][1];

            console.log(cateStyle[category])
        }

        let html = pagination(posts, this.http, {
            text: {
                next: '>',
                prev: '<',
                total: 'count: ${count} , pages: ${pages}'
            }
        });


        this.assign('posts', posts)
        this.assign('tags', tags)
        this.assign('categories', categories)
        this.assign('recentPosts', recentPosts)
        this.assign('navigator', html)
        return this.display(`home/post/index.html`);
    }

    async searchAction() {

        let q = this.get('q')

        let p = this.get('p')

        let posts = await this.model('post').where({
            $and: [{
                delete: 0,
                publish: "on"
            }, {$or: [{"content": {'$regex': q}}, {"title": {'$regex': q}}]}]
        }).page(p, 10).order("create_time DESC").countSelect();

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

//        return this.json(posts);
        this.assign('posts', posts)
        this.assign('q', q)

        this.assign('navigator', html)
        return this.display();

    }


}