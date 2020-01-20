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
    /**任命界面 */
    var LegionAppointWnd = /** @class */ (function (_super_1) {
        __extends(LegionAppointWnd, _super_1);
        function LegionAppointWnd(mata) {
            var _this = _super_1.call(this) || this;
            _this.m_data = null;
            _this.skinName = Utils.getSkinName("app/legion/LegionAppointWndSkin.exml");
            _this.m_data = mata;
            return _this;
        }
        LegionAppointWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.initScroller();
            this.m_PopUp.setBottomBorder();
            this.m_PopUp.setTitleLabel(GCode(CLEnum.GUILD_OPERA_RM));
        };
        LegionAppointWnd.prototype.initScroller = function () {
            var _this = this;
            var info = LegionModel.getGuildInfo();
            var members = {};
            var maxs = [0, 1, 2, 4, 5, 50];
            for (var i = 1; i < maxs.length; i++) {
                members[i] = { cur: 0, max: maxs[i] };
            }
            for (var i = 0; i < info.guildMemberInfo.length; i++) {
                var data = info.guildMemberInfo[i];
                members[data.position].cur++;
            }
            var list = [];
            var memberArr = LegionModel.getGuildInfo().guildMemberInfo[this.m_MemberIdx];
            for (var i = 1; i < 6; i++) {
                var curNum = members[i].cur;
                var max = members[i].max;
                list.push({ playerPos: this.m_data.position, playerId: this.m_data.playerId, position: i, titleName: LegionModel.getPosTitle(i), curNum: curNum, totalNum: max, btnHandle: function (index) { return _this.onClickHandle(index); } });
            }
            this.m_DataArray = new eui.ArrayCollection(list);
            this.m_ItemList.dataProvider = this.m_DataArray;
            this.m_ItemList.itemRenderer = LegionAppointmentCell;
        };
        LegionAppointWnd.prototype.onClickHandle = function (index) {
            console.log('m_playerId,index', this.m_data.playerId, index);
            LegionProxy.send_APPOINT_POSITION(this.m_data.playerId, index);
            com_main.UpManager.history();
        };
        LegionAppointWnd.prototype.RefreshScroller = function () {
            for (var _i = 0, _a = this.m_ItemList.$children; _i < _a.length; _i++) {
                var item = _a[_i];
                var itemE = item;
                itemE.Refresh();
            }
        };
        return LegionAppointWnd;
    }(com_main.CComponent));
    com_main.LegionAppointWnd = LegionAppointWnd;
    var LegionAppointmentCell = /** @class */ (function (_super_1) {
        __extends(LegionAppointmentCell, _super_1);
        function LegionAppointmentCell() {
            return _super_1.call(this) || this;
        }
        LegionAppointmentCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_BtnConfirm.setTitleLabel(GCode(CLEnum.GUILD_OPERA_RM));
            com_main.EventManager.addTouchScaleListener(this.m_BtnConfirm, this, this.onClickBtn);
        };
        LegionAppointmentCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            if (this.data) {
                this.m_BtnConfirm.setTitleLabel(GCode(CLEnum.GUILD_OPERA_RM));
                this.Refresh();
                this.m_BtnConfirm.disabled = this.data.curNum >= this.data.totalNum;
                this.m_BtnConfirm.visible = this.data.playerPos != this.data.position;
            }
        };
        LegionAppointmentCell.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        LegionAppointmentCell.prototype.Refresh = function () {
            this.RefreshTitle();
            this.RefreshNumInfo();
        };
        LegionAppointmentCell.prototype.onClickBtn = function () {
            if (this.data.btnHandle)
                this.data.btnHandle(this.data.position);
        };
        LegionAppointmentCell.prototype.RefreshTitle = function () {
            this.m_Name.text = this.data.titleName;
        };
        LegionAppointmentCell.prototype.RefreshNumInfo = function () {
            this.m_NumInfo.text = format("{1}/{2}", this.data.curNum, this.data.totalNum);
        };
        return LegionAppointmentCell;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
