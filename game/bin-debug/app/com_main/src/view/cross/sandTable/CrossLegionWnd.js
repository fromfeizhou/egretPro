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
    var CrossLegionWnd = /** @class */ (function (_super_1) {
        __extends(CrossLegionWnd, _super_1);
        function CrossLegionWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.name = CrossLegionWnd.NAME;
            _this.initApp("cross/sandTable/CrossLegionWndSkin.exml");
            return _this;
        }
        CrossLegionWnd.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        CrossLegionWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_apopUp.setTitleLabel('军团');
            this.m_tCollection = new eui.ArrayCollection();
            this.m_ItemList.dataProvider = this.m_tCollection;
            this.m_ItemList.itemRenderer = CrossLegionCell;
            this.initView();
            this.setCrossLegionInfo();
            this.addEvent();
        };
        /**添加监听事件 */
        CrossLegionWnd.prototype.addEvent = function () {
        };
        /**移除监听事件 */
        CrossLegionWnd.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        /** */
        CrossLegionWnd.prototype.initView = function () {
            this.m_labLegionState.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.CROSS_LEGION_ARMY, this.setArmyType(), RoleData.nickName, this.setArmyState()));
        };
        /**设置军团当前状态 */
        CrossLegionWnd.prototype.setArmyState = function () {
            var stateStr;
            switch (CrossModel.armyStatus) {
                case 0: {
                    stateStr = '';
                    break;
                }
                case 1: {
                    stateStr = '全军覆没';
                    break;
                }
                case 2: {
                    stateStr = '驻守城门';
                    break;
                }
                case 3: {
                    stateStr = '战斗中';
                    break;
                }
            }
            return stateStr;
        };
        /**设置军团当前状态 */
        CrossLegionWnd.prototype.setArmyType = function () {
            switch (CrossModel.armyType) {
                case 0: {
                    return GCode(CLEnum.CROSS_JOB_KING);
                }
                case 1: {
                    return GCode(CLEnum.CROSS_JOB_L);
                }
                case 2: {
                    return GCode(CLEnum.CROSS_JOB_M);
                }
                case 3: {
                    return GCode(CLEnum.CROSS_JOB_R);
                }
            }
            return '';
        };
        /**设置军团成员信息 */
        CrossLegionWnd.prototype.setCrossLegionInfo = function () {
            var list = CrossModel.armpGroup;
            if (list && list.length > 0) {
                var res = [];
                var len = list.length >= 50 ? 50 : list.length;
                for (var i = 0; i < len; i++) {
                    res.push({ rank: (i + 1), head: list[i].head, guildName: list[i].guildName, fight: list[i].fight, troopsRate: list[i].troopsRate });
                }
                this.m_tCollection.replaceAll(res);
            }
        };
        CrossLegionWnd.NAME = 'CrossLegionWnd';
        return CrossLegionWnd;
    }(com_main.CView));
    com_main.CrossLegionWnd = CrossLegionWnd;
    var CrossLegionCell = /** @class */ (function (_super_1) {
        __extends(CrossLegionCell, _super_1);
        function CrossLegionCell() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/cross/sandTable/CrossLegionCellSkin.exml");
            return _this;
        }
        CrossLegionCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        CrossLegionCell.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        CrossLegionCell.prototype.onDestroy = function () {
        };
        CrossLegionCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            if (!this.m_tData)
                return;
            this.m_RankLab.text = this.m_tData.rank.toString();
            this.m_PlayerHead.info = this.m_tData.head;
            this.m_PlayerName.text = this.m_tData.head.playerName;
            this.m_pLegionName.text = this.m_tData.guildName == '' ? '无' : this.m_tData.guildName;
            this.m_pPower.text = this.m_tData.fight.toString();
            this.m_pTroops.text = Math.ceil(this.m_tData.troopsRate / 100) + '%';
        };
        return CrossLegionCell;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
