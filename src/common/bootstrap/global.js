/**
 * this file will be loaded before server started
 * you can define global functions used in controllers, models, templates
 */

/**
 * use global.xxx to define global functions
 *
 * global.fn1 = function(){
 *     
 * }
 */
'use strict';
/*****项目函数库*******/

// livi 日期格式化
global.liFormatDate = function (formatStr) {
    let newdate = formatStr.split(' ')[0].replace(/-/g, "/");
    newdate = newdate.split('/')
    let FormatDate = newdate[2] + '/';

    if (newdate[0] < 10) {
        FormatDate = FormatDate + 0 + newdate[0] + '/' + newdate[1] + '/';
    } else {
        FormatDate = FormatDate + newdate[0] + '/' + newdate[1] + '/';
    }


    return FormatDate;
};

global.getNowFormatDate = function () {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}

//去掉首尾空格
global.trimStr = function (str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
};

global.getContent = function (filePath) {
    var fs = require("fs")
    //将readFile方法包装成Promise
    var readFilePromise = think.promisify(fs.readFile, fs);
    //读取文件内容
    return readFilePromise(filePath, "utf8");
}
//10位时间戳格式化
global.formatDate = function (formatStr, fdate) {
    var fTime, fStr = 'ymdhis';
    if (!formatStr) {
        formatStr = "y-m-d h:i:s";
    }
    if (fdate) {
        fTime = new Date(parseInt(fdate) * 1000); //10位数时间戳
    } else {
        fTime = new Date();
    }
    var month = (fTime.getMonth() > 8) ? (fTime.getMonth() + 1) : "0" + (fTime.getMonth() + 1);
    var date = (fTime.getDate() > 9) ? fTime.getDate() : "0" + fTime.getDate();
    var hours = (fTime.getHours() > 9) ? fTime.getHours() : "0" + fTime.getHours();
    var minutes = (fTime.getMinutes() > 9) ? fTime.getMinutes() : "0" + fTime.getMinutes();
    var seconds = (fTime.getSeconds() > 9) ? fTime.getSeconds() : "0" + fTime.getSeconds();
    var formatArr = [
        fTime.getFullYear().toString(),
        month.toString(),
        date.toString(),
        hours.toString(),
        minutes.toString(),
        seconds.toString()
    ]
    for (var i = 0; i < formatArr.length; i++) {
        formatStr = formatStr.replace(fStr.charAt(i), formatArr[i]);
    }
    return formatStr;
}
//获取10位数时间戳
global.time = function (str) {
    var date;
    if (str) {
        date = new Date(Date.parse(str.replace(/-/g, "/")));
        date = (date.getTime()) / 1000;
    } else {
        date = (new Date().getTime()) / 1000
    }

    return parseInt(date);
}
//获取13位数时间戳
global.timestamp = function () {
    "use strict";
    return new Date().getTime();
}
//13位时间戳格式化
global.timeFormat = function (formatStr, fdate) {
    var fTime, fStr = 'ymdhis';
    // console.log(fdate.toString())
    if(think.isEmpty(fdate)){
        return ''
    }
    fdate = fdate.toString().substr(0, 10)
    if (!formatStr) {
        formatStr = "y-m-d h:i:s";
    }
    if (fdate) {
        fTime = new Date(parseInt(parseInt(fdate) * 1000)); //10位数时间戳
    } else {
        fTime = new Date();
    }
    var month = (fTime.getMonth() > 8) ? (fTime.getMonth() + 1) : "0" + (fTime.getMonth() + 1);
    var date = (fTime.getDate() > 9) ? fTime.getDate() : "0" + fTime.getDate();
    var hours = (fTime.getHours() > 9) ? fTime.getHours() : "0" + fTime.getHours();
    var minutes = (fTime.getMinutes() > 9) ? fTime.getMinutes() : "0" + fTime.getMinutes();
    var seconds = (fTime.getSeconds() > 9) ? fTime.getSeconds() : "0" + fTime.getSeconds();
    var formatArr = [
        fTime.getFullYear().toString(),
        month.toString(),
        date.toString(),
        hours.toString(),
        minutes.toString(),
        seconds.toString()
    ]
    for (var i = 0; i < formatArr.length; i++) {
        formatStr = formatStr.replace(fStr.charAt(i), formatArr[i]);
    }
    return formatStr;
}
global.timeLeft = function (endDate) {
    // timeLeftStamp = timeLeftStamp.toString().substr(0, 10)
    //计算出相差天数
    console.log('endDate', endDate)
    if(think.isEmpty(endDate)){
        return 0
    }
    let nowDate = new Date().getTime()
    let timeLeftStamp = endDate - nowDate

    if (timeLeftStamp < 0) {
        return '0天'
    }

    console.log('timeLeftStamp', endDate - nowDate)
    var days = Math.floor(timeLeftStamp / (24 * 3600 * 1000))
    //计算出小时数
    var leave1 = timeLeftStamp % (24 * 3600 * 1000)
    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000))
    //计算相差分钟数
    var leave2 = timeLeftStamp % (3600 * 1000)
    //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000))
    //计算相差秒数
    var leave3 = timeLeftStamp % (60 * 1000)
    //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000)
    let formatStr = days + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒"

    return formatStr;
}
//中文字符串截取
global.subStr = function (str, len, hasDot) {
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = "";
    var strLength = str.replace(chineseRegex, "**").length;
    for (var i = 0; i < strLength; i++) {
        singleChar = str.charAt(i).toString();
        if (singleChar.match(chineseRegex) != null) {
            newLength += 2;
        } else {
            newLength++;
        }
        if (newLength > len) {
            break;
        }
        newStr += singleChar;
    }

    if (hasDot && strLength > len) {
        newStr += "...";
    }
    return newStr;
}
//过滤html标签
global.removeTag = function (str) {
    str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
    //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    str = str.replace(/&nbsp;/ig, ''); //去掉&nbsp;
    str = str.replace(/ /ig, ''); //去掉
    return str;
}
//读取文件
global.readFile = function (file) {
    var fs = think.require('fs'); //引入fs处理文件
    var data = fs.readFileSync(file);
    return data;
}
//写入文件
global.writeFile = async function (file, data) {
    var fs = think.require('fs'); //引入fs处理文件
    fs.writeFile(file, data, function (err) {
        if (err) {
            return false;
        } else {
            return true;
        }
    });
}
//去掉首尾空格
global.trimStr = function (str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
//判断是否为数字
global.isNum = function (s) {
    if (s != null) {
        var r, re;
        re = /\d*/i; //\d表示数字,*表示匹配多个数字
        r = s.match(re);
        return (r == s) ? true : false;
    }
    return false;
}
//判断是否存在数组中
global.inArray = function (arr, str) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === str) {
            return true;
        }
    }
    return false;
}

/**
 * ltrim()
 * @param str [删除左边的空格]
 * @returns {*|void|string|XML}
 */
/* global ltrim */
global.ltrim = function (str) {
    return str.replace(/(^\s*)/g, "");
}
/**
 *
 * rtrim()
 * @param str [删除右边的空格]
 * @returns {*|void|string|XML}
 */
/* global rtrim */
global.rtrim = function (str) {
    return str.replace(/(\s*$)/g, "");
}

global.stringTrim = function (str) {
    return str.trim();
}

global.stringTrim = function (str) {
    return str.trim();
}
global.isPhone = function (str) {
    return str.trim();
}

global.createCode = function (_idx) {
    var str = '';
    for (var i = 0; i < _idx; i += 1) {
        str += Math.floor(Math.random() * 10);
    }
    return str;
}