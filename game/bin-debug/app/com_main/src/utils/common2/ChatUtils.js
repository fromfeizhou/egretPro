var com_main;
(function (com_main) {
    var ChatUtils = /** @class */ (function () {
        function ChatUtils() {
        }
        /**按照一定规则格式化表情字符 */
        ChatUtils.ConvertFaceStr = function (handle_str) {
            if (!handle_str)
                return '';
            var sub_str;
            var firstIdx = 0; //文本段开始位置
            var length = handle_str.length;
            var result_table = [];
            while (firstIdx < length) {
                var starIdx = handle_str.indexOf("#", firstIdx);
                if (starIdx < 0) {
                    result_table.push(handle_str.substring(firstIdx));
                    firstIdx = length;
                }
                else {
                    sub_str = handle_str.substring(firstIdx, starIdx);
                    if (sub_str.length)
                        result_table.push(sub_str);
                    sub_str = handle_str.substring(starIdx + 1, starIdx + 3);
                    var face_id = Number(sub_str);
                    //todo
                    if (sub_str.length && face_id && face_id > 0 && face_id < 13) {
                        result_table.push(StringUtils.stringFormat("[img]FChat_%s_png[/img]", sub_str));
                    }
                    else {
                        result_table.push("#" + sub_str);
                    }
                    firstIdx = starIdx + 3;
                }
            }
            return result_table.join("");
        };
        ChatUtils.HandleItemClick = function (handle_str) {
            var param_list = com_main.NetArgDecoder.DecodeString(handle_str, NetArgSplitFlag.ArgConcatFlag);
            var type = Number(param_list[0]);
            switch (type) {
                case MsgRule.EVT_INVITE: {
                    var legionId_1 = Number(param_list[1]);
                    if (legionId_1 && legionId_1 > 0) {
                        if (FunctionModel.isFunctionOpenWithWarn(FunctionType.GUILD)) {
                            if (LegionModel.getGuildId() > 0) {
                                EffectUtils.showTips(GCode(CLEnum.GUILD_ENTER_ALR));
                            }
                            else {
                                Utils.showConfirmPop(GCodeFromat(CLEnum.GUILD_JION_YN, param_list[2]), function () {
                                    LegionProxy.send_APPLY_JOIN_GUILD(legionId_1);
                                }, this);
                            }
                        }
                    }
                    break;
                }
            }
        };
        ChatUtils.fontSpaceSize = FontSpaceSize.MOBILE;
        return ChatUtils;
    }());
    com_main.ChatUtils = ChatUtils;
})(com_main || (com_main = {}));
