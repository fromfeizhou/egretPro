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
    /**
     * pvp战报面板相关
     */
    var PvpNoticeView = /** @class */ (function (_super_1) {
        __extends(PvpNoticeView, _super_1);
        function PvpNoticeView() {
            var _this = _super_1.call(this) || this;
            _this.REQUEST_COUNT = 50;
            _this.name = PvpNoticeView.NAME;
            _this.initApp("pvp_arena/PvpNoticeViewSkin.exml");
            PvpArenaProxy.send_APK_CHALLENGE_HIS(_this.REQUEST_COUNT);
            return _this;
        }
        PvpNoticeView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.APK_GET_CHALLENGE_HIS,
            ];
        };
        /**处理协议号事件 */
        PvpNoticeView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.APK_GET_CHALLENGE_HIS: {
                    this.initNoticeList(body);
                    break;
                }
                default: {
                }
            }
        };
        PvpNoticeView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        PvpNoticeView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_pApopUp.setBottomBorder();
            this.initView();
        };
        PvpNoticeView.prototype.initView = function () {
            var tempData = [];
            // tempData.push({name:"dfasdf"});
            // tempData.push({name:"234"});
            // tempData.push({name:"tehju"});
            // tempData.push({name:"qwer"});
            // tempData.push({name:"df"});
            // tempData.push({name:"qewr"});
            // tempData.push({name:"er"});
            // tempData.push({name:"d"});
            this.m_pApopUp.setTitleLabel(GCode(CLEnum.ARENA));
            this.m_pList.itemRenderer = com_main.PvpNoticeCell;
        };
        PvpNoticeView.prototype.initNoticeList = function (data) {
            if (!data)
                return;
            var tempData = [];
            for (var key in data.apkChallengeHisVoList) {
                var tempVo = ApkChallengeHisVo.create(data.apkChallengeHisVoList[key]);
                tempData.push(tempVo);
            }
            tempData.sort(function (a, b) {
                return b.challengeTime - a.challengeTime;
            });
            this.m_pList.dataProvider = new eui.ArrayCollection(tempData);
        };
        PvpNoticeView.NAME = 'PvpNoticeView';
        return PvpNoticeView;
    }(com_main.CView));
    com_main.PvpNoticeView = PvpNoticeView;
})(com_main || (com_main = {}));
