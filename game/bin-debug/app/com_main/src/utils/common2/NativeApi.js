/**
  * 调用原生api方法汇总
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved.
  * 使用方法如：Global.setCookie()
  */
var NativeApi;
(function (NativeApi) {
    //调用麦克风  
    function getMic() {
        //getUserMedia API 大部分手机不支持，所以暂不考虑
    }
    NativeApi.getMic = getMic;
    //调用canvas截屏
    function getScreen() {
    }
    NativeApi.getScreen = getScreen;
    //调用打电话功能
    function callPhone(telNum) {
        window.open("tel:" + telNum, '_self');
    }
    NativeApi.callPhone = callPhone;
    //调用发短信功能
    function sendMessage(telNum) {
        window.open("sms:" + telNum, '_self');
    }
    NativeApi.sendMessage = sendMessage;
    //获取当前地址
    function getCurUrl() {
        return window.location.href;
    }
    NativeApi.getCurUrl = getCurUrl;
    function getHost() {
        return window.location.host;
    }
    NativeApi.getHost = getHost;
    //当前游戏角度
    NativeApi.curAngle = window["orientation"];
})(NativeApi || (NativeApi = {}));
