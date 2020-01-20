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
    var LegionCheckInfoWnd = /** @class */ (function (_super_1) {
        __extends(LegionCheckInfoWnd, _super_1);
        function LegionCheckInfoWnd(data) {
            var _this = _super_1.call(this) || this;
            _this.m_tCollects = new eui.ArrayCollection();
            _this.name = LegionCheckInfoWnd.NAME;
            _this.initApp("common/legion/LegionCheckWndSkin.exml");
            _this.m_tData = data;
            return _this;
        }
        LegionCheckInfoWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        LegionCheckInfoWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_PopUp.setTitleLabel(GCode(CLEnum.LEGION_CHECK_INFO));
            this.initview();
        };
        LegionCheckInfoWnd.prototype.initview = function () {
            if (!this.m_tData)
                return;
            var rankGuildInfo = this.m_tData.rankGuildInfo; //查看的排行榜联盟信息
            var leaderInfo = rankGuildInfo.leaderInfo; //，盟主信息
            var memberInfo = rankGuildInfo.guildMemberInfo; //，最强战力列表
            this.m_labAllPower.text = rankGuildInfo.guildPower + '';
            var headInfo = { type: 1, url: rankGuildInfo.leaderInfo.head.toString(), official: rankGuildInfo.leaderInfo.position, vip: rankGuildInfo.leaderInfo.vip };
            this.m_comHead.info = headInfo;
            this.m_labGuideName.text = leaderInfo.name;
            this.m_comFightItem.setFight(leaderInfo.power);
            this.LegionInfo();
            this.initGeneralItems(memberInfo);
        };
        /**设置查看的联盟信息 */
        LegionCheckInfoWnd.prototype.LegionInfo = function () {
            var checkInfo = LegionModel.currGuideInfo;
            if (!checkInfo)
                return;
            this.m_labName.text = checkInfo.legionName;
            this.m_pImgIcon.source = LegionModel.getLegionCountryImage(checkInfo.countryId);
            this.m_labRank.text = checkInfo.rank + '';
        };
        /**设置联盟最强战力 */
        LegionCheckInfoWnd.prototype.initGeneralItems = function (list) {
            this.m_tCollects = new eui.ArrayCollection();
            this.m_ItemList.dataProvider = this.m_tCollects;
            this.m_ItemList.itemRenderer = GuideMemberCell;
            var res = [];
            for (var i = 0; i < list.length; i++) {
                var data = list[i];
                var headInfo = { type: 1, url: data.head.toString(), official: data.position, vip: data.vip };
                var guideData = { headInfo: headInfo, power: data.power, name: data.name };
                res.push(guideData);
            }
            this.m_tCollects.replaceAll(res);
        };
        LegionCheckInfoWnd.NAME = 'LegionCheckInfoWnd';
        return LegionCheckInfoWnd;
    }(com_main.CView));
    com_main.LegionCheckInfoWnd = LegionCheckInfoWnd;
    ;
    var GuideMemberCell = /** @class */ (function (_super_1) {
        __extends(GuideMemberCell, _super_1);
        function GuideMemberCell() {
            return _super_1.call(this) || this;
        }
        GuideMemberCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_comHead = com_main.LegionCheckCell.create();
            this.addChild(this.m_comHead);
        };
        GuideMemberCell.prototype.$onRemoveFromStage = function () {
            this.m_comHead.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        GuideMemberCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            this.m_comHead.setInfo(this.m_tData.headInfo, this.m_tData.power, this.m_tData.name);
        };
        return GuideMemberCell;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
