module com_main {
    /**
     *
     * @author
     *
     */
    export class CustomEvent {
        public constructor() {
        }
        public isTapBegin: boolean = false;
        public target: egret.EventDispatcher = null;
        public type: string = "";
        public listener: Function = null;
        public thisObject: egret.DisplayObject = null;
        public argObject: Object = null
        public useCapture: boolean = false;
        public isStopBubble: boolean = false;

        public static create(target: egret.EventDispatcher, type: string, listener: Function,
            thisObject: egret.DisplayObject, argObject?: Object, isStopBubble?: boolean, useCapture?: boolean): CustomEvent {
            var evt: CustomEvent = new CustomEvent();
            evt.target = target;
            evt.type = type;
            evt.listener = listener;
            evt.thisObject = thisObject;
            evt.argObject = argObject;
            evt.isStopBubble = isStopBubble;
            evt.useCapture = useCapture;

            return evt;
        }

        public dispose(): void {
            this.target = null;
            this.listener = null;
            this.thisObject = null;
            this.argObject = null;
        }
    }

    export class EventManager {
        private static _instance: EventManager;
        private m_pEventLists: any = {};
        private m_pNotifies: any = {};

        public static getInstance() {
            if (!EventManager._instance) {
                EventManager._instance = new EventManager();
            }
            return EventManager._instance;
        }

        protected listener(event: egret.Event): void {
            var object: egret.DisplayObject = <egret.DisplayObject>event.currentTarget;

            if (this.m_pEventLists[object.hashCode] && this.m_pEventLists[object.hashCode][event.type]) {
                var ce: CustomEvent = <CustomEvent>this.m_pEventLists[object.hashCode][event.type];
                ce.listener.call(ce.thisObject, event);
                if (event.type === egret.TouchEvent.TOUCH_TAP) {
                    // debug("EventManager--->> listener");
                    // let soundname: string = object["sound_cancel"];
                    let soundname: string = SoundData.bSpecilVoice(object);
                    if (isNull(soundname)) {
                        Sound.playTap();
                    } else {
                        Sound.playName(soundname);
                    }

                    /**新手引导点击 */
                    EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                }
            }
        }

        private pushEventList(object: any, type: string, listener: Function, thisObject: any,
            argObject?: any, isStopBubble?: boolean, useCapture?: boolean): void {

            if (!this.m_pEventLists[object.hashCode]) this.m_pEventLists[object.hashCode] = {};
            this.m_pEventLists[object.hashCode][type] = CustomEvent.create(object, type, listener, thisObject, argObject, isStopBubble, useCapture);

        }

        private addNotify(object: any, type: string, listener: Function, thisObject: any,
            useCapture: boolean = false, priority?: number): void {
            object.addEventListener(type, listener, thisObject, useCapture, priority);

            if (!this.m_pNotifies[object.hashCode]) this.m_pNotifies[object.hashCode] = [];
            this.m_pNotifies[object.hashCode].push(CustomEvent.create(object, type, listener, thisObject, null, useCapture));
        }

        public addEventListener(object: egret.EventDispatcher, type: string, thisObject: any, listener: Function,
            useCapture?: boolean, priority?: number, argObject?: Object): void {
            // object.addEventListener(type,this.listener, this, useCapture, priority);

            this.addNotify(object, type, this.listener, this, useCapture, priority);
            this.pushEventList(object, type, listener, thisObject, argObject, false, useCapture);

            // if(!this.m_pEventLists[object.hashCode]) this.m_pEventLists[object.hashCode] = {};
            // this.m_pEventLists[object.hashCode][type] = CustomEvent.create(object, listener,thisObject,argObject, useCapture);

        }

        private doAnimScale(object: any, cevt: CustomEvent): void {
            var tw = TweenAnim.get(object);
            var scale = cevt.argObject ? cevt.argObject : 1;
            var bigScale = Number(scale) * 1.1;

            tw.to({ scaleX: bigScale, scaleY: bigScale }, TOUCH_SCALE_DEALY).to({ scaleX: scale, scaleY: scale }, TOUCH_SCALE_DEALY)
                .call(function (cevt: CustomEvent) {
                    cevt.isTapBegin = false;
                }, this, [cevt]);
        }

