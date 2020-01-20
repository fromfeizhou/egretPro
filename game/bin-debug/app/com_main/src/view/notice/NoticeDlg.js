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
    /**boss */
    var NoticeDlg = /** @class */ (function (_super_1) {
        __extends(NoticeDlg, _super_1);
        function NoticeDlg(data) {
            var _this = _super_1.call(this) || this;
            _this.m_data = [];
            _this.name = NoticeDlg.NAME;
            if (data) {
                _this.m_data = data;
            }
            _this.initApp("notice/NoticeDlgSkin.exml");
            return _this;
        }
        NoticeDlg.prototype.listenerProtoNotifications = function () {
            return [
            // ProtoDef.GET_BOSS,
            ];
        };
        /**处理协议号事件 */
        NoticeDlg.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                // case ProtoDef.GET_BOSS: {
                // let info = BossModel.getInfobyType(this.m_bossType+1); //
                // this.initPanel(info);
                // }
                // break;
            }
        };
        NoticeDlg.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_PopUp.setTitleLabel(GCode(CLEnum.NOTICE_TITLE));
            this.m_PopUp.setBottomBorder();
            // this.m_comTabGroup.addTabBtnData({name:"新服开启"});
            // this.m_comTabGroup.addTabBtnData({name:"更新维护"});
            if (this.m_data.length > 0) {
                for (var i = 0; i < this.m_data.length; i++) {
                    this.m_comTabGroup.addTabBtnData({ name: this.m_data[i].title });
                    if (i == 0) {
                        this.m_contentText.textFlow = Utils.htmlParser(this.m_data[i].content);
                    }
                }
                this.m_comTabGroup.setChangeCallback(this.onTabBtnClick, this);
            }
        };
        /**切卡按钮点击 */
        NoticeDlg.prototype.onTabBtnClick = function (selectedIndex) {
            // let content = "<font color = #e9e9e6>你好中国：</font>\n\n 大家好才是{1}真的好啊<font color = #e9e9e6>《权游三国》</font>与{2}分，大家好才是真的好啊大家好才是真的好啊大家好大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大好啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊大啊大家好才是真的好啊大家好才是真的好啊大家好才是真的好啊才是真的好啊大家好才是真的好啊";
            // this.m_contentText.textFlow =Utils.htmlParser(content);
            this.m_contentText.textFlow = Utils.htmlParser(this.m_data[selectedIndex].content);
        };
        NoticeDlg.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        NoticeDlg.prototype.initPanel = function (info) {
        };
        NoticeDlg.NAME = 'NoticeDlg';
        return NoticeDlg;
    }(com_main.CView));
    com_main.NoticeDlg = NoticeDlg;
})(com_main || (com_main = {}));
