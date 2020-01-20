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
// TypeScript file
var com_main;
(function (com_main) {
    var TestVideo = /** @class */ (function (_super_1) {
        __extends(TestVideo, _super_1);
        function TestVideo() {
            var _this = _super_1.call(this) || this;
            _this.name = 'TestVideo';
            _this.video = new egret.Video();
            _this.video.x = 0; //设置视频坐标x
            _this.video.y = 0; //设置视频坐标y
            _this.video.anchorOffsetX = 320;
            _this.video.anchorOffsetY = 160;
            _this.video.width = 640; //设置视频宽
            _this.video.height = 320; //设置视频高
            _this.video.fullscreen = false; //设置是否全屏（暂不支持移动设备）
            _this.video.poster = "resource/assets/images/a_background/border_015.png"; //设置loding图
            _this.video.load("resource/video.mp4");
            _this.addChild(_this.video); //将视频添加到舞台
            //监听视频加载完成
            _this.video.once(egret.Event.COMPLETE, _this.onLoad, _this);
            //监听视频加载失败
            _this.video.once(egret.IOErrorEvent.IO_ERROR, _this.onLoadErr, _this);
            return _this;
        }
        TestVideo.prototype.onLoad = function (e) {
            // var btnPlay: eui.Label = new eui.Label(); //新建播放按钮
            // btnPlay.text = "播放";
            // btnPlay.x = 0;
            // btnPlay.y = 0;
            // this.addChild(btnPlay);
            //监听按钮行为，当按下时调用播放函数。
            this.video.touchEnabled = true;
            this.video.addEventListener(egret.TouchEvent.TOUCH_TAP, this.play, this);
            //获取视频长度
            console.log(this.video.length);
        };
        TestVideo.prototype.onLoadErr = function (e) {
            console.log("video load error happened");
        };
        TestVideo.prototype.play = function (e) {
            this.video.play(0, true);
        };
        return TestVideo;
    }(com_main.CView));
    com_main.TestVideo = TestVideo;
})(com_main || (com_main = {}));
