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
    var EquipDeComposeView = /** @class */ (function (_super_1) {
        __extends(EquipDeComposeView, _super_1);
        function EquipDeComposeView(width, height) {
            var _this = _super_1.call(this) || this;
            _this.name = EquipDeComposeView.NAME;
            _this.initApp("equip/EquipDeComposeViewSkin.exml");
            _this.width = width;
            _this.height = height;
            return _this;
        }
        EquipDeComposeView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_EQUIPMENT_ADD,
                ProtoDef.S2C_EQUIPMENT_DEL
            ];
        };
        /**处理协议号事件 */
        EquipDeComposeView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_EQUIPMENT_ADD: {
                    var data = body;
                    for (var i = 0; i < data.equipments.length; i++) {
                        var vo = EquipModel.getEquipVoByUId(data.equipments[i].uuid);
                        var rdData = { uid: vo.uuid, sel: false, multi: vo.itemCfg.level <= 50, mulstate: this.m_nState == 1 };
                        this.m_pCollection.addItem(rdData);
                        if (this.m_pCollection.source.length == 1) {
                            this.setSelectedIndex(0, true);
                        }
                        this.refreshMultiList();
                    }
                    break;
                }
                case ProtoDef.S2C_EQUIPMENT_DEL: {
                    var data = body;
                    this.delItemByUids(data.equipmentUuid);
                    break;
                }
            }
        };
        EquipDeComposeView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        EquipDeComposeView.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        EquipDeComposeView.prototype.childrenCreated = function () {
            var _this = this;
            this.m_btnDeCompose.setTitleLabel(GCode(CLEnum.RECOVER));
            this.m_btnAll.setTitleLabel(GCode(CLEnum.RECOVER_MUL));
            this.m_btnAllSure.setTitleLabel(GCode(CLEnum.GEN_DECOMOSE_SUR));
            this.m_btnCancle.setTitleLabel(GCode(CLEnum.CANCEL));
            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_listEquip.dataProvider = this.m_pCollection;
            this.m_listEquip.itemRenderer = EquipDeCompRender;
            this.m_listEquip.useVirtualLayout = true;
            this.m_listEquip.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickEquip, this);
            //自动适配 动态宽度
            egret.callLater(function () {
                if (_this.m_listEquip) {
                    Utils.tileGroupToCenter(_this.m_listEquip, 100);
                }
            }, this);
            this.setCurState(0, true);
            // this.initState();
            this.m_pAwardColl = new eui.ArrayCollection([]);
            this.m_listAward.dataProvider = this.m_pAwardColl;
            this.m_listAward.itemRenderer = DeCompRender;
            this.m_listEquip.useVirtualLayout = true;
            this.setSelectedIndex(0, true);
            this.validateNow();
            this.addEvent();
        };
        /**删除组件 */
        EquipDeComposeView.prototype.delItemByUids = function (uuids) {
            var isDel = false;
            for (var i = this.m_pCollection.source.length - 1; i >= 0; i--) {
                var data = this.m_pCollection.getItemAt(i);
                for (var k = 0; k < uuids.length; k++) {
                    if (data.uid == (uuids[k])) {
                        isDel = true;
                        this.m_pCollection.removeItemAt(i);
                    }
                }
            }
            if (!isDel)
                return;
            this.setSelectedIndex(0, true);
            this.refreshMultiList();
        };
        /**点击回调 */
        EquipDeComposeView.prototype.onClickEquip = function (e) {
            if (this.m_nState == 0) {
                this.setSelectedIndex(e.itemIndex);
            }
            else {
                this.setMultiIndex(e.itemIndex);
            }
        };
        /**监听事件 */
        EquipDeComposeView.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnDeCompose, this, this.onBtnDeCompose);
            com_main.EventManager.addTouchScaleListener(this.m_btnAll, this, this.onBtnAll);
            com_main.EventManager.addTouchScaleListener(this.m_btnAllSure, this, this.onBtnAllSure);
            com_main.EventManager.addTouchScaleListener(this.m_btnCancle, this, this.onBtnCancel);
            com_main.EventMgr.addEvent(EquipEvent.EQUIP_DECOMPOSE_ADD, this.onEquipDecomposeAdd, this);
            com_main.EventMgr.addEvent(EquipEvent.EQUIP_DECOMPOSE_DEL, this.onEquipDecomposeDel, this);
            com_main.EventMgr.addEvent(EquipEvent.EQUIP_DECOMPOSE_ALL_TICK, this.onSetRecycle, this);
            com_main.EventMgr.addEvent(EquipEvent.EQUIP_DECOMPOSE_ONE_TICK, this.onEquipOneRecycle, this);
        };
        /**移除事件 */
        EquipDeComposeView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(EquipEvent.EQUIP_DECOMPOSE_ADD, this);
            com_main.EventMgr.removeEventByObject(EquipEvent.EQUIP_DECOMPOSE_DEL, this);
            com_main.EventMgr.removeEventByObject(EquipEvent.EQUIP_DECOMPOSE_ALL_TICK, this);
            com_main.EventMgr.removeEventByObject(EquipEvent.EQUIP_DECOMPOSE_ONE_TICK, this);
        };
        /**添加装备 */
        EquipDeComposeView.prototype.onEquipDecomposeAdd = function (vo) {
            var rdData = { uid: vo.uuid, sel: false, multi: vo.itemCfg.level <= 50, mulstate: this.m_nState == 1 };
            this.m_pCollection.addItem(rdData);
            if (this.m_pCollection.source.length == 1) {
                this.setSelectedIndex(0, true);
            }
            this.refreshMultiList();
        };
        /**移除装备 */
        EquipDeComposeView.prototype.onEquipDecomposeDel = function (uuid) {
            this.delItemByUids([uuid]);
        };
        /**分解 */
        EquipDeComposeView.prototype.onBtnDeCompose = function () {
            if (this.m_pCollection.source.length == 0) {
                EffectUtils.showTips(GCode(CLEnum.EQUIP_ZB_SH_FAL), 1, true);
                return;
            }
            var data = this.m_pCollection.getItemAt(this.m_nCurIndex);
            if (!data)
                return;
            var vo = EquipModel.getEquipVoByUId(data.uid);
            if (vo) {
                EquipModel.m_tItems = vo.getDecomposeItems(); //保存回收可获得物品
                if (vo.quality >= 3) {
                    var view = new com_main.EqDeCompSureWnd(GCode(CLEnum.EQUIP_ZB_SH_TIPS), vo.getDecomposeItems(), function () {
                        //发送回收协议
                        EquipProxy.C2S_EQUIPMENT_DECOMPOSE([vo.uuid]);
                    }, this);
                    com_main.UpManager.popSmallView(view, null, false, 0.8);
                }
                else {
                    EquipProxy.C2S_EQUIPMENT_DECOMPOSE([vo.uuid]);
                }
            }
        };
        /**批量回收 */
        EquipDeComposeView.prototype.onBtnAll = function () {
            this.setCurState(1);
            Utils.open_view(TASK_UI.POP_EQUIP_RECYCLE);
        };
        /**批量回收 确认 */
        EquipDeComposeView.prototype.onBtnAllSure = function () {
            var res = [];
            var arr = [];
            var isTips = false;
            for (var i = 0; i < this.m_pCollection.source.length; i++) {
                var data = this.m_pCollection.getItemAt(i);
                if (data.multi) {
                    var vo = EquipModel.getEquipVoByUId(data.uid);
                    if (!vo)
                        continue;
                    if (vo.quality >= 3)
                        isTips = true;
                    res.push(data.uid);
                    arr.push(vo.getDecomposeItems());
                }
            }
            if (res.length == 0) {
                EffectUtils.showTips(GCode(CLEnum.EQUIP_ZB_SH_FAL), 1, true);
                return;
            }
            EquipModel.m_tItems = this.ongetCount(arr);
            if (isTips) {
                Utils.showConfirmPop(GCode(CLEnum.EQUIP_ZB_SH_TIPS1), function () {
                    EquipProxy.C2S_EQUIPMENT_DECOMPOSE(res);
                }, this);
            }
            else {
                EquipProxy.C2S_EQUIPMENT_DECOMPOSE(res);
            }
        };
        /**批量回收处理 */
        EquipDeComposeView.prototype.ongetCount = function (arr) {
            var tempArray = arr.slice(0); //复制数组到临时数组
            var itemArr = [];
            var num = 0;
            for (var i = 0; i < tempArray.length; i++) {
                itemArr.push(tempArray[i][0]);
            }
            return itemArr;
        };
        /**批量回收 取消*/
        EquipDeComposeView.prototype.onBtnCancel = function () {
            this.setCurState(0);
            EquipModel.lvList = [];
        };
        //初始选中档次设置
        EquipDeComposeView.prototype.initState = function () {
            var res = [];
            var list = EquipModel.getCanRemoveEquips();
            for (var i = 0; i < list.length; i++) {
                var vo = list[i];
                var index = EquipModel.lvList.indexOf(vo.itemCfg.level);
                var data = { uid: vo.uuid, sel: this.m_nState == 1, multi: vo.itemCfg.level <= 50, mulstate: this.m_nState == 1 };
                res.push(data);
            }
            this.m_pCollection.replaceAll(res);
        };
        /**
         * 档次设置
         * issur是否确定
         * allState是否全选
         * */
        EquipDeComposeView.prototype.onSetRecycle = function (param) {
            if (!param.isSur) { //没确定默认选中
                this.initState();
                this.refreshMultiList();
                EquipModel.lvList = [];
                return;
            }
            if (param.allState) {
                this.onEquipAllRecycle();
            }
            else {
                this.onEquipOneRecycle();
            }
            this.refreshMultiList();
        };
        //全选
        EquipDeComposeView.prototype.onEquipAllRecycle = function () {
            var res = [];
            var list = EquipModel.getCanRemoveEquips();
            for (var i = 0; i < list.length; i++) {
                var vo = list[i];
                var data = { uid: vo.uuid, sel: false, multi: vo.itemCfg.level <= 100, mulstate: this.m_nState == 1 };
                res.push(data);
            }
            this.m_pCollection.replaceAll(res);
        };
        //点击选中
        EquipDeComposeView.prototype.onEquipOneRecycle = function () {
            var res = [];
            var state;
            var list = EquipModel.getCanRemoveEquips();
            for (var i = 0; i < list.length; i++) {
                var vo = list[i];
                if (EquipModel.lvList.indexOf(vo.itemCfg.level) != -1) {
                    state = true;
                }
                else {
                    state = false;
                }
                var data = { uid: vo.uuid, sel: false, multi: state, mulstate: this.m_nState == 1 };
                res.push(data);
            }
            this.m_pCollection.replaceAll(res);
            this.refreshMultiList();
        };
        /**
         * 设置当前选中
         * @param isConst 强制刷新
         *  */
        EquipDeComposeView.prototype.setSelectedIndex = function (index, isConst) {
            if (isConst === void 0) { isConst = false; }
            if (!isConst && this.m_nCurIndex == index)
                return;
            this.refrestSelItem(this.m_nCurIndex, false);
            this.m_nCurIndex = index;
            this.refrestSelItem(this.m_nCurIndex, true);
            var data = this.m_pCollection.getItemAt(this.m_nCurIndex);
            //没有装备 不显示信息
            if (!data) {
                this.m_equipInfo.itemId = 0;
                return;
            }
            var vo = EquipModel.getEquipVoByUId(data.uid);
            this.m_equipInfo.itemId = vo.equipmentId;
        };
        /**
         * 设置当前选中
         * @param isConst 强制刷新
         *  */
        EquipDeComposeView.prototype.setMultiIndex = function (index) {
            var data = this.m_pCollection.getItemAt(index);
            data.multi = !data.multi;
            this.m_pCollection.replaceItemAt(data, index);
            this.refreshMultiList();
        };
        /**刷新选中装备 */
        EquipDeComposeView.prototype.refrestSelItem = function (index, val) {
            var data = this.m_pCollection.getItemAt(index);
            if (data) {
                data.sel = val;
                this.m_pCollection.replaceItemAt(data, index);
            }
        };
        /**
        * 设置当前选中
        * @param isConst 强制刷新
        *  */
        EquipDeComposeView.prototype.setCurState = function (state, isConst) {
            if (isConst === void 0) { isConst = false; }
            if (!isConst && this.m_nState == state)
                return;
            this.m_nState = state;
            var norVis = state == 0;
            this.m_pNorRoot.visible = norVis;
            this.m_pMultiRoot.visible = !norVis;
            // for (let i = 0; i < this.m_pCollection.source.length; i++) {
            //     let data = this.m_pCollection.getItemAt(i) as IEIEqDeCompRD;
            //     data.mulstate = this.m_nState == 1;
            //     this.m_pCollection.replaceItemAt(data, i);
            // }
            this.initState();
            this.setSelectedIndex(0, true);
            if (!norVis)
                this.refreshMultiList();
        };
        /**刷新批量回收 */
        EquipDeComposeView.prototype.refreshMultiList = function () {
            var res = [];
            for (var i = 0; i < this.m_pCollection.source.length; i++) {
                var data = this.m_pCollection.getItemAt(i);
                if (data.multi) {
                    var vo = EquipModel.getEquipVoByUId(data.uid);
                    if (!vo)
                        continue;
                    var list = vo.getDecomposeItems();
                    for (var k = 0; k < list.length; k++) {
                        res.push({ id: list[k].itemId, count: list[k].count });
                    }
                }
            }
            this.m_pAwardColl.replaceAll(res);
        };
        EquipDeComposeView.NAME = 'EquipDeComposeView';
        return EquipDeComposeView;
    }(com_main.CView));
    com_main.EquipDeComposeView = EquipDeComposeView;
    /**
    * 碎片Item
    * @class TeamHeroItem
    * @extends eui.ItemRenderer
    */
    var EquipDeCompRender = /** @class */ (function (_super_1) {
        __extends(EquipDeCompRender, _super_1);
        function EquipDeCompRender() {
            return _super_1.call(this) || this;
        }
        EquipDeCompRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        EquipDeCompRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_equipItem = new com_main.EquipItem('equip');
            this.addChild(this.m_equipItem);
            this.m_norRoot = new egret.DisplayObjectContainer();
            this.m_multiRoot = new egret.DisplayObjectContainer();
            this.addChild(this.m_norRoot);
            this.addChild(this.m_multiRoot);
            this.m_imgSelected = new eui.Image('SelectKuang_png');
            this.m_imgSelected.x = -13;
            this.m_imgSelected.y = -13;
            this.m_norRoot.addChild(this.m_imgSelected);
            this.m_imgSelected.visible = false;
            this.m_imgMulti = new eui.Image();
            this.m_imgMulti.x = 69.5;
            this.m_imgMulti.y = -16.5;
            this.m_multiRoot.addChild(this.m_imgMulti);
        };
        EquipDeCompRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            this.m_imgSelected.visible = this.m_tData.sel;
            var vo = EquipModel.getEquipVoByUId(this.m_tData.uid);
            if (vo) {
                this.m_equipItem.setItemInfo(vo.equipmentId);
            }
            this.m_imgMulti.source = this.m_tData.multi ? 'common_y_png' : 'btn_031_up_png';
            this.m_norRoot.visible = !this.m_tData.mulstate;
            this.m_multiRoot.visible = this.m_tData.mulstate;
        };
        return EquipDeCompRender;
    }(eui.ItemRenderer));
    /**
    * 碎片Item
    * @class TeamHeroItem
    * @extends eui.ItemRenderer
    */
    var DeCompRender = /** @class */ (function (_super_1) {
        __extends(DeCompRender, _super_1);
        function DeCompRender() {
            var _this = _super_1.call(this) || this;
            _this.width = 100;
            _this.height = 100;
            return _this;
        }
        DeCompRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        DeCompRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_item = com_main.ComItemNew.create('count');
            this.addChild(this.m_item);
        };
        DeCompRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            this.m_item.setItemInfo(this.m_tData.id, this.m_tData.count);
        };
        return DeCompRender;
    }(eui.ItemRenderer));
    com_main.DeCompRender = DeCompRender;
})(com_main || (com_main = {}));
