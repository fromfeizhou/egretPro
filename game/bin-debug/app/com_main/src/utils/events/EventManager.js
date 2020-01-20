var com_main;
(function (com_main) {
    /**
     *
     * @author
     *
     */
    var CustomEvent = /** @class */ (function () {
        function CustomEvent() {
            this.isTapBegin = false;
            this.target = null;
            this.type = "";
            this.listener = null;
            this.thisObject = null;
            this.argObject = null;
            this.useCapture = false;
            this.isStopBubble = false;
        }
        CustomEvent.create = function (target, type, listener, thisObject, argObject, isStopBubble, useCapture) {
            var evt = new CustomEvent();
            evt.target = target;
            evt.type = type;
            evt.listener = listener;
            evt.thisObject = thisObject;
            evt.argObject = argObject;
            evt.isStopBubble = isStopBubble;
            evt.useCapture = useCapture;
            return evt;
        };
        CustomEvent.prototype.dispose = function () {
            this.target = null;
            this.listener = null;
            this.thisObject = null;
            this.argObject = null;
        };
        return CustomEvent;
    }());
    com_main.CustomEvent = CustomEvent;
    var EventManager = /** @class */ (function () {
        function EventManager() {
            this.m_pEventLists = {};
            this.m_pNotifies = {};
        }
        EventManager.getInstance = function () {
            if (!EventManager._instance) {
                EventManager._instance = new EventManager();
            }
            return EventManager._instance;
        };
        EventManager.prototype.listener = function (event) {
            var object = event.currentTarget;
            if (this.m_pEventLists[object.hashCode] && this.m_pEventLists[object.hashCode][event.type]) {
                var ce = this.m_pEventLists[object.hashCode][event.type];
                ce.listener.call(ce.thisObject, event);
                if (event.type === egret.TouchEvent.TOUCH_TAP) {
                    // debug("EventManager--->> listener");
                    // let soundname: string = object["sound_cancel"];
                    var soundname = SoundData.bSpecilVoice(object);
                    if (isNull(soundname)) {
                        Sound.playTap();
                    }
                    else {
                        Sound.playName(soundname);
                    }
                    /**新手引导点击 */
                    com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                }
            }
        };
        EventManager.prototype.pushEventList = function (object, type, listener, thisObject, argObject, isStopBubble, useCapture) {
            if (!this.m_pEventLists[object.hashCode])
                this.m_pEventLists[object.hashCode] = {};
            this.m_pEventLists[object.hashCode][type] = CustomEvent.create(object, type, listener, thisObject, argObject, isStopBubble, useCapture);
        };
        EventManager.prototype.addNotify = function (object, type, listener, thisObject, useCapture, priority) {
            if (useCapture === void 0) { useCapture = false; }
            object.addEventListener(type, listener, thisObject, useCapture, priority);
            if (!this.m_pNotifies[object.hashCode])
                this.m_pNotifies[object.hashCode] = [];
            this.m_pNotifies[object.hashCode].push(CustomEvent.create(object, type, listener, thisObject, null, useCapture));
        };
        EventManager.prototype.addEventListener = function (object, type, thisObject, listener, useCapture, priority, argObject) {
            // object.addEventListener(type,this.listener, this, useCapture, priority);
            this.addNotify(object, type, this.listener, this, useCapture, priority);
            this.pushEventList(object, type, listener, thisObject, argObject, false, useCapture);
            // if(!this.m_pEventLists[object.hashCode]) this.m_pEventLists[object.hashCode] = {};
            // this.m_pEventLists[object.hashCode][type] = CustomEvent.create(object, listener,thisObject,argObject, useCapture);
        };
        EventManager.prototype.doAnimScale = function (object, cevt) {
            var tw = com_main.TweenAnim.get(object);
            var scale = cevt.argObject ? cevt.argObject : 1;
            var bigScale = Number(scale) * 1.1;
            tw.to({ scaleX: bigScale, scaleY: bigScale }, TOUCH_SCALE_DEALY).to({ scaleX: scale, scaleY: scale }, TOUCH_SCALE_DEALY)
                .call(function (cevt) {
                cevt.isTapBegin = false;
            }, this, [cevt]);
        };
        EventManager.prototype.onScaleTouch = function (event) {
            var object = event.currentTarget;
            var eventList = this.m_pEventLists[object.hashCode];
            if (eventList && eventList[event.type]) {
                var cevt = eventList[event.type];
                if (cevt.isStopBubble) {
                    event.stopImmediatePropagation();
                }
                var tapBeginEvent = eventList[egret.TouchEvent.TOUCH_BEGIN];
                switch (event.type) {
                    case egret.TouchEvent.TOUCH_BEGIN:
                        var tw = com_main.TweenAnim.get(event.currentTarget);
                        cevt.isTapBegin = true;
                        tw.to(cevt.argObject, TOUCH_SCALE_DEALY);
                        /**添加点击音效 */
                        var soundname = SoundData.bSpecilVoice(object);
                        if (isNull(soundname)) {
                            Sound.playTap();
                        }
                        else {
                            Sound.playName(soundname);
                        }
                        break;
                    case egret.TouchEvent.TOUCH_MOVE:
                        var scale = cevt.argObject ? cevt.argObject : 1;
                        if (!cevt || cevt.isTapBegin || !tapBeginEvent.isTapBegin || event.currentTarget.scaleX == scale)
                            return;
                        cevt.isTapBegin = true;
                        this.doAnimScale(event.currentTarget, cevt);
                        tapBeginEvent.isTapBegin = false;
                        break;
                    case egret.TouchEvent.TOUCH_END:
                    case egret.TouchEvent.TOUCH_RELEASE_OUTSIDE:
                    case egret.TouchEvent.TOUCH_CANCEL:
                        var scale = cevt.argObject ? cevt.argObject : 1;
                        if (!cevt || cevt.isTapBegin || !tapBeginEvent.isTapBegin || event.currentTarget.scaleX == scale)
                            return;
                        cevt.isTapBegin = true;
                        this.doAnimScale(event.currentTarget, cevt);
                        tapBeginEvent.isTapBegin = false;
                        if (event.type == egret.TouchEvent.TOUCH_END) {
                            if (cevt.listener && cevt.thisObject) {
                                /**新手引导点击 */
                                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                                cevt.listener.call(cevt.thisObject, event);
                                //按钮事件屏蔽 具体原因已忘记（世界地图 按钮？新手？滚动容器事件？） 恢复需排查
                                // event.stopImmediatePropagation();
                            }
                        }
                        break;
                }
            }
        };
        EventManager.prototype.addItemRenderAnim = function (object, scale) {
            if (scale === void 0) { scale = TOUCH_SCALE_XY; }
            this.addScaleListener(object, scale, null, null, 1, true);
        };
        EventManager.prototype.addScaleListener = function (object, scale, thisObject, listener, defaultScale, isMoveEvent, isStopBubble) {
            if (scale === void 0) { scale = TOUCH_SCALE_XY; }
            // object.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onScaleTouch,this);
            // object.addEventListener(egret.TouchEvent.TOUCH_END,this.onScaleTouch,this);
            // if(isMoveEvent)object.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onScaleTouch,this);
            // object.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.onScaleTouch,this);
            this.addNotify(object, egret.TouchEvent.TOUCH_BEGIN, this.onScaleTouch, this);
            this.addNotify(object, egret.TouchEvent.TOUCH_END, this.onScaleTouch, this);
            if (isMoveEvent)
                this.addNotify(object, egret.TouchEvent.TOUCH_MOVE, this.onScaleTouch, this);
            this.addNotify(object, egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onScaleTouch, this);
            this.addNotify(object, egret.TouchEvent.TOUCH_CANCEL, this.onScaleTouch, this);
            this.pushEventList(object, egret.TouchEvent.TOUCH_BEGIN, listener, thisObject, { scaleX: scale, scaleY: scale }, isStopBubble);
            this.pushEventList(object, egret.TouchEvent.TOUCH_END, listener, thisObject, defaultScale, isStopBubble);
            if (isMoveEvent)
                this.pushEventList(object, egret.TouchEvent.TOUCH_MOVE, listener, thisObject, defaultScale, isStopBubble);
            this.pushEventList(object, egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, listener, thisObject, defaultScale, isStopBubble);
            this.pushEventList(object, egret.TouchEvent.TOUCH_CANCEL, listener, thisObject, defaultScale, isStopBubble);
            // if(!this.m_pEventLists[object.hashCode]) this.m_pEventLists[object.hashCode] = {};
            // this.m_pEventLists[object.hashCode][egret.TouchEvent.TOUCH_BEGIN] = CustomEvent.create(object, listener,thisObject,{ scaleX: scale,scaleY: scale },isStopBubble);
            // this.m_pEventLists[object.hashCode][egret.TouchEvent.TOUCH_END] = CustomEvent.create(object,listener,thisObject,defaultScale,isStopBubble);
            // if(isMoveEvent)this.m_pEventLists[object.hashCode][egret.TouchEvent.TOUCH_MOVE] = CustomEvent.create(object,listener,thisObject,defaultScale,isStopBubble);
            // this.m_pEventLists[object.hashCode][egret.TouchEvent.TOUCH_RELEASE_OUTSIDE] = CustomEvent.create(object,listener,thisObject,defaultScale,isStopBubble);
        };
        EventManager.prototype.removeEventListener = function (object) {
            var hashCode = object.hashCode;
            var events = this.m_pNotifies[hashCode];
            var event;
            var dict = this.m_pEventLists[hashCode];
            if (events) {
                for (var i = 0; i < events.length; i++) {
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
        };
        EventManager.prototype.removeEventListeners = function (thisObject) {
            for (var code in this.m_pEventLists) {
                var events = this.m_pEventLists[code];
                if (events) {
                    for (var type in events) {
                        var ce = events[type];
                        if (ce.thisObject && ce.thisObject.hashCode == thisObject.hashCode) {
                            this.removeEventListener(ce.target);
                        }
                    }
                }
            }
        };
        EventManager.addTouchTapListener = function (object, thisObject, listener, useCapture, priority, argObject) {
            EventManager.addEventListener(object, egret.TouchEvent.TOUCH_TAP, thisObject, listener, useCapture, priority);
        };
        EventManager.addEventListener = function (object, type, thisObject, listener, useCapture, priority, argObject) {
            EventManager.getInstance().addEventListener(object, type, thisObject, listener, useCapture, priority);
        };
        EventManager.addTouchUpEventListener = function (object, thisObject, listener, useCapture, priority, argObject) {
            EventManager.addEventListener(object, egret.TouchEvent.TOUCH_TAP, thisObject, listener, useCapture, priority, argObject);
        };
        EventManager.removeEventListener = function (object) {
            EventManager.getInstance().removeEventListener(object);
        };
        EventManager.addTouchScaleListener = function (object, thisObject, listener, useCapture, priority, argObject) {
            if (!object)
                return;
            EventManager.addScaleListener(object, TOUCH_SCALE_XY, thisObject, listener);
            // EventManager.addEventListener(object, egret.TouchEvent.TOUCH_TAP, thisObject, listener, useCapture, priority);
        };
        EventManager.addTouchScaleStopBubbleListener = function (object, thisObject, listener, useCapture, priority, argObject) {
            EventManager.addScaleStopBubbleListener(object, TOUCH_SCALE_XY, thisObject, listener);
            // EventManager.addEventListener(object, egret.TouchEvent.TOUCH_TAP, thisObject, listener, useCapture, priority);
        };
        EventManager.addScaleListener = function (object, scale, thisObject, listener, defaultScale) {
            if (scale === void 0) { scale = TOUCH_SCALE_XY; }
            EventManager.getInstance().addScaleListener(object, scale, thisObject, listener, defaultScale);
        };
        EventManager.addScaleStopBubbleListener = function (object, scale, thisObject, listener, defaultScale) {
            if (scale === void 0) { scale = TOUCH_SCALE_XY; }
            EventManager.getInstance().addScaleListener(object, scale, thisObject, listener, defaultScale, false, true);
        };
        EventManager.addItemRenderAnim = function (object, scale) {
            if (scale === void 0) { scale = TOUCH_SCALE_XY; }
            EventManager.getInstance().addItemRenderAnim(object, scale);
        };
        EventManager.removeEventListeners = function (thisObject) {
            if (!thisObject) {
                return;
            }
            EventManager.getInstance().removeEventListeners(thisObject);
        };
        return EventManager;
    }());
    com_main.EventManager = EventManager;
})(com_main || (com_main = {}));
