
enum FrameAnimNumType {
    num = 0,
    string = 1,
};

module com_main {
    /**
     *
     * @author
     *
     */
    export class FrameAnim extends egret.HashObject {
        public framesToHold: number = 3;
        public frameNumType: number = 0;  //整数补位类型

        public isFrameFinished: boolean = false;
        
        protected m_bIsReverse: boolean = false; //是否倒序

        protected m_pNextFrameIndex: number = 0;
        public m_pFrameIndex: number = 0;
        protected m_pActionName: string = '';
        protected m_pNumFrames: number = 0;

        protected m_pAnimations: any = {};

        protected m_isPlay: boolean = false;

        public constructor(actionName?: string) {
            super();
            this.actionName = actionName;
        }


        public set isPlay(play: boolean) {
            this.m_isPlay = play;
        }

        public get isPlay(): boolean {
            return this.m_isPlay;
        }

        public set numFrames(len: number) {
            this.m_pNumFrames = len;
        }

        public get numFrames(): number {
            return this.m_pNumFrames;
        }

        public get frameIndex(): number {
            return this.m_pFrameIndex;
        }

        public set isReverse(bool) {
            this.m_bIsReverse = bool;
            this.resetFrameIndex();
        }

        public set(key, texture: any): void {
            if (!this.m_pAnimations) {
                return;
            }
            this.m_pAnimations[key] = texture;
            this.numFrames = Utils.objectLenght(this.m_pAnimations);
        }

        public set animations(anim: any) {
            this.m_pAnimations = anim;
            this.numFrames = Utils.objectLenght(anim);
        }

        public get animations() {
            return this.m_pAnimations;
        }

        public set actionName(name: string) {
            this.m_pActionName = name;
            this.m_pFrameIndex = 0;
        }

        public get actionName(): string {
            return this.m_pActionName;
        }

        public findAction(name: string): any {
            var action: Object = {};
            var nameLen = name.length;
            var animation = this.m_pAnimations;
            for (var key in animation) {
                var match: string = key.substr(0, nameLen);
                if (name == match) {
                    action[key] = animation[key];
                }
            }
            return action;
        }

        public resetAction() {
            var action = this.findAction(this.actionName);
            this.numFrames = Utils.objectLenght(action);
        }

        public get nextFrameIndex(): number {
            return this.m_pNextFrameIndex;
        }

        public nextFrame(successIsReset: boolean = true): void {
            ++this.m_pNextFrameIndex;
            if (this.m_pNextFrameIndex >= this.framesToHold) {
                this.m_pNextFrameIndex = 0;
                if (this.m_bIsReverse) {
                    --this.m_pFrameIndex;
                    this.isFrameFinished = this.m_pFrameIndex < 0;
                    if (this.isFrameFinished) {
                        if (successIsReset)
                            this.m_pFrameIndex = this.m_pNumFrames - 1;
                        else
                            this.m_pFrameIndex = 0;
                    }
                } else {
                    ++this.m_pFrameIndex;
                    if(this.actionName == "EBarracks_GBYStand")
                        error(this.actionName+" =====  "+ this.m_pFrameIndex);
                    this.isFrameFinished = this.m_pFrameIndex >= this.numFrames;
                    if (this.isFrameFinished) {
                        if (successIsReset)
                            this.m_pFrameIndex = 0;
                        else
                            this.m_pFrameIndex = this.m_pNumFrames - 1;
                    }
                }
            }
        }

        public resetFrameIndex() {
            this.m_pNextFrameIndex = 0;
            if (this.m_bIsReverse) {
                this.m_pFrameIndex = this.m_pNumFrames - 1;
            } else {
                this.m_pFrameIndex = 0;
            }
        }


        public getLastFrame() {
            var last_index = this.m_bIsReverse ? 0 : this.m_pNumFrames - 1;
            var name;
            var suffix = "_png";
            name = this.m_pActionName + '_' + StringUtils.pad(last_index,this.frameNumType);
            return FrameManager.getFrame(this.m_pActionName, name + suffix);
        }

        public getLastFrame2() {
            var last_index = this.m_bIsReverse ? 0 : this.m_pNumFrames - 1;
            var name;
            name = this.m_pActionName + '_' + StringUtils.pad(last_index,this.frameNumType);
            return this.m_pAnimations[name];
        }

        public getFrame(): any {
            var name;
            var suffix = "_png";
            name = this.m_pActionName + '_' + StringUtils.pad(this.m_pFrameIndex,this.frameNumType);
            return FrameManager.getFrame(this.m_pActionName, name + suffix);
        }

