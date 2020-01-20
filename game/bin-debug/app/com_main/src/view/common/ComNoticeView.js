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
    var ComNoticeView = /** @class */ (function (_super_1) {
        __extends(ComNoticeView, _super_1);
        function ComNoticeView(data) {
            var _this = _super_1.call(this) || this;
            _this.m_timStr = "活动截止时间：11月21日0点";
            _this.m_notice = data;
            _this.name = ComNoticeView.NAME;
            _this.initApp("common/ComNoticeViewSkin.exml");
            return _this;
        }
        ComNoticeView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.ACTIVITY_NOTICE]);
        };
        ComNoticeView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_apopUp.setTitleLabel(GCode(CLEnum.AC_NOTICE));
            this.refresh();
        };
        /**刷新面板 */
        ComNoticeView.prototype.refresh = function () {
            this.m_lbTime.text = this.m_timStr;
            this.m_nImg.source = LoginConst.getResUrl(this.m_notice.url, 'notice');
            switch (this.m_notice.type) {
                case AcNoticeEnum.IMG_TEXT:
                    this.m_lbTime.horizontalCenter = 0;
                    this.m_lbTime.y = 110;
                    this.m_lbTime.visible = true;
                    this.m_lbTime.text = "活动截止时间：" + this.getTimeStr(this.m_notice.closeDate.replace(/-/g, "/"));
                    break;
                case AcNoticeEnum.IMG:
                    this.m_lbTime.visible = false;
                    break;
            }
        };
        ComNoticeView.prototype.getTimeStr = function (time) {
            var date = new Date(time);
            return date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
        };
        ComNoticeView.NAME = "ComNoticeView";
        return ComNoticeView;
    }(com_main.CView));
    com_main.ComNoticeView = ComNoticeView;
})(com_main || (com_main = {}));
