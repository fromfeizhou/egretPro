// TypeScript file
module com_main {
    export class TestVideo extends CView {
        public constructor() {
            super();
            this.name = 'TestVideo';
            this.video = new egret.Video();
            this.video.x = 0;                       //设置视频坐标x
            this.video.y = 0;                       //设置视频坐标y
            this.video.anchorOffsetX = 320;
            this.video.anchorOffsetY = 160;
            this.video.width = 640;                 //设置视频宽
            this.video.height = 320;                //设置视频高
            this.video.fullscreen = false;          //设置是否全屏（暂不支持移动设备）
            this.video.poster = "resource/assets/images/a_background/border_015.png"; //设置loding图
            this.video.load("resource/video.mp4");
            this.addChild(this.video);              //将视频添加到舞台
            //监听视频加载完成
            this.video.once(egret.Event.COMPLETE, this.onLoad, this);
            //监听视频加载失败
            this.video.once(egret.IOErrorEvent.IO_ERROR, this.onLoadErr, this);
        }
        private video: egret.Video;
        private onLoad(e: egret.Event) {
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
        }
        private onLoadErr(e: egret.Event) {
            console.log("video load error happened");
        }
        public play(e: egret.TouchEvent) {
            this.video.play(0,true);
        }
    }
}