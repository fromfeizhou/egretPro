import Tween = egret.Tween;
module com_main {
    export class CScroller extends eui.Scroller {

        public up_btn:eui.Image;
        public up_btn2:eui.Image;
        public down_btn:eui.Image;
        public down_btn2:eui.Image;
        public emptyContent:eui.Group;
        public m_ContentTip:com_main.CLabel;
        public bBottom =false;
        private m_obj = null;
        private m_func = null;
        private _arrowAlign:number = 1;
        get arrowAlign():number {
            return this._arrowAlign;
        }

        /**
         * 箭头对齐方式
         * 0-突出模式 1-内嵌模式
         */
        set arrowAlign(value:number) {
            this._arrowAlign = value;
            this.invalidateProperties();
        }


        protected _enabedArrow:boolean = true;

        constructor() {
            super();
            this.skinName = "resource/skins/components/CScroller.exml";
        }
        ///---让列表滚动到底，用tween方式
        public setObjFuc(obj:any,fuc:any):void {
            this.m_obj = obj;
            this.m_func = fuc;
        }
        ///---让列表滚动到底，用tween方式
        public scrollTween(list:eui.List):void {
            egret.Tween.get(list).to({scrollV: 0, ease: egret.Ease.quadOut}, 1000);
        }

        /**
         * 滚动到item index
         * @param list
         * @param index
         * @param tween
         * @param tweenTime
         */
        public scrollTo(list:eui.Group, index:number, tween:boolean = false, tweenTime:number = 200) {
            list.validateNow();

            if (index < 0 || index >= list.numElements) {
                return;
            }

            var pos = 0;
            var element = list.getElementAt(index);
            var itemHeight = 0;
            if (element == null) {
                itemHeight = (list.contentHeight / list.numElements);
                pos = index * itemHeight;
            } else {
                pos = element.y;
            }


            pos -= (this.height - itemHeight) * 0.5;
            if (pos + this.height > list.contentHeight) {
                pos = list.contentHeight - this.height;
            }

            if (pos < 0) {
                pos = 0;
            }

            if (tween == true) {
                if (this.tweener != null) {
                    egret.Tween.removeTweens(list);
                }
                this.tweener = egret.Tween.get(list).to({scrollV: pos}, tweenTime);
            } else {
                list.scrollV = pos;
            }
        }

        private tweener:Tween;


        protected commitProperties():void {
            super.commitProperties();

            if (this._enabedArrow == true) {
                if (this._arrowAlign != 0) {
                    if(this.up_btn){
                        this.up_btn.top = 0;
                        this.down_btn.bottom = 0;
                    }
                } else {
                    this.up_btn.top = -12;
                    this.down_btn.bottom = -12;
                }
            }
        }

        protected childrenCreated():void {
            super.childrenCreated();
            this.m_ContentTip.text = GLan("noContent");
            this.scrollPolicyV = eui.ScrollPolicy.AUTO;
            this.bounces = true;

            if (this.verticalScrollBar) {
                this.verticalScrollBar.autoVisibility = false;
                this.verticalScrollBar.visible = true;
            }

            this.scrollPolicyH = eui.ScrollPolicy.OFF;
            eui.Scroller.scrollThreshold = 20;

            if (this._enabedArrow == true) {
                this.enableArrow();
            } else {
                this.disableArrow();
            }

            eui.Binding.bindHandler(this.viewport, ["dataProvider"], this.displayEmptyContent, this);
        }

        public displayEmptyContent( dataProvider: any ){
            if( dataProvider ){
                if( dataProvider.length <=0 ){
                   // this.emptyContent.visible = true;
                }else{
                   // this.emptyContent.visible = false;
                }
            }
        }
        /**
         * 允许显示滚动箭头
         */
        public enableArrow() {
            this._enabedArrow = true;

            if (this.up_btn) {
                if (this.viewport) {
                    Utils.TimerManager.doTimer(100,1,this.updateBtn,this);
                } else {
                    this.up_btn.visible = false;
                    // this.up_btn2.visible = false;
                    this.down_btn.visible = true;
                    // this.down_btn2.visible = false;
                }
                if (this.hasEventListener(eui.UIEvent.CHANGE_END) == false) {
                    this.addEventListener(eui.UIEvent.CHANGE_END, this.onArrowChangeEnd, this);
                    this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.moveScroller, this);
                }
            }
        }

        /*移动的次数*/
        public moveCount: number = 0;
        /*移动事件*/
        private moveScroller(event:egret.TouchEvent) {
            this.moveCount++; 
        }

        /**
         * 禁止显示滚动箭头
         */
        public disableArrow() {
            this._enabedArrow = false;
            if (this.up_btn) {
                this.up_btn.visible = false;
                // this.up_btn2.visible = false;
                this.down_btn.visible = false;
                // this.down_btn2.visible = false;
                this.removeEventListener(eui.UIEvent.CHANGE_END, this.onArrowChangeEnd, this);
                this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.moveScroller, this);
            }
        }

        protected onArrowChangeEnd(event: eui.UIEvent) {
            if (this.viewport.scrollV == 0 ) {
                this.dispatchEvent(new ScrollEvent(ScrollEvent.REACH_START));
            } else if ((this.viewport.scrollV + this.height) >= this.viewport.contentHeight &&  this.moveCount > 0) {
                this.dispatchEvent(new ScrollEvent(ScrollEvent.REACH_END));
            }else{
                this.dispatchEvent(new ScrollEvent(ScrollEvent.REACH_RANGE));
            }
            this.updateBtn();
            this.moveCount = 0;
        }


        public updateBtn() {
            this.validateNow();
            if (this._enabedArrow == false) {
                return;
            }

            if (this.viewport == null) {
                return;
            }

            if(this.up_btn == null){
                return
            }

            if(this.down_btn == null){
                return;
            }

            if (this.viewport.scrollV == 0) {
                this.up_btn.visible = false;
            } else {
                this.up_btn.visible = true;
            }

            if ((this.viewport.scrollV + this.height) >= this.viewport.contentHeight) {
                this.down_btn.visible = false;
                if(this.viewport.scrollV){
                    this.bBottom=true;
                    if(this.m_obj && this.m_func)
                        this.m_func.call(this.m_obj,this.bBottom)
                }
            } else {
                this.down_btn.visible = true;
                
            }
        }
    }
}