        protected onScaleTouch(event: egret.Event) {
            var object: egret.DisplayObject = <egret.DisplayObject>event.currentTarget;
            var eventList: any = this.m_pEventLists[object.hashCode];
            if (eventList && eventList[event.type]) {
                var cevt: CustomEvent = <CustomEvent>eventList[event.type];
                if (cevt.isStopBubble) {
                    event.stopImmediatePropagation();
                }

                var tapBeginEvent: CustomEvent = <CustomEvent>eventList[egret.TouchEvent.TOUCH_BEGIN];
                switch (event.type) {
                    case egret.TouchEvent.TOUCH_BEGIN:
                        var tw = TweenAnim.get(event.currentTarget);
                        cevt.isTapBegin = true;
                        tw.to(cevt.argObject, TOUCH_SCALE_DEALY);
                        /**添加点击音效 */
                        let soundname: string = SoundData.bSpecilVoice(object);
                        if (isNull(soundname)) {
                            Sound.playTap();
                        } else {
                            Sound.playName(soundname);
                        }

                        break;
                    case egret.TouchEvent.TOUCH_MOVE:
                        var scale = cevt.argObject ? cevt.argObject : 1;
                        if (!cevt || cevt.isTapBegin || !tapBeginEvent.isTapBegin || event.currentTarget.scaleX == scale) return;
                        cevt.isTapBegin = true;
                        this.doAnimScale(event.currentTarget, cevt);
                        tapBeginEvent.isTapBegin = false;
                        break;
                    case egret.TouchEvent.TOUCH_END:
                    case egret.TouchEvent.TOUCH_RELEASE_OUTSIDE:
                    case egret.TouchEvent.TOUCH_CANCEL:
                        var scale = cevt.argObject ? cevt.argObject : 1;
                        if (!cevt || cevt.isTapBegin || !tapBeginEvent.isTapBegin || event.currentTarget.scaleX == scale) return;
                        cevt.isTapBegin = true;
                        this.doAnimScale(event.currentTarget, cevt);
                        tapBeginEvent.isTapBegin = false;
                        if (event.type == egret.TouchEvent.TOUCH_END) {
                            if (cevt.listener && cevt.thisObject) {
                                /**新手引导点击 */
                                EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                                
                                cevt.listener.call(cevt.thisObject, event);
                                //按钮事件屏蔽 具体原因已忘记（世界地图 按钮？新手？滚动容器事件？） 恢复需排查
                                // event.stopImmediatePropagation();
                            }
                        }

                        break;
                }
            }
        }

        public addItemRenderAnim(object: any, scale: number = TOUCH_SCALE_XY): void {
            this.addScaleListener(object, scale, null, null, 1, true);
        }

        public addScaleListener(object: any, scale: number = TOUCH_SCALE_XY, thisObject?: any, listener?: Function, defaultScale?: number, isMoveEvent?: boolean, isStopBubble?: boolean) {
            // object.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onScaleTouch,this);
            // object.addEventListener(egret.TouchEvent.TOUCH_END,this.onScaleTouch,this);
            // if(isMoveEvent)object.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onScaleTouch,this);
            // object.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.onScaleTouch,this);
            this.addNotify(object, egret.TouchEvent.TOUCH_BEGIN, this.onScaleTouch, this);
            this.addNotify(object, egret.TouchEvent.TOUCH_END, this.onScaleTouch, this);
            if (isMoveEvent) this.addNotify(object, egret.TouchEvent.TOUCH_MOVE, this.onScaleTouch, this);
            this.addNotify(object, egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onScaleTouch, this);
            this.addNotify(object, egret.TouchEvent.TOUCH_CANCEL, this.onScaleTouch, this);


            this.pushEventList(object, egret.TouchEvent.TOUCH_BEGIN, listener, thisObject, { scaleX: scale, scaleY: scale }, isStopBubble);
            this.pushEventList(object, egret.TouchEvent.TOUCH_END, listener, thisObject, defaultScale, isStopBubble);
            if (isMoveEvent) this.pushEventList(object, egret.TouchEvent.TOUCH_MOVE, listener, thisObject, defaultScale, isStopBubble);
            this.pushEventList(object, egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, listener, thisObject, defaultScale, isStopBubble);
            this.pushEventList(object, egret.TouchEvent.TOUCH_CANCEL, listener, thisObject, defaultScale, isStopBubble);


            // if(!this.m_pEventLists[object.hashCode]) this.m_pEventLists[object.hashCode] = {};
            // this.m_pEventLists[object.hashCode][egret.TouchEvent.TOUCH_BEGIN] = CustomEvent.create(object, listener,thisObject,{ scaleX: scale,scaleY: scale },isStopBubble);
            // this.m_pEventLists[object.hashCode][egret.TouchEvent.TOUCH_END] = CustomEvent.create(object,listener,thisObject,defaultScale,isStopBubble);
            // if(isMoveEvent)this.m_pEventLists[object.hashCode][egret.TouchEvent.TOUCH_MOVE] = CustomEvent.create(object,listener,thisObject,defaultScale,isStopBubble);
            // this.m_pEventLists[object.hashCode][egret.TouchEvent.TOUCH_RELEASE_OUTSIDE] = CustomEvent.create(object,listener,thisObject,defaultScale,isStopBubble);
        }

