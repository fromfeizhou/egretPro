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
     * 新手描述框
     */
    var GuideDesView = /** @class */ (function (_super_1) {
        __extends(GuideDesView, _super_1);
        function GuideDesView(data) {
            var _this = _super_1.call(this) || this;
            _this.name = GuideDesView.NAME;
            _this.m_tData = data;
            _this.skinName = Utils.getComSkin("guide/GuideDesViewSkin.exml");
            return _this;
        }
        GuideDesView.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        GuideDesView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchTapListener(this.m_pBtnMask, this, this.onShowNext);
            var des = GLan(this.m_tData.stepCfg.desParam);
            this.m_tDesList = des == '' ? [] : JSON.parse(des);
            this.m_nDesId = 0;
            this.onShowNext();
        };
        //显示下一句
        GuideDesView.prototype.onShowNext = function () {
            if (this.m_nDesId >= this.m_tDesList.length) {
                this.closeDialog();
            }
            else {
                this.m_pLbDec.textFlow = Utils.htmlParser(this.m_tDesList[this.m_nDesId]);
            }
            this.m_nDesId++;
        };
        GuideDesView.prototype.closeDialog = function () {
            SceneManager.closeGuidePanelByName(GuideDesView.NAME);
        };
        GuideDesView.NAME = 'GuideDesView';
        return GuideDesView;
    }(com_main.CView));
    com_main.GuideDesView = GuideDesView;
})(com_main || (com_main = {}));
