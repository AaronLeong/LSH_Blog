'use strict';
/**
 * db config
 * @type {Object}
 */
export default {
    // type: 'mysql',
    type: "mongo",
    adapter: {
        mysql: {
            host: '127.0.0.1',
            port: '',
            database: '',
            user: '',
            password: '',
            prefix: 'lsh',
            encoding: 'utf8'
        },
        mongo: {
            host:  '',
            port: '',
            user: 'lsh_blog',
            password: '',
            database: 'lsh_blog',
            prefix: 'lsh_',
            encoding: 'utf8'
        }
    }
};