var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Created by yangsong on 14/12/18.
 * 字符串操作工具类
 */
var StringUtils = /** @class */ (function (_super_1) {
    __extends(StringUtils, _super_1);
    /**
     * 构造函数
     */
    function StringUtils() {
        return _super_1.call(this) || this;
    }
    /**
    * 计算字符长度
    * @param str
    * @returns {number}
    */
    StringUtils.getStringLength = function (str) {
        return str.replace(/[^\x00-\xff]/g, '__').length; //这个把所有双字节的都给匹配进去了
    };
    /**
     * 去掉前后空格
     * @param str
     * @returns {string}
     */
    StringUtils.prototype.trimSpace = function (str) {
        return str.replace(/^\s*(.*?)[\s\n]*$/g, '$1');
    };
    /**
     * 获取字符串长度，中文为2
     * @param str
     */
    StringUtils.prototype.getStringLength = function (str) {
        var strArr = str.split("");
        var length = 0;
        for (var i = 0; i < strArr.length; i++) {
            var s = strArr[i];
            if (this.isChinese(s)) {
                length += 2;
            }
            else {
                length += 1;
            }
        }
        return length;
    };
    /**
     * 判断一个字符串是否包含中文
     * @param str
     * @returns {boolean}
     */
    StringUtils.prototype.isChinese = function (str) {
        var reg = /^.*[\u4E00-\u9FA5]+.*$/;
        return reg.test(str);
    };
    /** 移除后缀 */
    StringUtils.removeSuffix = function (str) {
        var b = str.substring(str.length - 4, str.length);
        str = str.replace(b, "");
        return str;
    };
    /** 替换后缀 */
    StringUtils.replaceSuffix = function (str) {
        var a = str.slice(str.lastIndexOf("."), str.length);
        // let a = str.substr(str.length - 4, 4)
        if (a == ".png") {
            str = str.replace(a, "_png");
        }
        else if (a == ".jpg") {
            str = str.replace(a, "_jpg");
        }
        else if (a == ".json") {
            str = str.replace(a, "_json");
        }
        else if (a == ".mp3") {
            str = str.replace(a, "_mp3");
        }
        return str;
    };
    /**格式化数字位数（整数） */
    StringUtils.pad = function (num, n) {
        return Array(n > ('' + num).length ? (n - ('' + num).length + 1) : 0).join('0') + num;
    };
    /**
        * 格式化字符串
        */
    StringUtils.stringFormat = function (str) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        //过滤掉所有
        str = str.replace(/%%/g, "%");
        return StringUtils.stringFormatArr(str, args);
    };
    StringUtils.stringFormatArr = function (str, args) {
        var new_str = str;
        for (var i in args) {
            var arg = args[i];
            if (new RegExp("(%s|%d)").test(new_str)) {
                new_str = new_str.replace(RegExp.$1, arg);
            }
        }
        return new_str;
    };
    /**
    * 搜索敏感词并替换
    */
    StringUtils.searchDwordsAndReplace = function (str) {
        com_main.DFA.searchDwords(str);
        for (var i = 0; i < com_main.DFA.m_pwords.length; i++) {
            var pattern = '(' + com_main.DFA.m_pwords[i] + ')';
            if (new RegExp(pattern).test(str)) {
                var replace = '';
                for (var j = 0; j < com_main.DFA.m_pwords[i].length; j++) {
                    replace += '*';
                }
                str = str.replace(RegExp.$1, replace);
            }
        }
        com_main.DFA.m_pwords = [];
        return str;
    };
    /**
    * 是否含有敏感词
    */
    StringUtils.ifHasDwords = function (str) {
        com_main.DFA.searchDwords(str);
        if (com_main.DFA.m_pwords.length > 0) {
            com_main.DFA.m_pwords = [];
            return true;
        }
        else
            return false;
    };
    /**解析指定格式字符串 返回keyVal
    * 格式："1_100,2_100,3_100"
    */
    StringUtils.keyValsToNumber = function (targetStr) {
        var attriList = targetStr.split(',');
        var res = {};
        for (var i = 0; i < attriList.length; i++) {
            var data = attriList[i].split('_');
            var type = Number(data[0]);
            var value = Number(data[1]);
            res[type] = value;
        }
        return res;
    };
    /**解析指定格式字符串 返回keyVal
   * 格式：服务器属性数组
   */
    StringUtils.keyValsToNumberSer = function (attris) {
        var res = {};
        for (var i = 0; i < attris.length; i++) {
            var data = attris[i];
            var type = data.key;
            var value = data.value;
            res[type] = value;
        }
        return res;
    };
    /**解析指定格式字符串 返回keyVal
     * 格式："1_100,2_100,3_100"
     * 返回数组
     */
    StringUtils.keyValsToNumberArray = function (targetStr) {
        if (targetStr == '')
            return [];
        var attriList = targetStr.split(',');
        var res = [];
        for (var i = 0; i < attriList.length; i++) {
            var data = attriList[i].split('_');
            var type = Number(data[0]);
            var value = Number(data[1]);
            res.push({ key: type, value: value });
        }
        return res;
    };
    /**解析指定格式字符串 返回keyVal
     * 格式："1,2,3"
     * 返回数组
     */
    StringUtils.stringToNumberArray = function (targetStr) {
        if (targetStr == '')
            return [];
        if (targetStr.indexOf(',') == -1)
            return [Number(targetStr)];
        var attriList = targetStr.split(',');
        var res = [];
        for (var i = 0; i < attriList.length; i++) {
            var type = Number(attriList[i]);
            res.push(type);
        }
        return res;
    };
    /**解析指定格式字符串 返回keyVal
   * 格式："[1,2,3]"
   * 返回数组
   */
    StringUtils.stringToNumberArray2 = function (targetStr) {
        if (targetStr == '')
            return [];
        targetStr = targetStr.replace("[", "").replace("]", "");
        if (targetStr == '')
            return [];
        if (targetStr.indexOf(',') == -1)
            return [Number(targetStr)];
        var attriList = targetStr.split(',');
        var res = [];
        for (var i = 0; i < attriList.length; i++) {
            var type = Number(attriList[i]);
            res.push(type);
        }
        return res;
    };
    return StringUtils;
}(BaseClass));
