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
    var MaterialView = /** @class */ (function (_super_1) {
        __extends(MaterialView, _super_1);
        function MaterialView(type, width, height) {
            var _this = _super_1.call(this) || this;
            _this.name = MaterialView.NAME;
            _this.m_nType = type;
            _this.width = width;
            _this.height = height;
            _this.initApp("material/MaterialViewSkin.exml");
            return _this;
        }
        MaterialView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_MATERIAL_BUY,
                ProtoDef.S2C_MATERIAL_INFO,
                ProtoDef.S2C_MATERIAL_CHALLENGE
            ];
        };
        /**处理协议号事件 */
        MaterialView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            debug("Tavern:execute -------->protocol, body:", protocol, body);
            switch (protocol) {
                case ProtoDef.S2C_MATERIAL_BUY:
                case ProtoDef.S2C_MATERIAL_CHALLENGE:
                case ProtoDef.S2C_MATERIAL_INFO: {
                    this.refreshCount();
                    break;
                }
            }
        };
        MaterialView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        MaterialView.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        /**监听事件 */
        MaterialView.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnAdd, this, this.onbtnadd);
            com_main.EventMgr.addEvent(MaterialEvent.MATERIAL_INFO_UPDATE, this.updateInfo, this);
        };
        /**移除事件 */
        MaterialView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(MaterialEvent.MATERIAL_INFO_UPDATE, this);
        };
        MaterialView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        /**初始化 */
        MaterialView.prototype.initView = function () {
            var _this = this;
            if (this.m_bInit)
                return;
            this.m_bInit = true;
            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_listCard.dataProvider = this.m_pCollection;
            this.m_listCard.itemRenderer = MaterialItemRender;
            this.m_listCard.useVirtualLayout = true;
            var dateStr = GCode(CLEnum.MAT_TIPS_RESET);
            this.m_labReset.textFlow = Utils.htmlParser(dateStr);
            egret.callLater(function () {
                if (_this.m_listCard) {
                    Utils.tileGroupToCenter(_this.m_listCard, 370);
                }
            }, this);
            this.initpanel();
            this.addEvent();
            this.m_btnAdd.visible = !platform.isHidePayFunc();
        };
        MaterialView.prototype.updateInfo = function () {
            this.refreshCount();
        };
        /**初始化boss列表 */
        MaterialView.prototype.initpanel = function () {
            var bossArr = [];
            var list = MaterialModel.getMaterialCfgByType(this.m_nType);
            for (var i = 0; i < list.length; i++) {
                var vo = list[i];
                var data = { id: vo.id, type: vo.type, level: vo.playerLevel };
                bossArr.push(data);
            }
            bossArr.sort(function (a, b) {
                var aFight = (RoleData.level >= a.level) && MaterialModel.ifMaterialpass(a.id);
                var bFight = RoleData.level >= b.level && MaterialModel.ifMaterialpass(b.id);
                if (aFight != bFight) {
                    return aFight ? -1 : 1;
                }
                else {
                    //都是可以挑战的副本 未通过放前面
                    var aPass = MaterialModel.ifMateialPass(a.id);
                    var bPass = MaterialModel.ifMateialPass(b.id);
                    if (aPass != bPass)
                        return aPass ? 1 : -1;
                    //都通关
                    if (aPass) {
                        return b.id - a.id;
                    }
                }
                return a.id - b.id;
            });
            this.m_pCollection.replaceAll(bossArr);
            this.refreshCount();
        };
        /**刷新列表数据 */
        MaterialView.prototype.reflashitem = function (info) {
            for (var i = 0; i < this.m_pCollection.source.length; i++) {
                var data = this.m_pCollection.source[i];
                if (data.type == info.type) {
                    this.m_pCollection.replaceItemAt(data, i);
                }
            }
        };
        /**刷新挑战次数 */
        MaterialView.prototype.refreshCount = function () {
            var cfg = C.MaterialTypeConfig[this.m_nType];
            this.m_maxCount = cfg.freeCount;
            var data = MaterialModel.getMaterialItemInfo(this.m_nType);
            if (data) {
                this.m_maxCount += data.bought;
            }
            var m_currNum = MaterialModel.getCurrCount(this.m_nType);
            this.m_labPro.text = m_currNum + "/" + this.m_maxCount;
        };
        /**增加挑战次数 */
        MaterialView.prototype.onbtnadd = function () {
            MaterialModel.showMaterialBuyWnd(this.m_nType);
        };
        MaterialView.NAME = 'MaterialView';
        return MaterialView;
    }(com_main.CView));
    com_main.MaterialView = MaterialView;
    /**
   * MaterialItem
   * @class
   * @extends eui.ItemRenderer
   */
    var MaterialItemRender = /** @class */ (function (_super_1) {
        __extends(MaterialItemRender, _super_1);
        function MaterialItemRender() {
            return _super_1.call(this) || this;
        }
        MaterialItemRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        MaterialItemRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_materialItem = new com_main.MaterialItem();
            this.addChild(this.m_materialItem);
        };
        MaterialItemRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            if (this.m_nType != this.m_tData.type) {
                this.m_nType = this.m_tData.type;
            }
            this.m_materialItem.setItemInfo(this.m_nType, this.m_tData.id);
        };
        return MaterialItemRender;
    }(eui.ItemRenderer));
    com_main.MaterialItemRender = MaterialItemRender;
})(com_main || (com_main = {}));
