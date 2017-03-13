/**
 * Created by AaronLeong on 11/01/2017.
 */
export default {
    type: "redis", //缓存方式
    adapter: {
        redis: {
            prefix: "lsh_", //缓存名称前缀
        }
    }
};