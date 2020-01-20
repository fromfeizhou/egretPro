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
    /**联盟申请列表 */
    var LegionApplyWnd = /** @class */ (function (_super_1) {
        __extends(LegionApplyWnd, _super_1);
        function LegionApplyWnd(mata) {
            var _this = _super_1.call(this) || this;
            /** 当前擂台列表数据 */
            _this.m_DataArray = new eui.ArrayCollection();
            _this.m_num = [0, 0, 0, 0, 0];
            _this.m_numMax = [1, 2, 4, 5, 50];
            _this.m_data = null;
            _this.m_max = 35;
            _this.m_curPag = 0;
            _this.m_totalPage = 2;
            _this.m_scrollV = 0;
            // this.skinName = Utils.getSkinName("app/legion/LegionApplyWndSkin.exml");
            _this.name = LegionApplyWnd.NAME;
            _this.initApp("legion/LegionApplyWndSkin.exml");
            _this.m_data = mata;
            return _this;
        }
        LegionApplyWnd.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.CHECK_APPLY_JOIN_GUILD,
                ProtoDef.ACCEPT_APPLY_JOIN_GUILD
            ];
        };
        LegionApplyWnd.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.CHECK_APPLY_JOIN_GUILD:
                    {
                        var info = body.stayApplyJoin;
                        this.m_curPag = body.page; //分页
                        this.m_totalPage = body.totalPage; //总页数
                        this.initScroller(info);
                    }
                    break;
                case ProtoDef.ACCEPT_APPLY_JOIN_GUILD: { //3617
                    if (body) {
                        this.removeItemAt(body.type);
                    }
                    break;
                }
            }
        };
        LegionApplyWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            // this.initScroller();
            this.m_PopUp.setBottomBorder();
            this.m_PopUp.setTitleLabel(GCode(CLEnum.GUILD_APPLY_LIST));
            this.requestPage();
            //this.test();
        };
        LegionApplyWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        LegionApplyWnd.prototype.requestPage = function () {
            if (this.m_curPag == 0 || this.m_curPag < this.m_totalPage) {
                LegionProxy.send_CHECK_APPLY_JOIN_GUILD(this.m_curPag + 1);
            }
        };
        LegionApplyWnd.prototype.onScrollEnd = function () {
            if (this.m_Scroller && (this.m_Scroller.viewport.scrollV + this.m_Scroller.height) >= this.m_Scroller.viewport.contentHeight) {
                this.requestPage();
            }
        };
        LegionApplyWnd.prototype.test = function () {
            var n = [];
            for (var i = 0; i < 10; i++) {
                var t = { playerId: 123321, name: '', fight: 13333, level: 1 };
                n.push(t);
            }
            var body = { stayApplyJoin: n, page: 1, totalPage: 1 };
            var info = body.stayApplyJoin;
            this.m_curPag = body.page; //分页
            this.m_totalPage = body.totalPage; //总页数
            this.initScroller(info);
        };
        LegionApplyWnd.prototype.initScroller = function (body) {
            var _this = this;
            var list = [];
            for (var i = 0; i < body.length; i++) {
                var info = body[i];
                var type = info.type;
                list.push({ index: this.m_DataArray.length + i, playerId: info.playerId, playerName: info.name, fight: info.power, level: info.level, btnHandle: function (index) { return _this.onClickHandle(index); } });
            }
            if (this.m_DataArray.length == 0) {
                this.m_DataArray = new eui.ArrayCollection(list);
            }
            else {
                // this.m_DataArray.replaceAll(list);
                for (var i = 0; i < list.length; i++) {
                    this.m_DataArray.addItem(list);
                }
            }
            this.m_ItemList.dataProvider = this.m_DataArray;
            this.m_ItemList.itemRenderer = LegionApplyCell;
        };
        LegionApplyWnd.prototype.onClickHandle = function (index) {
        };
        LegionApplyWnd.prototype.removeItemAt = function (index) {
            this.m_DataArray.removeItemAt(index);
            for (var i = 0; i < this.m_DataArray.length; i++) {
                var data = this.m_DataArray.source[i];
                data.index = i;
            }
        };
        LegionApplyWnd.NAME = 'LegionApplyWnd';
        return LegionApplyWnd;
    }(com_main.CView));
    com_main.LegionApplyWnd = LegionApplyWnd;
    var LegionApplyCell = /** @class */ (function (_super_1) {
        __extends(LegionApplyCell, _super_1);
        function LegionApplyCell() {
            return _super_1.call(this) || this;
        }
        LegionApplyCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_BtnConfirm, this, this.onClickConfirm);
            com_main.EventManager.addTouchScaleListener(this.m_BtnReject, this, this.onClickReject);
        };
        LegionApplyCell.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        //同意
        LegionApplyCell.prototype.onClickConfirm = function () {
            // if(this.data.btnHandle)
            // 	this.data.btnHandle(this.data.index);
            LegionProxy.send_ACCEPT_APPLY_JOIN_GUILD(this.data.playerId, 0, this.data.index);
        };
        //拒绝
        LegionApplyCell.prototype.onClickReject = function () {
            LegionProxy.send_ACCEPT_APPLY_JOIN_GUILD(this.data.playerId, 1, this.data.index);
            // if(this.data.btnHandle)
            // 	this.data.btnHandle(this.data.index);
        };
        LegionApplyCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            if (this.data) {
                this.m_BtnReject.setTitleLabel(GCode(CLEnum.RESURE));
                this.m_Name.text = this.data.playerName;
                this.m_lv.text = this.data.level;
                this.m_labelFight.text = this.data.fight;
            }
        };
        return LegionApplyCell;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
