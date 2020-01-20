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
    /**沙盘城市 */
    var SandTableCityCell = /** @class */ (function (_super_1) {
        __extends(SandTableCityCell, _super_1);
        function SandTableCityCell() {
            var _this = _super_1.call(this) || this;
            _this.m_data = null;
            _this.skinName = Utils.getAppSkin("cross/sandTable/SandTableCityCellSkin.exml");
            _this.name = SandTableCityCell.NAME;
            return _this;
        }
        SandTableCityCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            // this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
            this.addEvent();
        };
        SandTableCityCell.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        SandTableCityCell.prototype.onDestroy = function () {
            this.m_data = null;
            this.clearUI();
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        SandTableCityCell.prototype.clearUI = function () {
            if (this.m_pBattleEffect) {
                NormalMcMgr.removeMc(this.m_pBattleEffect);
                this.m_pBattleEffect = null;
            }
            Utils.removeFromParent(this.m_capComp);
            Utils.removeFromParent(this.m_ofItem);
            Utils.removeFromParent(this.m_imgWar);
        };
        /**添加监听事件 */
        SandTableCityCell.prototype.addEvent = function () {
            var _this = this;
            com_main.EventManager.addTouchScaleListener(this, this, function () {
                console.log("m_data", _this.m_data);
                Utils.open_view(TASK_UI.CROSS_SERVER_CITY_TIPS, _this.m_data);
            });
        };
        /**移除监听事件 */
        SandTableCityCell.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        SandTableCityCell.prototype.initData = function (data) {
            if (isNull(data))
                return;
            this.m_data = data;
            this.m_labName.text = this.m_data.cityName;
            // 添加占领标志
            if (this.m_data.isCapture) {
                var serverId = PlatConst.zoneId;
                var svo = CrossModel.getWarsandServerVo(this.m_data.servers, serverId);
                var isOwn = svo && svo.status == 2;
                if (isNull(this.m_capComp)) {
                    this.m_capComp = new CaptureFlagCell();
                    this.m_capComp.initData(this.m_data);
                    this.m_capComp.refreshCurrentState(isOwn ? "own" : "other");
                    this.addCaptureFlag(this.m_capComp);
                }
                if (isOwn) {
                    if (isNull(this.m_ofItem)) {
                        this.m_ofItem = new OwnFlagItem();
                        this.addEmperorHead(this.m_ofItem);
                    }
                }
                else {
                    Utils.removeFromParent(this.m_ofItem);
                }
            }
            else {
                Utils.removeFromParent(this.m_capComp);
            }
            // 添加交战图标
            if (this.m_data.atWar) {
                if (isNull(this.m_imgWar))
                    this.addAtWarFlag();
            }
            else {
                Utils.removeFromParent(this.m_imgWar);
            }
        };
        /**添加占领标志 */
        SandTableCityCell.prototype.addCaptureFlag = function (object) {
            if (this.m_pRoot && object) {
                this.m_pRoot.addChild(object);
                if (object instanceof com_main.CComponent) {
                    var centerOffset = SandTableCityCell.flagOffset[this.currentState];
                    object.horizontalCenter = centerOffset.hCenter;
                    object.verticalCenter = centerOffset.vCenter;
                }
            }
        };
        /**添加本服皇帝头像 */
        SandTableCityCell.prototype.addEmperorHead = function (object) {
            if (this.m_pRoot && object) {
                this.m_pRoot.addChild(object);
                if (object instanceof OwnFlagItem) {
                    object.horizontalCenter = 0;
                    object.y = -20;
                }
            }
        };
        /**添加交战图标 */
        SandTableCityCell.prototype.addAtWarFlag = function () {
            if (isNull(this.m_pRoot))
                return;
            // 添加战火动画
            var isWar = CrossModel.crossStatus == 4 /* WALL_WAR */ ||
                CrossModel.crossStatus == 5 /* CITY_WAR */;
            if (isWar)
                this.addBattleEffect();
            // 图标
            this.m_imgWar = new com_main.CImage();
            this.m_imgWar.source = "tb_j_png";
            this.m_imgWar.width = this.m_imgWar.height = 64;
            this.m_pRoot.addChild(this.m_imgWar);
            this.m_imgWar.horizontalCenter = 0;
            this.m_imgWar.y = -20;
        };
        SandTableCityCell.prototype.addBattleEffect = function () {
            if (this.m_pBattleEffect)
                return;
            this.validateNow();
            var data = this.m_data;
            this.m_pBattleEffect = NormalMcMgr.createMc(IETypes.EWORLD_City_Fire, false);
            if (this.currentState == "city_1") {
                this.m_pBattleEffect.play("zhanhuo" + 3);
            }
            else if (this.currentState == "city_2") {
                this.m_pBattleEffect.play("zhanhuo" + 3);
            }
            else if (this.currentState == "city_3") {
                this.m_pBattleEffect.play("zhanhuo" + 1);
            }
            else if (this.currentState == "city_4") {
                this.m_pBattleEffect.play("zhanhuo" + 2);
            }
            this.m_pRoot.addChild(this.m_pBattleEffect);
            NodeUtils.setPosition(this.m_pBattleEffect, this.m_pRoot.width / 2, this.m_pRoot.height / 2);
            NodeUtils.setScale(this.m_pBattleEffect, 0.6);
        };
        SandTableCityCell.NAME = 'SandTableCityCell';
        // 占领标志偏移位置
        SandTableCityCell.flagOffset = {
            "city_1": { hCenter: -100, vCenter: -20 },
            "city_2": { hCenter: -80, vCenter: -20 },
            "city_3": { hCenter: -60, vCenter: -10 },
            "city_4": { hCenter: -60, vCenter: -10 },
        };
        return SandTableCityCell;
    }(com_main.CComponent));
    com_main.SandTableCityCell = SandTableCityCell;
    /**沙盘城市占领标志 */
    var CaptureFlagCell = /** @class */ (function (_super_1) {
        __extends(CaptureFlagCell, _super_1);
        function CaptureFlagCell() {
            var _this = _super_1.call(this) || this;
            _this.m_data = null;
            _this.skinName = Utils.getAppSkin("cross/sandTable/CaptureFlagCellSkin.exml");
            _this.name = CaptureFlagCell.NAME;
            return _this;
        }
        CaptureFlagCell.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        CaptureFlagCell.prototype.onDestroy = function () {
            this.m_data = null;
            _super_1.prototype.onDestroy.call(this);
        };
        CaptureFlagCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        CaptureFlagCell.prototype.initData = function (data) {
            if (isNull(data))
                return;
            this.m_data = data;
            this.refreshServerName();
        };
        CaptureFlagCell.prototype.refreshServerName = function () {
            // let len = this.m_data.servers.reduce((pre, cur) => {
            // 	return pre + cur.status == 2 ? 1 : 0;
            // }, 0);
            var len = 0;
            this.m_data.servers.forEach(function (v, i, a) {
                if (v.status == 2)
                    len += 1;
            });
            this.m_labServer.text = len + "个服";
        };
        CaptureFlagCell.prototype.refreshCurrentState = function (state) {
            if (state === void 0) { state = "own"; }
            this.currentState = state;
        };
        CaptureFlagCell.NAME = 'CaptureFlagCell';
        return CaptureFlagCell;
    }(com_main.CComponent));
    com_main.CaptureFlagCell = CaptureFlagCell;
    /**本服占领 */
    var OwnFlagItem = /** @class */ (function (_super_1) {
        __extends(OwnFlagItem, _super_1);
        function OwnFlagItem() {
            var _this = _super_1.call(this) || this;
            _this.name = OwnFlagItem.NAME;
            return _this;
        }
        OwnFlagItem.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        OwnFlagItem.prototype.onDestroy = function () {
            this.m_tItem.onDestroy();
            _super_1.prototype.onDestroy.call(this);
        };
        OwnFlagItem.prototype.createChildren = function () {
            _super_1.prototype.createChildren.call(this);
            this.m_tItem = new com_main.ComHeadItem();
            this.m_tItem.scaleX = this.m_tItem.scaleY = 0.6;
            this.addChild(this.m_tItem);
            this.setHeadInfo(null);
            this.m_labFlag = new com_main.CLabel();
            this.m_labFlag.size = 16;
            this.m_labFlag.bold = true;
            this.m_labFlag.textColor = 0xfdff73;
            this.m_labFlag.stroke = 2;
            this.m_labFlag.strokeColor = 0x290d00;
            this.addChild(this.m_labFlag);
            this.m_labFlag.horizontalCenter = 0;
            this.m_labFlag.bottom = 0;
            this.m_labFlag.text = "本服占领";
        };
        OwnFlagItem.prototype.setHeadInfo = function (val) {
            if (isNull(val)) {
                val = { type: RoleData.headType, url: RoleData.headId.toString() };
            }
            if (isNull(this.m_tItem))
                return;
            this.m_tItem.info = val;
            this.m_tItem.refreshIconView();
        };
        OwnFlagItem.NAME = 'OwnFlagItem';
        return OwnFlagItem;
    }(com_main.CComponent));
    com_main.OwnFlagItem = OwnFlagItem;
    /**跨服战战场buff图标 */
    var CrossBuffIconCell = /** @class */ (function (_super_1) {
        __extends(CrossBuffIconCell, _super_1);
        function CrossBuffIconCell(param) {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("general/General_skill_icon_view.exml");
            return _this;
        }
        CrossBuffIconCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.currentState = "basebuff";
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
        };
        CrossBuffIconCell.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        /**设置icon */
        CrossBuffIconCell.prototype.setIcon = function (icon, isGray) {
            if (isGray === void 0) { isGray = true; }
            this.m_imgSkillIcon.source = icon;
            Utils.isGray(isGray, this.m_imgSkillIcon);
        };
        /**设置名字 */
        CrossBuffIconCell.prototype.setName = function (name) {
            if (name === void 0) { name = ""; }
            this.m_labName.text = "Lv." + name;
        };
        return CrossBuffIconCell;
    }(com_main.CComponent));
    com_main.CrossBuffIconCell = CrossBuffIconCell;
    /**跨服战战场 */
    var CrossBuffCell = /** @class */ (function (_super_1) {
        __extends(CrossBuffCell, _super_1);
        function CrossBuffCell(param) {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("cross/sandTable/CrossBuffCellSkin.exml");
            _this.m_data = param;
            return _this;
        }
        CrossBuffCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
            this.addEvent();
        };
        CrossBuffCell.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        /**添加监听事件 */
        CrossBuffCell.prototype.addEvent = function () {
            var _this = this;
            com_main.EventManager.addTouchScaleListener(this.m_btnUpgrade, this, function () {
                console.log("m_data 升级buff===>", _this.m_data);
                var type = _this.m_data.type;
                if (type === 1) {
                    error("个人Buff升级===>");
                }
                else if (type === 2) {
                    error("全服Buff升级===>");
                }
                CrossProxy.C2S_CROSS_SERVER_BUY_BUFFER(type);
                _this.refreshView();
            });
        };
        /**移除监听事件 */
        CrossBuffCell.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        /**初始化界面数据 */
        CrossBuffCell.prototype.initViewData = function (data) {
            if (isNull(data))
                return;
            this.m_data = data;
            this.m_labTitle.text = data.name;
            this.m_labDesc.textFlow = Utils.htmlParser(data.desc);
            this.m_btnUpgrade.setCostLabel(data.cost + "");
            this.m_pIcon.setIcon(data.icon + "_png", false);
            this.m_pIcon.setName(data.level + "");
        };
        /**刷新数据 */
        CrossBuffCell.prototype.refreshView = function () {
            this.m_data.cost += 10;
            this.m_data.level += 1;
            this.m_labDesc.textFlow = Utils.htmlParser(this.m_data.desc);
            this.m_btnUpgrade.setCostLabel(this.m_data.cost + "");
            this.m_pIcon.setName(this.m_data.level + "");
        };
        return CrossBuffCell;
    }(com_main.CComponent));
    com_main.CrossBuffCell = CrossBuffCell;
})(com_main || (com_main = {}));