        public getFrame2(actionName?: string, frameIndex?: number): any {
            actionName = actionName || this.m_pActionName;
            frameIndex = frameIndex || this.m_pFrameIndex;
            var name;
           name = this.m_pActionName + '_' + StringUtils.pad(frameIndex,this.frameNumType);
            return this.m_pAnimations[name];
        }

        private num2Zero(index): string {
            var str = index < 10 ? "0" + index : "" + index;
            return str;
        }

        public getFrameByName(name: string): any {
            return this.m_pAnimations[name];
        }

        public clear(): void {
            FrameManager.removeFrames(this.m_pActionName);
        }

        public static createAnim(framesToHold: number = 3, actionName?: string, frameNumType: number = 0): FrameAnim {
            var action: FrameAnim = new FrameAnim(actionName);
            action.framesToHold = framesToHold;
            action.frameNumType = frameNumType;
            return action;
        }
    }

    export class SpriteAnimation extends Animate {
        public isRepeat: boolean = false;
        private m_pNumComplete: number;
        private m_pLoaderNum: number;
        public m_pLoaded: boolean = false;
        protected m_pIsStart: boolean = false;
        private m_pFrameAnim: FrameAnim;

        protected m_pThisArg: any = null;
        protected m_pCallback: Function = null;
        protected m_pArgs: any = null;
        private m_pLoaderComplete: Function = null;
        private m_pLoaderCompleteThis: any = null;

        private m_pBitmaps: any = {};
        private m_pBitmaps_len: number = 0;

        private m_pIsDestroy: boolean = false;

        /**是否回调后清除回调引用 */
        private m_autoClearCallback:boolean = true;

        /**播放结束后是否重置回第一帧 */
        private m_pSuccessIsReset: boolean = true;

        //FIX ME
        //临时处理标识
        public tempTag: boolean = false;

        //关键帧
        public keyframe:number = -1;

        public constructor(target: egret.Bitmap, actionName?: string, framesToHold: number = 3, frameNumType: number = 0) {
            super();
            this.isLife = false;

            if (target) {
                this.m_pBitmaps[target.hashCode] = target;
                this.m_pBitmaps_len += 1;
            }

            this.m_pFrameAnim = FrameAnim.createAnim(framesToHold, actionName, frameNumType);
        }


        public addBitmap(bitmap: egret.Bitmap) {
            if (isNull(bitmap)) return;
            if (!this.m_pBitmaps[bitmap.hashCode])
                this.m_pBitmaps_len += 1;
            this.m_pBitmaps[bitmap.hashCode] = bitmap;
            // this.m_pBitmaps_len += 1;
            this.autoRunStop();
        }

        public removeBitmap(bitmap: egret.Bitmap) {
            if (isNull(bitmap)) return;
            if (this.m_pBitmaps[bitmap.hashCode]) {
                delete this.m_pBitmaps[bitmap.hashCode];
                this.m_pBitmaps_len -= 1;
                this.autoRunStop();
            }
        }

        /**自动判断是否要运行或者停止 */
        public autoRunStop() {
            let len = this.m_pBitmaps_len;
            if (len > 0 && !this.isLife) {
                this.runAction();
            } else if (len == 0) {
                this.stopAction();
            }
        }

        public set autoClearCallback(isClear:boolean){
            this.m_autoClearCallback = isClear;
        }

        public get anim(): FrameAnim {
            return this.m_pFrameAnim;
        }

        public set isReverse(bool: boolean) {
            this.m_pFrameAnim.isReverse = bool;
        }

        public set framesToHold(framesToHold) {
            this.m_pFrameAnim.framesToHold = framesToHold;
        }

        public set fps(fps) {
            this.framesToHold = Math.ceil((1 / fps) / (1 / 30));
        }

        /**播放结束后是否重置回第一帧 */
        public set successIsReset(successIsReset: boolean) {
            this.m_pSuccessIsReset = successIsReset;
        }


        /**当前播放的帧序列 */
        public get currentFrameIndex(): number {
            return this.m_pFrameAnim.frameIndex;
        }

        public get totalFrames(): number {
            return this.m_pFrameAnim.numFrames;
        }

        public loadFiles(files: any[], callback?: Function, callbackThis?: any, args?: any): void {
            this.m_pNumComplete = 0;
            this.m_pLoaderNum = files.length;
            this.m_pLoaderComplete = callback;
            this.m_pLoaderCompleteThis = callbackThis;

            FrameManager.addType(this.m_pFrameAnim.actionName);

            if (FrameManager.isCheck(this.m_pFrameAnim.actionName)) {
                this.m_pLoaded = true;
                this.m_pFrameAnim.numFrames = FrameManager.numFrames(this.m_pFrameAnim.actionName);
                if (this.m_pIsStart) this.isLife = true;
                if (this.m_pLoaderCompleteThis) {
                    this.m_pLoaderComplete.call(this.m_pLoaderCompleteThis, null, args);
                    // this.m_pFrameAnim.numFrames = FrameManager.numFrames(this.m_pFrameAnim.actionName);
                }
            } else {
                for (var i: number = 0; i < this.m_pLoaderNum; i++) {
                    this.loadFile(files[i], RES.ResourceItem.TYPE_SHEET, args);
                }
            }
        }

