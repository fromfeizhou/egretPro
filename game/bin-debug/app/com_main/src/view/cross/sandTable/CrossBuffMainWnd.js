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
    var CrossBuffMainWnd = /** @class */ (function (_super_1) {
        __extends(CrossBuffMainWnd, _super_1);
        function CrossBuffMainWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.name = CrossBuffMainWnd.NAME;
            _this.initApp("cross/sandTable/CrossBuffViewSkin.exml");
            return _this;
        }
        CrossBuffMainWnd.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_CROSS_SERVER_BUFFER_INFO,
            ];
        };
        CrossBuffMainWnd.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_CROSS_SERVER_BUFFER_INFO: {
                    var nType = body;
                    if (nType == 1) {
                        this.m_pPerson.refreshView();
                    }
                    else if (nType == 2) {
                        this.m_pServer.refreshView();
                    }
                    break;
                }
            }
        };
        CrossBuffMainWnd.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        CrossBuffMainWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.addEvent();
            this.initView();
        };
        /**添加监听事件 */
        CrossBuffMainWnd.prototype.addEvent = function () {
        };
        /**移除监听事件 */
        CrossBuffMainWnd.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        /**初始化界面 */
        CrossBuffMainWnd.prototype.initView = function () {
            this.m_apopUp.setTitleLabel(GCode(CLEnum.CROSS_BUFF_TITLE));
            this.m_labDesc.textFlow = Utils.htmlParser(GCode(CLEnum.CROSS_BUFF_DESC));
            //let p_prop1 = {} as PropType;
            var p_prop1 = {
                type: 1, level: 1, icon: "cityBuff_11", name: "个人BUFF", cost: 100,
                desc: GCodeFromat(CLEnum.CROSS_BUFF_EFFECT1, "攻击", "20%")
            };
            var p_prop2 = {
                type: 2, level: 12, icon: "cityBuff_12", name: "全服BUFF", cost: 200,
                desc: GCodeFromat(CLEnum.CROSS_BUFF_EFFECT2, "攻击", "30%")
            };
            this.m_pPerson.initViewData(p_prop1);
            this.m_pServer.initViewData(p_prop2);
        };
        CrossBuffMainWnd.NAME = 'CrossBuffMainWnd';
        return CrossBuffMainWnd;
    }(com_main.CView));
    com_main.CrossBuffMainWnd = CrossBuffMainWnd;
})(com_main || (com_main = {}));
