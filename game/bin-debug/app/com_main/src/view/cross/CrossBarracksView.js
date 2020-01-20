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
 * 跨服战总兵库
 */
var com_main;
(function (com_main) {
    var CrossBarracksView = /** @class */ (function (_super_1) {
        __extends(CrossBarracksView, _super_1);
        function CrossBarracksView(bId) {
            var _this = _super_1.call(this) || this;
            _this.name = CrossBarracksView.NAME;
            _this.m_bId = bId;
            _this.initApp("cross/CrossBarracksSkin.exml");
            return _this;
        }
        CrossBarracksView.prototype.onDestroy = function () {
            this.removeEvent();
        };
        CrossBarracksView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.width = GameConfig.curWidth();
            this.height = GameConfig.curHeight();
            this.m_apopUp.setTitleLabel('跨服战总兵库');
            var crossServerConst = C.CrossServerConstConfig[CrossServerConstType.TROOPS_RECOVER];
            var recover = crossServerConst.value.split(',');
            var comtent = "\u8DE8\u670D\u6218\u4E2D\u90E8\u961F\u8865\u5145\u5175\u529B\u4ECE\u603B\u5175\u5E93\u6263\u9664\uFF0C\u4E0D\u6D88\u8017\u4E2A\u4EBA\u5175\u529B\u3002\n\u53EF\u4F7F\u7528\u5143\u5B9D\u4E3A\u603B\u5175\u5E93\u8865\u5175\u3002\n\u5175\u5E93\u6BCF<font color=#ffffff>" + recover[0] + "</font>\u79D2\u4F1A\u81EA\u52A8\u6062\u590D<font color=#ffffff>" + recover[1] + "</font>\u5175\u529B\u3002";
            // this.m_content.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.CITY_BD_LIMIT1,1));
            this.m_content.textFlow = Utils.htmlParser(comtent);
            // let str1 = '剩余总兵力：%d'
            // this.m_hpLb.text = '剩余总兵力：'+ 1000000000; 
            // let str = '每次补充兵力1000万总兵力，获得1000荣誉'
            // this.m_lbAddHelp.text = str;
            var crossServerConst1 = C.CrossServerConstConfig[CrossServerConstType.MAX_TROOPS];
            var maxTroop = unNull(crossServerConst1) ? Number(crossServerConst1.value) : 0;
            this.m_hpLb.text = '剩余总兵力：' + CrossModel.curTroop;
            this.m_hpImg.width = 466 * (CrossModel.curTroop / maxTroop);
            this.addEvent();
        };
        CrossBarracksView.prototype.addEvent = function () {
            com_main.EventManager.addTouchTapListener(this.m_pAddBtn, this, this.onclickAddBtn);
        };
        CrossBarracksView.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        CrossBarracksView.prototype.onclickAddBtn = function (e) {
        };
        CrossBarracksView.NAME = 'CrossBarracksView';
        return CrossBarracksView;
    }(com_main.CView));
    com_main.CrossBarracksView = CrossBarracksView;
})(com_main || (com_main = {}));
