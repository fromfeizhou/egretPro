var NetArgSplitFlag = {
    SplitFirst: "◎",
    SplitSecond: "◆",
    SplitThird: "★",
    ArgConcatFlag: ",",
    SplitTitle: "|"
};
var MsgRule;
(function (MsgRule) {
    /**工会邀请 */
    MsgRule[MsgRule["EVT_INVITE"] = 1] = "EVT_INVITE";
})(MsgRule || (MsgRule = {}));
var com_main;
(function (com_main) {
    var NetArgDecoder = /** @class */ (function () {
        function NetArgDecoder() {
        }
        NetArgDecoder.DecodeString = function (content, split_str) {
            if (typeof content !== "string")
                return content;
            var result = [];
            var parm_list = content.split(split_str);
            for (var index in parm_list) {
                result.push(parm_list[index]);
            }
            return result;
        };
        ////////////////////////////////////////////////////////////////////////////-
        // 无需解析直接返回（NetArgSplitType.None）
        NetArgDecoder.StrHandler = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i] = arguments[_i];
            }
            var result = [];
            for (var key in arg) {
                var value = arg[key];
                result.push(String(value));
            }
            // return result.join(NetArgSplitFlag.ArgConcatFlag);
            // return result;
            return result.join(NetArgSplitFlag.ArgConcatFlag);
        };
        NetArgDecoder.LangHandler = function (language_id) {
            return GLan(language_id);
        };
        return NetArgDecoder;
    }());
    com_main.NetArgDecoder = NetArgDecoder;
})(com_main || (com_main = {}));
