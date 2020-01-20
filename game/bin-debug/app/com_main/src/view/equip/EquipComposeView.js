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
    var EquipComposeView = /** @class */ (function (_super_1) {
        __extends(EquipComposeView, _super_1);
        function EquipComposeView(width, height) {
            var _this = _super_1.call(this) || this;
            _this.name = EquipComposeView.NAME;
            _this.initApp("equip/EquipComposeViewSkin.exml");
            _this.width = width;
            _this.height = height;
            return _this;
        }
        EquipComposeView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_EQUIPMENT_COMPOSE,
            ];
        };
        /**处理协议号事件 */
        EquipComposeView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_EQUIPMENT_COMPOSE: {
                    if (body.errorCode > 0) {
                        EffectUtils.showTips(GCode(CLEnum.EQUIP_HC_SUC), 1);
                        this.setEff();
                        this.m_reward = body.valuesMessageSet.rewardMessage;
                        //延迟打开
                        Utils.TimerManager.doTimer(400, 1, this.showView, this);
                    }
                    break;
                }
            }
        };
        EquipComposeView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        EquipComposeView.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        EquipComposeView.prototype.childrenCreated = function () {
            var _this = this;
            this.m_btnCompose.setTitleLabel(GCode(CLEnum.EQUIP_HC));
            this.m_btnAll.setTitleLabel(GCode(CLEnum.EQUIP_HC_ALL));
            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_listEquip.dataProvider = this.m_pCollection;
            this.m_listEquip.itemRenderer = EquipCompRender;
            this.m_listEquip.useVirtualLayout = true;
            this.m_listEquip.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickEquip, this);
            //自动适配 动态宽度
            egret.callLater(function () {
                if (_this.m_listEquip) {
                    Utils.tileGroupToCenter(_this.m_listEquip, 100);
                }
            }, this);
            var res = [];
            var list = PropModel.getPropItemListByType(PropMainType.EQUIP_SOUL);
            for (var i = 0; i < list.length; i++) {
                var info = list[i];
                var count = PropModel.getPropNum(info.itemId);
                var equipCfg = C.EquipmentS2EConfig[info.itemId];
                var data = { id: info.itemId, sel: false, count: count, max: equipCfg.fragmentCount };
                res.push(data);
            }
            res.sort(function (a, b) {
                var stateA = a.count >= a.max;
                var stateB = b.count >= b.max;
                if (stateA != stateB) {
                    return stateA ? -1 : 1;
                }
                var qualityA = C.ItemConfig[a.id].quality;
                var qualityB = C.ItemConfig[b.id].quality;
                return qualityB - qualityA;
            });
            this.m_pCollection.replaceAll(res);
            this.setSelectedIndex(0, true);
            this.addEvent();
        };
        /**点击回调 */
        EquipComposeView.prototype.onClickEquip = function (e) {
            this.setSelectedIndex(e.itemIndex);
        };
        /**监听事件 */
        EquipComposeView.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.onItemChange, this);
            com_main.EventManager.addTouchScaleListener(this.m_btnCompose, this, this.onBtnCompose);
            com_main.EventManager.addTouchScaleListener(this.m_btnAll, this, this.onBtnAll);
        };
        /**移除事件 */
        EquipComposeView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
        };
        /**合成 */
        EquipComposeView.prototype.onBtnCompose = function () {
            if (this.m_pCollection.source.length == 0) {
                EffectUtils.showTips(GCode(CLEnum.EQUIP_HC_FAL), 1, true);
                return;
            }
            var data = this.m_pCollection.getItemAt(this.m_nCurIndex);
            if (data) {
                var equipCfg = C.EquipmentS2EConfig[data.id];
                if (equipCfg) {
                    if (PropModel.isItemEnough(data.id, equipCfg.fragmentCount, 3)) {
                        EquipProxy.C2S_EQUIPMENT_COMPOSE(data.id);
                    }
                }
            }
        };
        /**一键合成 */
        EquipComposeView.prototype.onBtnAll = function () {
            if (this.m_pCollection.source.length == 0) {
                EffectUtils.showTips(GCode(CLEnum.EQUIP_HC_FAL), 1, true);
                return;
            }
            var comparse = [];
            for (var i = 0; i < this.m_pCollection.source.length; i++) {
                var data = this.m_pCollection.getItemAt(i);
                var equipCfg = C.EquipmentS2EConfig[data.id];
                if (PropModel.getPropNum(data.id) >= equipCfg.fragmentCount) {
                    comparse.push(data.id);
                }
            }
            if (comparse.length == 0) {
                EffectUtils.showTips(GCode(CLEnum.EQUIP_HC_FAL), 1, true);
                return;
            }
            EquipProxy.C2S_EQUIPMENT_COMPOSE(0);
        };
        /**装备碎片更新 */
        EquipComposeView.prototype.onItemChange = function (itemId) {
            var cfg = C.ItemConfig[itemId];
            if (cfg.mainType != PropMainType.EQUIP_SOUL)
                return;
            var num = PropModel.getPropNum(itemId);
            var isdel = num == 0;
            for (var i = 0; i < this.m_pCollection.source.length; i++) {
                var data = this.m_pCollection.getItemAt(i);
                if (data.id == itemId) {
                    if (isdel) {
                        this.m_pCollection.removeItemAt(i);
                        this.setSelectedIndex(0, true);
                    }
                    else {
                        data.count = PropModel.getPropNum(data.id);
                        this.m_pCollection.replaceItemAt(data, i);
                    }
                    return;
                }
            }
            //增加（合成装备 不可能增加 不写）
        };
        /**
         * 设置当前选中
         * @param isConst 强制刷新
         *  */
        EquipComposeView.prototype.setSelectedIndex = function (index, isConst) {
            if (isConst === void 0) { isConst = false; }
            if (!isConst && this.m_nCurIndex == index)
                return;
            this.refrestSelItem(this.m_nCurIndex, false);
            this.m_nCurIndex = index;
            this.refrestSelItem(this.m_nCurIndex, true);
            var data = this.m_pCollection.getItemAt(this.m_nCurIndex);
            //没有装备 不显示信息
            if (!data) {
                this.refreshEquipInfo(0);
            }
            else {
                var equipCfg = C.EquipmentS2EConfig[data.id];
                this.refreshEquipInfo(equipCfg.id);
            }
        };
        /**刷新选中装备 */
        EquipComposeView.prototype.refrestSelItem = function (index, val) {
            var data = this.m_pCollection.getItemAt(index);
            if (data) {
                data.sel = val;
                this.m_pCollection.replaceItemAt(data, index);
            }
        };
        /**刷新装备信息 */
        EquipComposeView.prototype.refreshEquipInfo = function (equipId) {
            this.m_equipInfo.itemId = equipId;
        };
        /**延迟打开合成成功弹通用奖励界面 */
        EquipComposeView.prototype.showView = function () {
            var rewardMessage = [];
            for (var i in this.m_reward) {
                if (this.m_reward[i].count > 0) {
                    rewardMessage.push(this.m_reward[i]);
                }
            }
            Utils.open_view(TASK_UI.GET_REWARD_VIEW, rewardMessage);
            Utils.TimerManager.remove(this.showView, this);
        };
        /**装备合成特效 */
        EquipComposeView.prototype.setEff = function () {
            var effect = NormalMcMgr.createMc(IETypes.EUI_EqUpGradeEff, false);
            effect.playOnceDone(IETypes.EUI_EqUpGradeEff, function () {
                NormalMcMgr.removeMc(effect);
            }, this);
            effect.x = 50;
            effect.y = 50;
            this.m_pEffRoot.addChild(effect);
        };
        EquipComposeView.NAME = 'EquipComposeView';
        return EquipComposeView;
    }(com_main.CView));
    com_main.EquipComposeView = EquipComposeView;
    /**
    * 碎片Item
    * @class TeamHeroItem
    * @extends eui.ItemRenderer
    */
    var EquipCompRender = /** @class */ (function (_super_1) {
        __extends(EquipCompRender, _super_1);
        function EquipCompRender() {
            return _super_1.call(this) || this;
        }
        EquipCompRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        EquipCompRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_equipItem = new com_main.EquipSoulItem();
            this.addChild(this.m_equipItem);
            this.m_imgState = new eui.Image('common_red_flag2_png');
            this.m_imgState.x = 62;
            this.m_imgState.y = -2;
            this.addChild(this.m_imgState);
            this.m_imgState.visible = false;
            this.m_imgSelected = new eui.Image('SelectKuang_png');
            this.m_imgSelected.x = -13;
            this.m_imgSelected.y = -13;
            this.addChild(this.m_imgSelected);
            this.m_imgSelected.visible = false;
        };
        EquipCompRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            this.m_imgSelected.visible = this.m_tData.sel;
            var count = PropModel.getPropNum(this.m_tData.id);
            this.m_equipItem.setItemInfo(this.m_tData.id, this.m_tData.count, this.m_tData.max);
            this.m_imgState.visible = this.m_tData.count >= this.m_tData.max;
        };
        return EquipCompRender;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
