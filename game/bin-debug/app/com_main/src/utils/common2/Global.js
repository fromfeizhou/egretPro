//   /**
// 	* 游戏公用方法汇总
// 	* by dily
// 	* (c) copyright 2014 - 2035
// 	* All Rights Reserved. 
// 	* 使用方法如：Global.setCookie()
//     */
var Global;
(function (Global) {
    // 	//等待界面，主要用在通讯等待展示
    // 	export var waitPanel:WaitPanel;
    //     //显示等待界面
    //     export function showWaritPanel(): void {
    //         Global.waitPanel = new WaitPanel(1);
    //         GameLayerManager.gameLayer().maskLayer.removeChildren();
    //         GameLayerManager.gameLayer().maskLayer.addChild(Global.waitPanel);
    //     }
    //     //移除界面
    //     export function hideWaritPanel(): void {
    //         if((Global.waitPanel != null) && GameLayerManager.gameLayer().maskLayer.contains(Global.waitPanel)){
    //             GameLayerManager.gameLayer().maskLayer.removeChild(Global.waitPanel);
    //         }
    //     }
    //获取html文本
    function getTextFlow(str) {
        var styleParser = new egret.HtmlTextParser();
        return styleParser.parser(str);
    }
    Global.getTextFlow = getTextFlow;
    function getMessage(str) {
        if (Global.message == null) {
            //初始化template_proto
            // Global.message = dcodeIO.ProtoBuf.loadProto(RES.getRes("template_proto"));
        }
        return Global.message.build(str);
    }
    Global.getMessage = getMessage;
    /**阿拉伯数字转换成汉语数字 */
    function getChineseNum(num) {
        var str = num + "";
        var strs = str.split("");
        var chin = "";
        if (strs.length > 7) {
            chin = getChineseNum(parseInt(strs.splice(7).join(""))) + getUnit(8);
            strs = strs.splice(0, 8);
        }
        else if (strs.length > 3) {
            chin = getChineseNum(parseInt(strs.splice(3).join(""))) + getUnit(4);
            strs = strs.splice(0, 4);
        }
        else {
            for (var i = strs.length - 1; i >= 0; i--) {
                chin = chin + getUnit(strs.length - 1 - i) + getNumber(parseInt(strs[i]));
            }
        }
        return chin;
    }
    Global.getChineseNum = getChineseNum;
    /**位数获取数字单位 */
    function getUnit(index) {
        var str = "";
        if (index > 8) {
            str = getUnit(index - 8) + getUnit(8);
        }
        else if (index > 4 && index != 8) {
            str = getUnit(index - 4) + getUnit(4);
        }
        switch (index) {
            case 0:
                break;
            case 1:
                str = GCode(CLEnum.NUM_SHI);
                break;
            case 2:
                str = GCode(CLEnum.NUM_BAI);
                break;
            case 3:
                str = GCode(CLEnum.NUM_QIAN);
                break;
            case 4:
                str = GCode(CLEnum.NUM_WAN);
                break;
            case 8:
                str = GCode(CLEnum.NUM_YI);
        }
        return str;
    }
    Global.getUnit = getUnit;
    //获取大写数字
    function getNumber(num) {
        switch (num) {
            case 0: {
                return GCode(CLEnum.NUM0);
            }
            case 1: {
                return GCode(CLEnum.NUM1);
            }
            case 2: {
                return GCode(CLEnum.NUM2);
            }
            case 3: {
                return GCode(CLEnum.NUM3);
            }
            case 4: {
                return GCode(CLEnum.NUM4);
            }
            case 5: {
                return GCode(CLEnum.NUM5);
            }
            case 6: {
                return GCode(CLEnum.NUM6);
            }
            case 7: {
                return GCode(CLEnum.NUM7);
            }
            case 8: {
                return GCode(CLEnum.NUM8);
            }
            case 9: {
                return GCode(CLEnum.NUM9);
            }
            default: {
                // TODO: Implemente default case
                debug("default case");
                break;
            }
        }
        return "";
    }
    Global.getNumber = getNumber;
})(Global || (Global = {}));
