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
    var ComBoxInfoView = /** @class */ (function (_super_1) {
        __extends(ComBoxInfoView, _super_1);
        function ComBoxInfoView(param) {
            var _this = _super_1.call(this) || this;
            _this.name = ComBoxInfoView.NAME;
            _this.m_sAwards = param.awards;
            _this.m_thisObj = param.thisObj;
            _this.m_callback = param.callback;
            _this.initApp("common/ComBoxInfoViewSkin.exml");
            return _this;
        }
        ComBoxInfoView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        ComBoxInfoView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_APopUp.setTitleLabel(GCode(CLEnum.BOX_AWARD));
            this.m_btnUse.setTitleLabel(GCode(CLEnum.TAKE_OUT));
            this.m_btnUse.visible = this.m_callback != null ? true : false;
            com_main.EventManager.addTouchScaleListener(this.m_btnUse, this, this.onBtnUseHandler);
            this.refresh();
        };
        /**刷新面板 */
        ComBoxInfoView.prototype.refresh = function () {
            if (typeof (this.m_sAwards) == "string") {
                var rewardCfg = Utils.parseCommonItemJson(this.m_sAwards);
                if (rewardCfg) {
                    for (var it in rewardCfg) {
                        if (rewardCfg[it]) {
                            var consumeInfo = rewardCfg[it];
                            var itemId = consumeInfo.itemId;
                            var count = consumeInfo.count;
                            var item = com_main.ComItemNew.create("name_num");
                            item.setItemInfo(itemId, count);
                            this.m_groupAward.addChild(item);
                        }
                    }
                }
            }
            else {
                if (this.m_sAwards) {
                    for (var i in this.m_sAwards) {
                        if (this.m_sAwards[i]) {
                            var keyValueInfo = this.m_sAwards[i];
                            var itemId = keyValueInfo.itemId;
                            var count = keyValueInfo.count;
                            var item = com_main.ComItemNew.create("name_num");
                            item.setItemInfo(itemId, count);
                            this.m_groupAward.addChild(item);
                        }
                    }
                }
            }
            // let container = this.getItemContainer(true);
            // this.m_groupAward.addChild(container);
        };
        // private getItemContainer(isCenter) {
        //     let container = new eui.Group();
        //     container.width = 600;
        //     container.height = 134;
        //     var layout = new eui.HorizontalLayout();
        //     if (isCenter) {
        //         layout.horizontalAlign = "center";
        //     }
        //     container.layout = layout;
        //     return container;
        // }
        /**按钮回调 */
        ComBoxInfoView.prototype.onBtnUseHandler = function () {
            if (this.m_callback && this.m_thisObj) {
                this.m_callback.call(this.m_thisObj);
            }
        };
        ComBoxInfoView.NAME = "ComBoxInfoView";
        return ComBoxInfoView;
    }(com_main.CView));
    com_main.ComBoxInfoView = ComBoxInfoView;
})(com_main || (com_main = {}));
