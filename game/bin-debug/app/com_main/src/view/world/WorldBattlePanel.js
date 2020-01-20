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
var com_main;
(function (com_main) {
    /**
     * 战斗面板
     * @export
     * @class WorldBattlePanel
     * @extends CView
     */
    var WorldBattlePanel = /** @class */ (function (_super_1) {
        __extends(WorldBattlePanel, _super_1);
        function WorldBattlePanel(data) {
            var _this = _super_1.call(this) || this;
            _this.m_aData = [];
            _this.m_nIndex = 1;
            _this.m_nDt = 0;
            _this.m_nType = 0;
            _this.m_nIid = 0;
            _this.m_aMark = [];
            _this.name = WorldBattlePanel.NAME;
            _this.m_nIid = data.id;
            _this.m_nType = data.ty;
            _this.initApp("world/world_battle_panel.exml");
            return _this;
        }
        WorldBattlePanel.prototype.listenerProtoNotifications = function () {
            return [
            // ProtoDef.WORLD_ATTACK_EVENT_LIST,
            ];
        };
        WorldBattlePanel.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                // case ProtoDef.WORLD_ATTACK_EVENT_LIST: {
                //     let events = WorldModel.getAttackEvent(body.city_event, body.res_event);
                //     this.updateEvent(events);
                //     break;
                // }
            }
        };
        WorldBattlePanel.prototype.onDestroy = function () {
            this.m_aMark = [];
            this.m_aData = [];
            Utils.TimerManager.remove(this.update, this);
            _super_1.prototype.onDestroy.call(this);
        };
        WorldBattlePanel.prototype.childrenCreated = function () {
            var _this = this;
            _super_1.prototype.childrenCreated.call(this);
            if (this.m_nIid <= 0)
                this.m_aData = WorldModel.getAllAttackEvent();
            else
                this.m_aData = WorldModel.checkAttackEvent(this.m_nIid, this.m_nType);
            this.m_pLbNum.text = "(" + this.m_nIndex + "/" + this.m_aData.length + ")";
            this._set_mark();
            com_main.EventManager.addTouchScaleListener(this.m_pBtnClose, this, function () {
                com_main.UpManager.history();
            });
            com_main.EventManager.addTouchScaleListener(this.m_pBtnGo, this, function () {
                var event = _this.m_aData[_this.m_nIndex - 1];
                if (!event)
                    return;
                WorldProxy.send_WORLD_GET_BATTLE_ID(event.id);
            });
            com_main.EventManager.addTouchTapListener(this.m_pBtnLeft, this, function () {
                if (_this.m_nIndex == 1)
                    return;
                var event = _this.m_aData[_this.m_nIndex - 2];
                _this._set_info(event);
                _this.m_nIndex -= 1;
                _this.m_pBtnRight.visible = true;
                if (_this.m_nIndex == 1)
                    _this.m_pBtnLeft.visible = false;
                _this.m_pLbNum.text = "(" + _this.m_nIndex + "/" + _this.m_aData.length + ")";
                _this._set_mark();
            });
            com_main.EventManager.addTouchTapListener(this.m_pBtnRight, this, function () {
                if (_this.m_nIndex >= _this.m_aData.length)
                    return;
                var event = _this.m_aData[_this.m_nIndex];
                _this._set_info(event);
                _this.m_nIndex += 1;
                _this.m_pBtnLeft.visible = true;
                if (_this.m_nIndex == _this.m_aData.length)
                    _this.m_pBtnRight.visible = false;
                _this.m_pLbNum.text = "(" + _this.m_nIndex + "/" + _this.m_aData.length + ")";
                _this._set_mark();
            });
            this._set_info(this.m_aData[0]);
        };
        WorldBattlePanel.prototype.updateEvent = function (events) {
            for (var _i = 0, _a = events.sort(WorldModel.compareAttackEvent); _i < _a.length; _i++) {
                var event_1 = _a[_i];
                if (this.m_nIid <= 0)
                    this.m_aData.push(event_1);
                else if (event_1.pos == this.m_nIid)
                    this.m_aData.push(event_1);
            }
            this.m_pLbNum.text = "(" + this.m_nIndex + "/" + this.m_aData.length + ")";
            this._set_mark();
        };
        /**
         * 设置标志
         * @protected
         * @return void
         * @memberof WorldBattlePanel
         */
        WorldBattlePanel.prototype._set_mark = function () {
            var l1 = this.m_aData.length, l2 = this.m_aMark.length;
            if (l1 > l2) {
                for (var i = 0; i < (l1 - l2); i++) {
                    var spr = new egret.Bitmap();
                    spr.texture = RES.getRes("border_1017_png");
                    Utils.addChild(this.m_pMain, spr);
                    this.m_aMark.push(spr);
                }
            }
            else if (l1 < l2) {
                var lis = this.m_aMark.splice(0, l2 - l1);
                for (var _i = 0, lis_1 = lis; _i < lis_1.length; _i++) {
                    var item = lis_1[_i];
                    Utils.removeFromParent(item);
                }
            }
            this.__set_mark_position();
        };
        /**
         * 设置标志位置
         * @protected
         * @return void
         * @memberof WorldBattlePanel
         */
        WorldBattlePanel.prototype.__set_mark_position = function () {
            var w = 283, h = 335;
            var i = 0, l = this.m_aMark.length;
            for (var _i = 0, _a = this.m_aMark; _i < _a.length; _i++) {
                var item = _a[_i];
                var x = w - (l / 2 - i) * (item.width + 10), scale = 0.7, alpha = 0.55, h_1 = 333;
                if (i == this.m_nIndex - 1) {
                    scale = 1;
                    alpha = 1;
                    h_1 = 330;
                }
                else if (i == this.m_nIndex - 2 || i == this.m_nIndex) {
                    scale = 0.85;
                    alpha = 0.65;
                    h_1 = 331.5;
                }
                NodeUtils.setPosAndScale(item, x, h_1, scale);
                item.alpha = alpha;
                i++;
            }
        };
        /**
         * 更新事件信息
         * @protected
         * @param  {ItfAttackEvent} event
         * @return
         * @memberof WorldBattlePanel
         */
        WorldBattlePanel.prototype._set_info = function (event) {
            if (!event)
                return;
            // let now = TimerUtils.getServerTime();
            // let gid = event.gid[0], name = GeneralModel.getGeneralName(gid), resName='';
            // if (event.type == 1) {
            //     let conf = C.WorldMapConfig[event.pos];
            //     resName = GLan(conf.name);
            // } else {
            //     let conf = WorldModel.getResEvent(event.pos);
            //     if (conf) {
            //         let resConf = C.AffairsConfig[conf.id];
            //         resName = resConf ? GLan(resConf.name).replace(/[\d]/g, '') : '';
            //     }
            // }
            // Utils.TimerManager.remove(this.update, this);
            // if (now < event.dt) {
            //     this.m_pBtnGo.visible = true;
            //     this.m_pLbTitle.text = `你的武将【${name}】对【${resName}】发起了进攻！`;
            //     this.m_pLbTit.visible = true;
            //     this.m_pLbTime.visible = true;
            //     this.m_pImgTime.visible = true;
            //     this.m_nDt = event.dt - now;
            //     this.m_pLbTime.text = `${this.m_nDt}s`;
            //     Utils.TimerManager.doTimer(1000, this.m_nDt + 1, this.update, this, () => {
            //         Utils.TimerManager.remove(this.update, this);
            //         this.m_pLbTime.visible = false;
            //         this.m_pImgTime.visible = false;
            //         this._set_info(this.m_aData[this.m_nIndex - 1]);
            //     });
            // } else {
            //     this.m_nDt = 0;
            //     this.m_pBtnGo.visible = false;
            //     this.m_pLbTitle.text = `你的武将【${name}】正在进攻【${resName}】！`;
            //     this.m_pLbTit.visible = false;
            //     this.m_pLbTime.visible = false;
            //     this.m_pImgTime.visible = false;
            // }
        };
        WorldBattlePanel.prototype.update = function () {
            --this.m_nDt;
            if (this.m_nDt < 0) {
                Utils.TimerManager.remove(this.update, this);
                this.m_pLbTime.visible = false;
                this.m_pImgTime.visible = false;
                this._set_info(this.m_aData[this.m_nIndex - 1]);
                return;
            }
            this.m_pLbTime.text = this.m_nDt + "s";
        };
        WorldBattlePanel.NAME = "WorldBattlePanel";
        return WorldBattlePanel;
    }(com_main.CView));
    com_main.WorldBattlePanel = WorldBattlePanel;
})(com_main || (com_main = {}));
