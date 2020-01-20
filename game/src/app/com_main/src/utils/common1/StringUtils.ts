interface IKeyVal {
    key: number,
    value: number
}
/**
 * Created by yangsong on 14/12/18.
 * 字符串操作工具类
 */
class StringUtils extends BaseClass {
    /**
     * 构造函数
     */
    public constructor() {
        super();
    }

    /**
    * 计算字符长度
    * @param str
    * @returns {number}
    */
    public static getStringLength(str) {
        return str.replace(/[^\x00-\xff]/g, '__').length; //这个把所有双字节的都给匹配进去了
    }

    /**
     * 去掉前后空格
     * @param str
     * @returns {string}
     */
    public trimSpace(str: string): string {
        return str.replace(/^\s*(.*?)[\s\n]*$/g, '$1');
    }

    /**
     * 获取字符串长度，中文为2
     * @param str
     */
    public getStringLength(str: string): number {
        var strArr = str.split("");
        var length = 0;
        for (var i = 0; i < strArr.length; i++) {
            var s = strArr[i];
            if (this.isChinese(s)) {
                length += 2;
            } else {
                length += 1;
            }
        }
        return length;
    }

    /**
     * 判断一个字符串是否包含中文
     * @param str
     * @returns {boolean}
     */
    public isChinese(str: string): boolean {
        var reg = /^.*[\u4E00-\u9FA5]+.*$/;
        return reg.test(str);
    }

    /** 移除后缀 */
    public static removeSuffix(str: string) {
        let b = str.substring(str.length - 4, str.length)
        str = str.replace(b, "");
        return str;
    }

    /** 替换后缀 */
    public static replaceSuffix(str: string) {
        let a = str.slice(str.lastIndexOf("."), str.length);
        // let a = str.substr(str.length - 4, 4)
        if (a == ".png") {
            str = str.replace(a, "_png");
        } else if (a == ".jpg") {
            str = str.replace(a, "_jpg");
        } else if (a == ".json") {
            str = str.replace(a, "_json");
        } else if (a == ".mp3") {
            str = str.replace(a, "_mp3");
        }
        return str;
    }

    /**格式化数字位数（整数） */
    public static pad(num, n) {
        return Array(n > ('' + num).length ? (n - ('' + num).length + 1) : 0).join('0') + num;
    }

    /**
        * 格式化字符串
        */
    public static stringFormat(str: string, ...args: any[]): string {
        //过滤掉所有
        str = str.replace(/%%/g, "%");
        return StringUtils.stringFormatArr(str, args);
    }

    public static stringFormatArr(str: string, args: Array<any>): string {
        var new_str = str;
        for (var i in args) {
            var arg = args[i];
            if (new RegExp("(%s|%d)").test(new_str)) {
                new_str = new_str.replace(RegExp.$1, arg);
            }
        }
        return new_str;
    }

    /**
    * 搜索敏感词并替换
    */
    public static searchDwordsAndReplace(str: string) {
        com_main.DFA.searchDwords(str);
        for (let i: number = 0; i < com_main.DFA.m_pwords.length; i++) {
            let pattern = '(' + com_main.DFA.m_pwords[i] + ')';
            if (new RegExp(pattern).test(str)) {
                let replace = '';
                for (let j: number = 0; j < com_main.DFA.m_pwords[i].length; j++) {
                    replace += '*';
                }
                str = str.replace(RegExp.$1, replace);
            }
        }
        com_main.DFA.m_pwords = [];
        return str;
    }

    /**
    * 是否含有敏感词
    */
    public static ifHasDwords(str: string) {
        com_main.DFA.searchDwords(str);
        if (com_main.DFA.m_pwords.length > 0) {
            com_main.DFA.m_pwords = [];
            return true;
        }
        else
            return false;
    }

    /**解析指定格式字符串 返回keyVal
    * 格式："1_100,2_100,3_100"
    */
    public static keyValsToNumber(targetStr: string): { [key: number]: number } {
        let attriList = targetStr.split(',');
        let res = {};
        for (let i = 0; i < attriList.length; i++) {
            let data = attriList[i].split('_')
            let type = Number(data[0]);
            let value = Number(data[1]);
            res[type] = value;
        }
        return res;
    }

    /**解析指定格式字符串 返回keyVal
   * 格式：服务器属性数组
   */
    public static keyValsToNumberSer(attris: gameProto.IAttributeValue[]): { [key: number]: number } {
        let res = {};
        for (let i = 0; i < attris.length; i++) {
            let data = attris[i];
            let type = data.key;
            let value = data.value;
            res[type] = value;
        }
        return res;
    }

    /**解析指定格式字符串 返回keyVal
	 * 格式："1_100,2_100,3_100"
     * 返回数组
	 */
    public static keyValsToNumberArray(targetStr: string): IKeyVal[] {
        if (targetStr == '') return [];
        let attriList = targetStr.split(',');
        let res: IKeyVal[] = [];
        for (let i = 0; i < attriList.length; i++) {
            let data = attriList[i].split('_')
            let type = Number(data[0]);
            let value = Number(data[1]);
            res.push({ key: type, value: value });
        }
        return res;
    }

    /**解析指定格式字符串 返回keyVal
	 * 格式："1,2,3"
     * 返回数组
	 */
    public static stringToNumberArray(targetStr: string): number[] {
        if (targetStr == '') return [];
        if (targetStr.indexOf(',') == -1)
            return [Number(targetStr)]
        let attriList = targetStr.split(',');
        let res: number[] = []
        for (let i = 0; i < attriList.length; i++) {
            let type = Number(attriList[i]);
            res.push(type)
        }
        return res;
    }

    /**解析指定格式字符串 返回keyVal
   * 格式："[1,2,3]"
   * 返回数组
   */
    public static stringToNumberArray2(targetStr: string): number[] {
        if (targetStr == '') return [];
        targetStr = targetStr.replace("[", "").replace("]", "")
        if (targetStr == '') return [];
        if (targetStr.indexOf(',') == -1)
            return [Number(targetStr)]
        let attriList = targetStr.split(',');
        let res: number[] = []
        for (let i = 0; i < attriList.length; i++) {
            let type = Number(attriList[i]);
            res.push(type)
        }
        return res;
    }

}