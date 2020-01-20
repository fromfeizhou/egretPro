
module Mini {

    export class BitmapMovie extends eui.Image {
        /**纹理列表 */
        private textureList: Array<egret.Texture> = [];
        /**总帧数 */
        public totalFrame: number;
        /**当前播放帧数 第一帧从1开始 */
        public curFrame: number = 0;
        /**计时器 */
        private timer: egret.Timer;
        /**播放延迟 */
        private _delay: number = 1000 / 8;
        /**循环次数 */
        private loop: number = 0;

        public constructor() {
            super();
        }

        public onDestroy(){
            this.stopTimer();
            this.textureList = null;
        }

        /**
         * 使用整张序列图初始化
         * @srcBm 源图
         * @maxRow 有几行
         * @maxCol 有几列
         * @startPos 从第几张位置开始切(包含该位置)
         * @pieceNum 切多少张
         * @width tile宽度
         * @height tile高度
         */
        public initByBitmap(srcBm: egret.Bitmap, maxRow: number, maxCol: number, startPos: number, pieceNum: number, width: number, height: number) {
            this.textureList = CutImgTool.cutTile(srcBm, maxRow, maxCol, startPos, pieceNum, width, height);
            if (this.textureList && this.textureList.length > 0) {
                this.texture = this.textureList[0];
                this.curFrame = 0;
                this.totalFrame = this.textureList.length;
            }
        }

        /**
         * 播放
         * @loop 循环次数
         */
        public play(loop: number = 0) {
            this.loop = loop;
            this.startTimer();
        }

        /**
         * 停止播放
         */
        public stop() {
            this.stopTimer();
        }

        /**
         * 跳转播放
         * @frame 播放的起始帧
         * @loop 循环次数
         */
        public gotoAndPlay(frame: number, loop: number = 0) {
            if (frame <= this.totalFrame) {
                this.loop = loop;
                this.curFrame = frame;
                this.texture = this.textureList[frame - 1];
                this.startTimer();
            } else {
                console.error("BitmapMovie >> frame超出范围");
            }
        }

        /**
         * 跳转停止
         * @frame 停止的帧
         */
        public gotoAndStop(frame: number) {
            if (frame <= this.totalFrame) {
                this.stopTimer();
                this.curFrame = frame;
                this.texture = this.textureList[frame - 1];
            } else {
                console.error("BitmapMovie >> frame超出范围");
            }
        }

        //启动计时器
        private startTimer() {
            this.timer || (this.timer = new egret.Timer(this.delay));
            this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimerHandler, this);
            this.timer.reset();
            this.timer.start();
        }

        //计时处理
        private onTimerHandler() {
            this.curFrame++;
            if (this.curFrame <= this.totalFrame) {
                this.texture = this.textureList[this.curFrame - 1];
            } else {
                this.loop--;
                this.dispatchEvent(new egret.Event(egret.Event.LOOP_COMPLETE));
                if (this.loop > 0) {
                    this.curFrame = 1;
                    this.texture = this.textureList[this.curFrame - 1];
                } else {
                    this.stopTimer();
                    this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
                }
            }
        }

        //停止计时
        private stopTimer() {
            if (this.timer) {
                this.timer.removeEventListener(egret.TimerEvent.TIMER, this.onTimerHandler, this);
                this.timer.stop();
            }
        }

        //延迟
        public set delay(value: number) {
            this._delay = value;
            if (this.timer) {
                this.timer.delay = value;
            }
        }

        //延迟
        public get delay() {
            return this._delay;
        }
    }

    class CutImgTool {

        /**
         * 切图
         * @srcBm 源图
         * @maxRow 有几行
         * @maxCol 有几列
         * @startPos 从第几张位置开始切(包含该位置)
         * @pieceNum 切多少张
         * @width tile宽度
         * @height tile高度
         * @returns 返回切割的纹理列表
         */
        public static cutTile(srcBm: egret.Bitmap, maxRow: number, maxCol: number, startPos: number, pieceNum: number, width: number, height: number) {
            var rect: egret.Rectangle = new egret.Rectangle();  //切割矩形区域
            var cutCount: number = 0;                           //当前已切割多少块
            var textureList = [];                              //保存切割的纹理
            for (var i = 0; i < maxRow; i++) {
                for (var j = 0; j < maxCol; j++) {
                    //>=起始位置，并且<=切割数量
                    if ((i * maxCol + j >= startPos) && cutCount <= pieceNum) {
                        var renderTexture: egret.RenderTexture = new egret.RenderTexture();
                        rect.x = j * width;
                        rect.y = i * height;
                        rect.width = width;
                        rect.height = height;
                        if (renderTexture.drawToTexture(srcBm, rect) == false) {
                            console.error("CutImgTool >> cut error");
                            return null;
                        } else {
                            textureList.push(renderTexture);
                            cutCount++;
                        }
                    } else {
                        return textureList;
                    }
                }
            }
            return textureList;
        }
    }
}