        public removeEventListener(object: egret.DisplayObject): void {
            var hashCode = object.hashCode;
            var events: CustomEvent[] = this.m_pNotifies[hashCode];
            var event: CustomEvent;
            var dict: any = this.m_pEventLists[hashCode];
            if (events) {
                for (var i: number = 0; i < events.length; i++) {
                    event = events[i];
                    object.removeEventListener(event.type, event.listener, event.thisObject, event.useCapture);
                    event.dispose();
                    event = null;
                }
                for (var type in dict) {
                    event = dict[type];
                    event.dispose();
                    event = null;
                    delete dict[type];
                }
            }
            this.m_pNotifies[hashCode] = null;
            this.m_pEventLists[hashCode] = null;
            delete this.m_pNotifies[hashCode];
            delete this.m_pEventLists[hashCode];
        }

        public removeEventListeners(thisObject: egret.DisplayObject): void {
            for (var code in this.m_pEventLists) {
                var events: Object = this.m_pEventLists[code];
                if (events) {
                    for (var type in events) {
                        var ce: CustomEvent = <CustomEvent>events[type];
                        if (ce.thisObject && ce.thisObject.hashCode == thisObject.hashCode) {
                            this.removeEventListener(<egret.DisplayObject>ce.target);
                        }
                    }
                }
            }
        }

        public constructor() {
        }

        public static addTouchTapListener(object: egret.EventDispatcher, thisObject: any, listener: Function,
            useCapture?: boolean, priority?: number, argObject?: Object) {
            EventManager.addEventListener(object, egret.TouchEvent.TOUCH_TAP, thisObject, listener, useCapture, priority);
        }

        public static addEventListener(object: egret.EventDispatcher, type: string, thisObject: any, listener: Function,
            useCapture?: boolean, priority?: number, argObject?: Object): void {
            EventManager.getInstance().addEventListener(object, type, thisObject, listener, useCapture, priority);
        }

        public static addTouchUpEventListener(object: egret.DisplayObject, thisObject: any, listener: Function,
            useCapture?: boolean, priority?: number, argObject?: Object) {
            EventManager.addEventListener(object, egret.TouchEvent.TOUCH_TAP, thisObject, listener, useCapture, priority, argObject);
        }

        public static removeEventListener(object: any) {
            EventManager.getInstance().removeEventListener(object);
        }

        public static addTouchScaleListener(object: egret.DisplayObject, thisObject: any, listener: Function,
            useCapture?: boolean, priority?: number, argObject?: Object) {
            if (!object) return;
            EventManager.addScaleListener(object, TOUCH_SCALE_XY, thisObject, listener);
            // EventManager.addEventListener(object, egret.TouchEvent.TOUCH_TAP, thisObject, listener, useCapture, priority);
        }

        public static addTouchScaleStopBubbleListener(object: egret.DisplayObject, thisObject: any, listener: Function,
            useCapture?: boolean, priority?: number, argObject?: Object) {
            EventManager.addScaleStopBubbleListener(object, TOUCH_SCALE_XY, thisObject, listener);
            // EventManager.addEventListener(object, egret.TouchEvent.TOUCH_TAP, thisObject, listener, useCapture, priority);
        }

        public static addScaleListener(object: any, scale: number = TOUCH_SCALE_XY, thisObject?: any, listener?: Function, defaultScale?: number) {
            EventManager.getInstance().addScaleListener(object, scale, thisObject, listener, defaultScale);
        }

        public static addScaleStopBubbleListener(object: any, scale: number = TOUCH_SCALE_XY, thisObject?: any, listener?: Function, defaultScale?: number) {
            EventManager.getInstance().addScaleListener(object, scale, thisObject, listener, defaultScale, false, true);
        }

        public static addItemRenderAnim(object: any, scale: number = TOUCH_SCALE_XY): void {
            EventManager.getInstance().addItemRenderAnim(object, scale);
        }

        public static removeEventListeners(thisObject: egret.DisplayObject): void {
            if (!thisObject) {
                return;
            }
            EventManager.getInstance().removeEventListeners(thisObject);
        }
    }
}