        private loadFile(url: string, type?: string, args?: any): void {
            RES.getResByUrl(url, (sheets: egret.SpriteSheet) => {
                if (this.onFileLoadComplete) {
                    this.onFileLoadComplete.call(this, sheets, args);
                }
            }, this, type);
        }


        protected onFileLoadComplete(sheets: egret.SpriteSheet, animation: SpriteAnimation): void {
            if (!this.m_pIsDestroy) {
                var texture: any = sheets._textureMap;
                ++this.m_pNumComplete;
                try {
                    FrameManager.setFrames(this.m_pFrameAnim.actionName, texture, this.m_pNumComplete == this.m_pLoaderNum)
                    if (this.m_pNumComplete == this.m_pLoaderNum) {
                        this.m_pLoaded = true;
                        if (this.m_pIsStart) this.isLife = true;
                        this.m_pFrameAnim.numFrames = FrameManager.numFrames(this.m_pFrameAnim.actionName);
                        if (this.m_pLoaderComplete) {
                            if (this.m_pLoaderCompleteThis) {
                                this.m_pLoaderComplete.call(this.m_pLoaderCompleteThis, sheets, animation);
                            } else {
                                this.m_pLoaderComplete(sheets, animation);
                            }
                        }
                    }
                } catch (e) {
                    error("onFileLoadComplete--->>", e, this.m_pFrameAnim.actionName);
                }
            }

        }

       

        public setCallBack(callback: Function, thisArg: any, args: any = null) {
            this.m_pCallback = callback;
            this.m_pThisArg = thisArg;
            this.m_pArgs = args;
        }

        public runAction(callback?: Function, thisArg?: any, needReset: boolean = true,keyFrame?:number): void {
            if(keyFrame != null || keyFrame != undefined){
				this.keyframe = keyFrame;
			}
            if (callback)
                this.m_pCallback = callback;

            if (thisArg)
                this.m_pThisArg = thisArg;

            this.m_pIsStart = true;
            if (this.m_pLoaded) {
                if (needReset) {
                    this.m_pFrameAnim.isFrameFinished = false;
                    this.m_pFrameAnim.resetFrameIndex();
                }
                this.isLife = true;
            }
        }

        public stopAction() {
            this.isLife = false;
        }

        public startAction(){
            this.isLife = true;
        }

        public removeAction() {
            this.m_pIsDestroy = true;
            this.stopAction();
            this.onDestroy();
            if (this.m_pFrameAnim) {
                this.m_pFrameAnim.clear();
                this.m_pFrameAnim = null;
            }
            this.m_pThisArg = null;
            this.m_pCallback = null;
            this.m_pArgs = null;
            this.m_pLoaderComplete = null;
            this.m_pLoaderCompleteThis = null;

            this.m_pBitmaps = null;
        }

        public onEnterFrame(delta: number): void {
            if (!this.isLife) return;

            if (this.m_pFrameAnim) {
                this.m_pFrameAnim.nextFrame(this.m_pSuccessIsReset);

                //关键帧回调
                if(this.m_pFrameAnim.m_pFrameIndex == this.keyframe){ 
                    this.keyframe = -1;
                    this.m_pCallback.call(this.m_pThisArg, this.m_pArgs);
                }
                
                if (this.m_pFrameAnim.isFrameFinished) {
                    if (!this.isRepeat) {
                        this.stopAction();
                        if (this.m_pCallback) {
                            this.m_pCallback.call(this.m_pThisArg, this.m_pArgs);
                            if(this.m_autoClearCallback){
                                this.m_pCallback = null;
                                this.m_pThisArg = null;
                                this.m_pArgs = null;
                            }
                            return;
                        }
                    }
                }

                let bitmaps = this.m_pBitmaps;

                for (var key in bitmaps) {
                    if (bitmaps.hasOwnProperty(key)) {
                        let bitmap = bitmaps[key];

                        if (this.tempTag)
                            bitmap.texture = this.m_pFrameAnim.getFrame2();
                        else
                            bitmap.texture = this.m_pFrameAnim.getFrame();
                    }
                }
            } /*else {
                error("this.m_pFrameAnim is null");
            }*/
        }
    }
}
