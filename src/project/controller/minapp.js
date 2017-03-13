/**
 * Created by AaronLeong on 10/01/2017.
 */
'use strict';

import Base from './base.js';
import request from "request";
let wxConfig = think.config('wxconfig')
let wxBizDataCrypt = think.config('wxbizdatacrypt')
var ObjectID = require('mongodb').ObjectID;
var Identicon = require('identicon.js');
var fs = require("fs");
var moment = require('moment');
moment.locale('zh-cn')
// moment().twitter()
// var retricon = require('retricon');
// var fmt = require('util').format;

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
     * 首页最近通话记录
     * @return {Promise} []
     */
    // async recordlistAction() {
    //     if (this.isGet()) {
    //         let user_id = this.get('user_id')
    //         console.log(this.get())
    //         if (think.isEmpty(user_id)) {
    //             console.log('为空user_id', user_id)
    //             return this.fail('user_id 不能为空')
    //         }
    //         console.log('user_id', user_id)
    //         // let userInfo = await this.model('member').where({_id: user_id}).find()
    //         // let uid = new db.ObjectId(user_id)
    //         let uid = new ObjectID(user_id)
    //         let res = await this.model('contact_record').recordlist({user_id: uid})
    //         // console.log(res)
    //         if (think.isEmpty(res)) {
    //             return this.fail('没有记录')
    //         } else {
    //
    //             for (var i = 0; i < res.length; i++) {
    //                 res[i]['connect_time'] = moment(res[i]['connect_time']).fromNow()
    //                 // let date =moment(1481441575419).twitterLong()
    //                 // moment.locale('fr');
    //                 // let date = moment(1484116459775).fromNow()
    //             }
    //             return this.success(res)
    //
    //         }
    //     } else {
    //         return this.fail()
    //     }
    // }

    /**
     * 首页最近通话记录
     * @return {Promise} []
     */
    async recordlistAction() {
        if (this.isGet()) {
            let user_id = this.get('user_id')
            console.log(this.get())
            if (think.isEmpty(user_id)) {
                console.log('为空user_id', user_id)
                return this.fail('user_id 不能为空')
            }
            console.log('user_id', user_id)
            // let userInfo = await this.model('member').where({_id: user_id}).find()
            // let uid = new db.ObjectId(user_id)
            let uid = new ObjectID(user_id)
            let res = await this.model('contact_connect').recordlist({user_id: uid})
            // console.log(res)
            if (think.isEmpty(res)) {
                return this.success()
            } else {
                return this.success(res)
            }
        } else {
            return this.fail()
        }
    }

    /**
     * 某一个人所有的通话记录
     * @return {Promise} []
     */
    async recorditemAction() {
        // let userInfo = await this.model('member').where({_id: '58749734ca246c733549e923'}).find()
        if (this.isGet()) {
            let friend_id = this.get('friend_id')
            let user_id = this.get('user_id')
            // let friendInfo = await this.model('member').where({_id: friend_id}).find()

            friend_id = new ObjectID(friend_id)
            user_id = new ObjectID(user_id)


            let res = await this.model('contact_record').where({
                user_id: user_id,
                friend_id: friend_id
            }).order("connect_time DESC").limit(20).select()


            if (think.isEmpty(res)) {
                return this.success()
            } else {
                for (var i = 0; i < res.length; i++) {
                    res[i]['connect_time'] = moment(res[i]['connect_time']).fromNow()
                    // let date =moment(1481441575419).twitterLong()
                    // moment.locale('fr');
                    // let date = moment(1484116459775).fromNow()
                }
                return this.success(res)
            }
        } else {
            return this.fail()
        }
    }

    /**
     * 添加通话记录
     * @returns {*}
     */
    async addphonerecordAction() {
        // let userInfo = await weblogin()
        // let userInfo = await this.model('member').where({_id: '58749734ca246c733549e923'}).find()
        if (this.isPost()) {

            console.log(this.post())
            let friend_id = this.post('friend_id')
            let user_id = this.post('user_id')

            friend_id = new ObjectID(friend_id)
            user_id = new ObjectID(user_id)


            let timestamp = global.timestamp()

            let res_connect = await this.model('contact_connect').where({
                user_id: user_id,
                friend_id: friend_id
            }).find()

            if (think.isEmpty(res_connect)) {

                await this.model('contact_connect').add({
                    user_id: user_id,
                    friend_id: friend_id,
                    connect_nums: 1
                })

            } else {

                await this.model('contact_connect').where({
                    user_id: user_id,
                    friend_id: friend_id
                }).update({connect_nums: res_connect.connect_nums + 1, update_time: timestamp});

            }

            let res_record = await this.model('contact_record').add({
                user_id: user_id,
                friend_id: friend_id,
                connect_time: timestamp
            })

            if (think.isEmpty(res_record)) {
                return this.fail()
            } else {
                return this.success()
            }
        } else {
            return this.fail()
        }
    }


    /**
     * 联系人列表
     * @return {Promise} []
     */
    async contactlistAction() {
        // let userInfo = await weblogin()
        if (this.isGet()) {

            let user_id = this.get('user_id')
            user_id = new ObjectID(user_id)

            // let user_id = userInfo._id
            // let timestamp = timestamp()

            let res_connect = await this.model('contact_connect').lookup({user_id: user_id});
            let res_contact_group_connect = await this.model('contact_group_connect').lookup({user_id: user_id});

            if (think.isEmpty(res_connect)) {
                return this.fail()
            } else {
                return this.success({connect: res_connect, group: res_contact_group_connect})
            }
        } else {
            return this.fail()
        }
    }

    /**
     * 单个联系人信息
     * @return {Promise} []
     */
    async contactitemAction() {
        //let userInfo = await this.model('member').where({_id: '58749734ca246c733549e923'}).find()
        if (this.isGet()) {
            let friend_id = this.get('friend_id')
            let user_id = this.get('user_id')
            friend_id = new ObjectID(friend_id)
            user_id = new ObjectID(user_id)

            let res_connect = await this.model('contact_connect').lookup({
                $and: [
                    {user_id: user_id},
                    {friend_id: friend_id}
                ]
            });

            if (think.isEmpty(res_connect)) {
                return this.fail()
            } else {
                return this.success({connect: res_connect})
            }
        } else {
            return this.fail()
        }
    }

    /**
     * 群列表信息
     * @return {Promise} []
     */
    async grouplistAction() {

        if (this.isGet()) {

            // let friend_id = this.get('friend_id')
            let user_id = this.get('user_id')
            // friend_id = new ObjectID(friend_id)
            user_id = new ObjectID(user_id)

            let res_contact_group_connect = await this.model('contact_group_connect').lookup({user_id: user_id});

            console.log(res_contact_group_connect)
            if (think.isEmpty(res_contact_group_connect)) {
                return this.success({groupList:[] })
            } else {
                return this.success({groupList: res_contact_group_connect})
            }
        } else {
            return this.fail()
        }
    }


    /**
     * 单个群成员列表信息
     * @return {Promise} []
     */
    async groupmemberAction() {

        if (this.isGet()) {
            let group_id = this.get('group_id')
            let user_id = this.get('user_id')
            group_id = new ObjectID(group_id)
            user_id = new ObjectID(user_id)
            console.log(group_id)

            let res_group_connect_member = await this.model('contact_group_connect').memberlist({group_id: group_id});
            // let res_group_connect_member = await this.model('contact_group_connect').where({_id: group_id}).select();

            if (think.isEmpty(res_group_connect_member)) {
                return this.fail()
            } else {
                return this.success({groupMember: res_group_connect_member})
            }
        } else {
            return this.fail()
        }
    }


    /**
     * 暗号创建群
     * @return {Promise} [
     * group_id
     * memberlist []
     */
    async creategroupAction() {
        //auto render template file index_index.html
        // 用户ID、经纬度、时间戳
        // let userInfo = await this.model('member').where({_id: '58749734ca246c733549e923'}).find()
        // let userInfo = await weblogin()
        if (this.isPost()) {
            let post_group = this.post()
            console.log(post_group)
            let user_id = this.post('user_id')
            user_id = new ObjectID(user_id)
            let code = this.post('code')

            code = parseInt(code)

            let timestamp = global.timestamp() - (1000 * 180)
            let group_id = null

            let lng = parseFloat(post_group.longitude), lat = parseFloat(post_group.latitude), distance = 5000;
            if (think.isEmpty(post_group)) {
                lng = 118.783799, lat = 31.979234, distance = 1000;
            }

            console.log('loc', lng, lat)
            let res_contact_group_info = await this.model('contact_group_info').where({
                $and: [{
                    loc: {
                        $near: {
                            $geometry: {
                                type: "Point",
                                coordinates: [lng, lat]
                            },
                            $maxDistance: distance
                        }
                    }
                }, {code: code}, {create_time: {'>': timestamp}}]
            }).find();

            group_id = res_contact_group_info._id
            if (think.isEmpty(group_id)) {
                console.log('create group')

                let pc = new wxBizDataCrypt(null, null)
                let sha1String = user_id + global.timestamp() + code
                let sha1Data = pc.sha1Data(sha1String)
                var data = new Identicon(sha1Data, 32).toString();
                // console.log(data)

                //获取文件内容
                var writeFile = function (filePath, data) {
                    //将writeFile方法包装成Promise
                    var writeFilePromise = think.promisify(fs.writeFile, fs);
                    //读取文件内容
                    return writeFilePromise(filePath, data, "base64");
                }
                //文件上传后，需要将文件移动到项目其他地方，否则会在请求结束时删除掉该文件
                let uploadPath = think.RESOURCE_PATH + '/static/group/avatar/';
                think.mkdir(uploadPath);
                var basename = sha1Data + '.png'
                await writeFile(uploadPath + basename, data).then(function (content) {
                    console.log(content);
                }).catch(function (err) {
                    console.error(err.stack);
                })

                basename = '/static/group/avatar/' + basename
                group_id = await this.model('contact_group_info').add({
                    group_name: "群组",
                    group_avatar: basename,
                    loc: {
                        "type": "Point",
                        "coordinates": [
                            lng,
                            lat
                        ]
                    },
                    create_by: user_id,
                    code: code,
                    create_time: global.timestamp()
                });

                console.log('res_create_group', group_id)
            }

            group_id = new ObjectID(group_id)
            console.log('group_id', group_id)
            let res_group_connect_member = await this.model('contact_group_connect').memberlist({group_id: group_id});
            return this.success({groupId: group_id, memberList: res_group_connect_member})
        } else {
            return this.fail()
        }
    }

    /**
     * 选择加入群
     * @return {Promise} []
     */
    async selectgroupAction() {

        if (this.isPost()) {
            let post_group = this.post()

            console.log(post_group)
            let group_id = this.post('group_id')
            let user_id = this.post('user_id')
            group_id = new ObjectID(group_id)
            user_id = new ObjectID(user_id)

            if (!think.isEmpty(group_id)) {
                let res_group_add_member = await this.model('contact_group_connect').thenAdd({
                    user_id: user_id, group_id: group_id, create_time: global.timestamp()
                }, {
                    user_id: user_id, group_id: group_id,
                });
                console.log('res_group_add_member', res_group_add_member)
                if (think.isEmpty(res_group_add_member.type)) {
                    return this.fail('err')
                } else {
                    return this.success({type: res_group_add_member.type})
                }
            }

        } else {
            return this.fail()
        }


    }

    /**
     * 创建帐号
     * @return [用户信息]
     */
    async loginAction() {


        if (this.isPost()) {
            let loginInfo = this.post()
            let user_id = loginInfo.user_id;
            let token = loginInfo.token;
            let name = await think.cache(user_id);
            console.log('loginInfo', loginInfo, 'login-name', name)
            if (think.isEmpty(token) || think.isEmpty(user_id) || (token != name)) {
                return this.fail('token或ID不正确')
            } else {
                let res_member_info = await this.model('member').where({_id: user_id}).find()

                delete res_member_info["watermark"]
                delete res_member_info["openId"]
                delete res_member_info["unionId"]

                if (think.isEmpty(res_member_info)) {
                    console.log('还没注册')
                    return this.fail('还没注册')
                }
                console.log('登陆成功')
                return this.success(res_member_info)
            }
        } else {
            return this.fail()
        }
    }

    /**
     * 注册信息
     * @returns 用户信息和token
     */
    async registerAction() {

        // let userInfo = await weblogin()
        // {"nickName":"梁仕华","gender":1,"language":"zh_CN","city":"","province":"","country":"CN","avatarUrl":"http://wx.qlogo.cn/mmopen/vi_32/9xkaQhBrbjL5EHFJ02rx5WSicsc5aJRHe0d7TldQ9CfV4zWk9JCo9BVREfuia55PWG6l1ibQVicibBL1BqlXlKMMrTA/0","code":"0136VpN003UBNC1zzxM00ySqN006VpNd"}
        //
        if (this.isPost()) {
            let loginInfo = this.post()
            // var rawData = '{"nickName":"梁仕华","gender":1,"language":"zh_CN","city":"","province":"","country":"CN","avatarUrl":"http://wx.qlogo.cn/mmopen/vi_32/9xkaQhBrbjL5EHFJ02rx5WSicsc5aJRHe0d7TldQ9CfV4zWk9JCo9BVREfuia55PWG6l1ibQVicibBL1BqlXlKMMrTA/0"}';
            // console.log('register', loginInfo)

            let signature = loginInfo.signature
            let rawData = loginInfo.rawData;
            let encryptedData = loginInfo.encryptedData;
            let iv = loginInfo.iv;
            let code = loginInfo.code;
            // console.log(signature, rawData, encryptedData, iv,code)

            let wxUrl = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + wxConfig.AppID + '&secret=' + wxConfig.AppSecret + '&js_code=' + code + '&grant_type=authorization_code'

            /* 获取 API 接口数据 */
            let getApiData = () => {
                let fn = think.promisify(request.get);
                return fn({
                    url: wxUrl
                });
            }
            // 获取openid 和 session_key
            let wxopendata = await getApiData()
            wxopendata = JSON.parse(wxopendata.body)
            //获取签名


            let openid = wxopendata.openid
            if (think.isEmpty(openid)) {
                return this.fail('错误时返回JSON数据包(示例为Code无效)')
            }

            let pc = new wxBizDataCrypt(wxConfig.AppID, wxopendata.session_key)
            let sha1String = rawData + wxopendata.session_key;
            let sha1Data = pc.sha1Data(sha1String)


            if (sha1Data != signature) {
                console.log('签名数据signature不合法,signature:', signature, 'sha1Data', sha1Data)
                return this.fail('签名数据signature不合法', signature, sha1Data)
            }

            // 解密数据

            var decryptData = pc.decryptData(encryptedData, iv)

            // console.log('decryptData', decryptData)

            // console.log('openid', openid)
            // console.log('wxopendata', wxopendata)

            let res_member_info = await this.model('member').where({openId: openid}).find()
            let res_member_id = res_member_info._id
            if (think.isEmpty(res_member_info)) {
                decryptData.username = decryptData.nickName;
                res_member_id = await this.model('member').add(decryptData)
            }

            // console.log('res_member_id', res_member_id)

            if (!think.isEmpty(res_member_id)) {
                let timestamp = global.timestamp()
                decryptData._id = res_member_id
                res_member_id = res_member_id.toString()
                var token = pc.sha1Data(res_member_id + timestamp)
                console.log('获取注册的token', token)
                await think.cache(res_member_id, token, {timeout: 7 * 3600});
                let token_value = await think.cache(res_member_id);
                // console.log('token_key', res_member_id, 'value', token_value)
                decryptData.token = token
                delete decryptData["watermark"]
                delete decryptData["openId"]
                delete decryptData["unionId"]
                return this.success(decryptData)
            } else {
                return this.fail()
            }
        } else {
            return this.fail()
        }
    }

    async jiemiAction() {
        var appId = ''
        var sessionKey = '=='
        var encryptedData =''
        var iv = '=='

        var pc = new wxBizDataCrypt(appId, sessionKey)

        var data = pc.decryptData(encryptedData, iv)

        var rawData = '{"nickName":"梁仕华","gender":1,"language":"zh_CN","city":"","province":"","country":"CN","avatarUrl":"http://wx.qlogo.cn/mmopen/vi_32/9xkaQhBrbjL5EHFJ02rx5WSicsc5aJRHe0d7TldQ9CfV4zWk9JCo9BVREfuia55PWG6l1ibQVicibBL1BqlXlKMMrTA/0"}';
        sessionKey = '4MG3E=='
        var sha1String = rawData + '4MG3EJ+=='
        console.log(sha1String)
        var data2 = pc.sha1Data(sha1String)

        console.log('解密后 data: ', data2)

        return this.success(data2)
    }

    /**
     * 个人中心
     * @return {Promise} []
     */
    async userAction() {
        //auto render template file index_index.html
        // 用户ID、经纬度、时间戳
        // let userInfo = await weblogin()
        if (this.isGet()) {
            let userInfo = await this.model('member').where({_id: userInfo._id}).find()
            if (think.isEmpty(userInfo)) {
                return this.fail()
            } else {
                return this.success()
            }
        } else {
            return this.fail()
        }
    }

    /**
     * 个人设置
     * @return {Promise} []
     */
    async settingAction() {
        if (this.isPost()) {
            let setting = this.post()
            console.log('setting', setting)
            let user_id = this.post('user_id')
            user_id = new ObjectID(user_id)
            delete setting['user_id']
            let res = await this.model('member').where({_id: user_id}).update(setting)
            console.log('res', res)
            if (think.isEmpty(res)) {
                return this.fail()
            } else {
                return this.success()
            }
        } else {
            return this.fail()
        }
    }

    /**
     * 设置电话号码
     * @return {Promise} []
     */
    async phoneAction() {
        //auto render template file index_index.html
        // 用户ID、经纬度、时间戳
        let userInfo = await weblogin()
        if (this.isPost()) {
            let phone = this.post()
            let res = await this.model('member').where({_id: userInfo._id}).update(phone)
            if (think.isEmpty(res)) {
                return this.fail()
            } else {
                return this.success()
            }
        } else {
            return this.fail()
        }
    }

    async testAction() {
//109.11522 21.690945
        let timestamp = global.timestamp() - (1000 * 180)
        let lat = 21.690945, lng = 109.1274, distance = 5000, code = '1580';
        console.log('loc', lat, lng)
        let res_contact_group_info = await this.model('contact_group_info').where({
            $and: [{
                loc: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [lng, lat]
                        },
                        $maxDistance: distance
                    }
                }
            }, {code: code}, {create_time: {'>': timestamp}}]
        }).find();

        console.log(res_contact_group_info)
  

        return this.success(res_contact_group_info)

    }


}
