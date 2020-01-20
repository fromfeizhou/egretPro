var NetArgSplitFlag = {
    SplitFirst: "◎",
    SplitSecond: "◆",
    SplitThird: "★",
    ArgConcatFlag: ",",
    SplitTitle: "|"
};

enum MsgRule {
    /**工会邀请 */
    EVT_INVITE = 1,
}


module com_main {
    export class NetArgDecoder {
        public constructor() {
        }

        public static DecodeString(content, split_str: string): any[] {
            if (typeof content !== "string") return content;
            var result: any = [];

            var parm_list = content.split(split_str);

            for (var index in parm_list) {
                result.push(parm_list[index]);
            }
            return result;
        }



        ////////////////////////////////////////////////////////////////////////////-

        // 无需解析直接返回（NetArgSplitType.None）
        public static StrHandler(...arg) {

            var result: any[] = [];

            for (var key in arg) {
                var value = arg[key];
                result.push(String(value));
            }

            // return result.join(NetArgSplitFlag.ArgConcatFlag);
            // return result;
            return result.join(NetArgSplitFlag.ArgConcatFlag);
        }

        public static LangHandler(language_id: number): string {
            return GLan(language_id);
        }
    }
}