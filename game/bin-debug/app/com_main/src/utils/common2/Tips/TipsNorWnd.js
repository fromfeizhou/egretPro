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
/**
  * tips类
  * All Rights Reserved.
  * 提示相关信息
  */
var com_main;
(function (com_main) {
    var TipsNorWnd = /** @class */ (function (_super_1) {
        __extends(TipsNorWnd, _super_1);
        function TipsNorWnd(data) {
            var _this = _super_1.call(this) || this;
            _this.m_sTitle = "";
            _this.m_sDes = "";
            _this.m_sTitle = data.title;
            _this.m_sDes = data.des;
            _this.name = TipsNorWnd.NAME;
            _this.initApp("common/tips/TipsNorWndSkin.exml");
            return _this;
        }
        TipsNorWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_labTitle.text = this.m_sTitle;
            this.m_labDes.textFlow = Utils.htmlParser(this.m_sDes);
            ;
            var width = this.m_labDes.width;
            if (width > 400) {
                this.m_labDes.width = 400;
            }
        };
        TipsNorWnd.NAME = 'TipsNorWnd';
        return TipsNorWnd;
    }(com_main.CView));
    com_main.TipsNorWnd = TipsNorWnd;
})(com_main || (com_main = {}));
