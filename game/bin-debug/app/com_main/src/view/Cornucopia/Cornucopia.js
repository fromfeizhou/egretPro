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
    var Cornucopia = /** @class */ (function (_super_1) {
        __extends(Cornucopia, _super_1);
        function Cornucopia() {
            var _this = _super_1.call(this) || this;
            _this.m_show = false;
            _this.m_pRemainTime = 0;
            _this.m_effectType = 0;
            _this.name = Cornucopia.NAME;
            _this.initApp("Cornucopia/CornucopiaSkin.exml");
            return _this;
        }
        Cornucopia.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            egret.Tween.removeTweens(this.m_conEffBox);
            com_main.EventManager.removeEventListeners(this);
            com_main.EventMgr.removeEventByObject(BuildEvent.BUILD_UP_LEVEL, this);
            this.removeBtnEffect();
            Utils.TimerManager.remove(this.updateRemainTime, this);
            this.m_show = false;
            SceneResGroupCfg.clearModelRes([ModuleEnums.CORNUCOPIA_UI]);
        };
        Cornucopia.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.CORN));
            this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]);
            this.m_cornucopiaBtn.setTitleLabel(GCode(CLEnum.CORN_JB));
            this.addBtnEffect();
            this.m_getBtn.setTitleLabel(GCode(CLEnum.TAKE_OUT));
            this.m_show = true;
            com_main.EventManager.addTouchScaleListener(this.m_cornucopiaBtn, this, this.onClickCornucopai);
            this.m_getBtn["sound_queren"] = SoundData.getSureSound();
            com_main.EventManager.addTouchScaleListener(this.m_getBtn, this, this.onClickget);
            com_main.EventMgr.addEvent(BuildEvent.BUILD_UP_LEVEL, this.OnBuildUpLevel, this);
            this.initView();
            /**领取红点监听 */
            RedPointModel.AddInfoListener(this.m_cornucopiaBtn, { x: 232, y: -5 }, [RedEvtType.CORN], 2);
            RedPointModel.AddInfoListener(this.m_getBtn, { x: 115, y: -2, scale: 0.78 }, [RedEvtType.CORN_AWARD], 2);
            this.onGuideCondition();
        };
        /**按钮特效 */
        Cornucopia.prototype.addBtnEffect = function () {
            this.m_effect = new MCDragonBones();
            this.m_effect.initAsync(IETypes.EUI_BtnEffect02);
            this.m_effect.play(IETypes.EUI_BtnEffect02);
            this.m_effect.x = 135;
            this.m_effect.y = 47.5;
            this.m_cornucopiaBtn.addChild(this.m_effect);
        };
        /**按钮特效 */
        Cornucopia.prototype.removeBtnEffect = function () {
            if (this.m_effect) {
                this.m_effect.destroy();
                this.m_effect = null;
            }
        };
        /**建筑升级 */
        Cornucopia.prototype.OnBuildUpLevel = function (id) {
            var info = MainMapModel.getBuildInfo(id);
            if (info && info.type == BuildingType.FUDING) {
                this.initView();
            }
        };
        Cornucopia.prototype.playEffect = function (type) {
            var _this = this;
            if (type === void 0) { type = 0; }
            this.m_effectType = type;
            var boxEff = new MCDragonBones();
            boxEff.initAsync(IETypes.EUI_CornucopiaBox);
            boxEff.play(IETypes.EUI_CornucopiaBox, 1, true);
            this.m_conEffBox.addChild(boxEff);
            var ox = 87.99;
            var oy = 0;
            var tw = egret.Tween.get(this.m_groupAction, null, null, true);
            var shakeInterval = 50;
            var shakeRange = 20;
            for (var i = 0; i < 4; i++) {
                tw.to({ x: ox + shakeRange }, shakeInterval);
                tw.to({ x: ox }, shakeInterval);
                tw.to({ x: ox - shakeRange }, shakeInterval);
            }
            tw.to({ x: ox, y: oy }, shakeInterval);
            tw.call(function () {
                if (_this.m_conEffSliver && _this.m_conEffGold) {
                    if (_this.m_effectType == 0) {
                        var sliverEff = new MCDragonBones();
                        sliverEff.initAsync(IETypes.EUI_CornSilver);
                        sliverEff.play(IETypes.EUI_CornSilver, 1, true);
                        _this.m_conEffSliver.addChild(sliverEff);
                    }
                    else {
                        var goldEff = new MCDragonBones();
                        goldEff.initAsync(IETypes.EUI_CornGold);
                        goldEff.play(IETypes.EUI_CornGold, 1, true);
                        _this.m_conEffGold.addChild(goldEff);
                    }
                }
            }, this);
        };
        Cornucopia.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_TREASURE_WASHBOWL_USE,
                ProtoDef.S2C_TREASURE_WASHBOWL_EXTRAGOLD
            ];
        };
        /**处理协议号事件 */
        Cornucopia.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_TREASURE_WASHBOWL_USE: {
                    this.initView();
                    this.playEffect(0);
                    break;
                }
                case ProtoDef.S2C_TREASURE_WASHBOWL_EXTRAGOLD: {
                    this.playEffect(1);
                    this.refreshGoldView();
                    break;
                }
            }
        };
        Cornucopia.prototype.initView = function () {
            this.refreshGoldView();
            var info = CornucopiaModel.getCornucopiaInfo();
            this.m_coinGroup.visible = false;
            this.m_freeGroup.visible = false;
            var cfg = C.GenerateCoinConfig;
            var maxCost = ConstUtil.getValue(IConstEnum.JACKPOT_ALL_COUNT_LIMIT);
            var data = NormalModel.getFunCountById(IFunCountEnum.TREASURE_WASHBOWL_COUNT);
            if (CornucopiaModel.isMaxGetToday()) {
                //今天聚宝次数已经达到上限
                this.m_freeGroup.visible = false;
                this.m_coinGroup.visible = true;
                this.m_consume.text = "0";
                this.m_SilverValue.text = "0";
                this.m_labLeftBuy.text = "0";
                return;
            }
            var freeCost = ConstUtil.getValue(IConstEnum.CORNUCOPIA_FREE);
            var consumeGold = CornucopiaModel.getCornucopiaCost();
            if (data.buyAmountCount < freeCost) {
                this.m_consume.text = (freeCost - data.buyAmountCount) + "";
                this.m_freeGroup.visible = true;
            }
            else {
                this.m_coinGroup.visible = true;
                this.m_consume.text = "" + consumeGold;
            }
            this.m_SilverValue.text = CornucopiaModel.getCornucopiaSliverbyCount(data.buyAmountCount + 1) + "";
            this.m_labLeftBuy.text = CornucopiaModel.GetLeftBuyNum() + "";
        };
        /**刷新元宝领取显示 */
        Cornucopia.prototype.refreshGoldView = function () {
            Utils.TimerManager.remove(this.updateRemainTime, this);
            this.m_pRemainTime = CornucopiaModel.getGoldRushTime();
            if (this.m_pRemainTime <= 0) {
                this.m_pRemainTime = 0;
                this.m_getBtn.disabled = false;
            }
            else {
                this.m_getBtn.disabled = true;
                Utils.TimerManager.doTimer(1000, 0, this.updateRemainTime, this);
            }
            this.m_addLabel.text = CornucopiaModel.getGoldNum() + "";
            this.m_refreshTime.text = TimerUtils.diffTimeFormat("hh:mm:ss", this.m_pRemainTime);
        };
        Cornucopia.prototype.updateRemainTime = function () {
            if (--this.m_pRemainTime > -1) {
                this.m_refreshTime.text = TimerUtils.diffTimeFormat("hh:mm:ss", this.m_pRemainTime);
            }
            else {
                this.m_refreshTime.text = "00:00:00";
                Utils.TimerManager.remove(this.updateRemainTime, this);
                CornucopiaProxy.C2S_TREASURE_WASHBOWL_INFO();
            }
        };
        //点击聚宝盆
        Cornucopia.prototype.onClickCornucopai = function () {
            if (CornucopiaModel.isMaxGetToday()) {
                EffectUtils.showTips(GCode(CLEnum.CORN_GET_FAL), 1, true);
                return;
            }
            var cost = CornucopiaModel.getCornucopiaCost();
            if (PropModel.isItemEnough(PropEnum.GOLD, cost, 1)) {
                CornucopiaProxy.C2S_TREASURE_WASHBOWL_USE();
            }
        };
        //点击获取
        Cornucopia.prototype.onClickget = function () {
            CornucopiaProxy.C2S_TREASURE_WASHBOWL_EXTRAGOLD();
        };
        //关闭页面
        Cornucopia.prototype.onClickBack = function () {
            com_main.UpManager.history();
        };
        Cornucopia.getClass = function () {
            var obj = SceneManager.getClass(LayerEnums.POPUP, Cornucopia.NAME);
            return obj;
        };
        /**检查新手引导面板条件 */
        Cornucopia.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.CORNUCOPIA_WND);
        };
        Cornucopia.NAME = 'Cornucopia';
        return Cornucopia;
    }(com_main.CView));
    com_main.Cornucopia = Cornucopia;
})(com_main || (com_main = {}));
