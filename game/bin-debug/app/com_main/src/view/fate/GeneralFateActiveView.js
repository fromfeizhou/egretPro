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
     * 武将缘分弹出框
     */
    var GeneralFateActiveView = /** @class */ (function (_super_1) {
        __extends(GeneralFateActiveView, _super_1);
        function GeneralFateActiveView(id) {
            var _this = _super_1.call(this) || this;
            _this.name = GeneralFateActiveView.NAME;
            _this.m_fateId = id;
            _this.initApp("fate/GeneralFateActiveViewSkin.exml");
            return _this;
        }
        ; //进场动画
        GeneralFateActiveView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
            this.removeEvent();
            // SceneResGroupCfg.clearModelRes([ModuleEnums.FATE_UI]);
            this.actionGroup.removeEventListener("complete", this.onTweenComplete, this);
        };
        GeneralFateActiveView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_labTips.visible = false;
            this.actionGroup.addEventListener("complete", this.onTweenComplete, this);
            this.actionGroup.play(0);
            this.initEvent();
            this.refreshView();
        };
        GeneralFateActiveView.prototype.refreshView = function () {
            var fateCfg = C.RelationConfig[this.m_fateId];
            this.m_fateData = fateCfg;
            this.m_lbName.text = fateCfg.name;
            this.m_lbContent.textFlow = Utils.htmlParser(fateCfg.Desc);
            this.m_pro.removeChildren();
            this.m_phead.removeChildren();
            var triggerParameter = fateCfg.triggerParameter.split(",");
            var activiState = "unlock";
            for (var index = 0; index < triggerParameter.length; index++) {
                var triggerArr = triggerParameter[index].split("_");
                if (index != triggerParameter.length - 1) {
                    var pro = com_main.FateProComp.create(activiState);
                    pro.x = 96 * (index + 1);
                    pro.y = 44;
                    this.m_pro.addChild(pro);
                }
            }
            for (var index = 0; index < triggerParameter.length; index++) {
                var genHead = com_main.GeneralHeadRender.create("fate");
                var triggerArr = triggerParameter[index].split("_");
                genHead.setGenViewInfo(Number(triggerArr[0]), 1, Number(triggerArr[1]));
                genHead.x = 170 * index;
                genHead.scaleX = 0.8;
                genHead.scaleY = 0.8;
                this.m_phead.addChild(genHead);
            }
        };
        /**
       * 动画组播放完成
       */
        GeneralFateActiveView.prototype.onTweenComplete = function () {
            this.m_labTips.visible = true;
        };
        /**=====================================================================================
      * 事件监听 begin
      * =====================================================================================
      */
        GeneralFateActiveView.prototype.initEvent = function () {
            com_main.EventManager.addTouchTapListener(this, this, this.onTouchBackGround);
        };
        GeneralFateActiveView.prototype.removeEvent = function () {
        };
        GeneralFateActiveView.prototype.onTouchBackGround = function () {
            if (!this.m_labTips.visible)
                return;
            com_main.UpManager.history();
        };
        GeneralFateActiveView.NAME = 'GeneralFateActiveView';
        return GeneralFateActiveView;
    }(com_main.CView));
    com_main.GeneralFateActiveView = GeneralFateActiveView;
})(com_main || (com_main = {}));
