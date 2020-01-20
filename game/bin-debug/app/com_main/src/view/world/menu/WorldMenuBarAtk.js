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
    /**黄巾入侵菜单 */
    var WorldMenuBarAtk = /** @class */ (function (_super_1) {
        __extends(WorldMenuBarAtk, _super_1);
        function WorldMenuBarAtk(id) {
            var _this = _super_1.call(this) || this;
            _this.name = "WorldMenu";
            _this.initApp("world/menu/WorldMenuBarAtkSkin.exml");
            _this.cacheAsBitmap = true;
            _this.m_nOrginY = 0;
            _this.m_nId = id;
            return _this;
        }
        WorldMenuBarAtk.prototype.removeFromParent = function () {
            Utils.removeFromParent(this);
        };
        WorldMenuBarAtk.prototype.$onRemoveFromStage = function () {
            this.clearHeadItem();
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        /////////////////////////////////////////////////////////////////协议号事件
        /**注册协议号事件 */
        WorldMenuBarAtk.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_SYS_GENERAL_WIN_INFO,
            ];
        };
        /**处理协议号事件 */
        WorldMenuBarAtk.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_SYS_GENERAL_WIN_INFO: {
                    this.refreshGeneralView(body);
                    break;
                }
                default:
                    break;
            }
        };
        WorldMenuBarAtk.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            var vo = ActivityModel.getActivityVo(AcViewType.BARBARIANATTACK);
            if (!vo)
                return;
            var cityInfo = vo.cityDatas[this.m_nId];
            if (!cityInfo)
                return;
            this.m_labCount.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.WOR_ARMY_COU, cityInfo.armyCount));
            this.m_labfightNum.text = cityInfo.armyForce.toString();
            var items = Utils.parseCommonItemJsonInDrop([cityInfo.drop]);
            var length = Math.min(items.length, 5);
            for (var i = 0; i < length; i++) {
                var item = com_main.ComItemNew.create("count");
                item.setItemInfo(items[i].itemId, items[i].count);
                this.m_pAward.addChild(item);
            }
        };
        /**获得怪物内容 */
        WorldMenuBarAtk.prototype.onCreate = function () {
            var vo = ActivityModel.getActivityVo(AcViewType.BARBARIANATTACK);
            if (!vo)
                return;
            var cityInfo = vo.cityDatas[this.m_nId];
            if (!cityInfo)
                return;
            //发送协议获得
            NormalProxy.C2S_SYS_GENERAL_WIN_INFO(cityInfo.npcId[0]);
        };
        /**刷新武将显示 */
        WorldMenuBarAtk.prototype.refreshGeneralView = function (data) {
            if (data) {
                for (var i = 0; i < data.generalWinInfo.length; i++) {
                    var tempData = data.generalWinInfo[i];
                    var item = com_main.GeneralHeadRender.create("arena_name");
                    item.setGenViewInfo(tempData.generalId, tempData.level, tempData.star, tempData.quality);
                    Utils.addChild(this.m_pGHead, item);
                }
            }
        };
        /**回收头像 */
        WorldMenuBarAtk.prototype.clearHeadItem = function () {
            if (!this.m_pGHead)
                return;
            while (this.m_pGHead.numChildren > 0) {
                var item = this.m_pGHead.getChildAt(0);
                item.onDestroy();
            }
        };
        return WorldMenuBarAtk;
    }(com_main.WorldMenuComponent));
    com_main.WorldMenuBarAtk = WorldMenuBarAtk;
})(com_main || (com_main = {}));
