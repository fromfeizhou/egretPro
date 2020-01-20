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
    var CrossResultSucView = /** @class */ (function (_super_1) {
        __extends(CrossResultSucView, _super_1);
        function CrossResultSucView(data) {
            var _this = _super_1.call(this) || this;
            _this.name = CrossResultSucView.NAME;
            _this.m_data = data;
            _this.initApp("cross/result/CrossResultSucSkin.exml");
            return _this;
        }
        CrossResultSucView.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        CrossResultSucView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.width = GameConfig.curWidth();
            this.height = GameConfig.curHeight();
            this.addEvent();
            var itemList;
            if (this.m_data.isWin) {
                this.currentState = 'success';
                itemList = CrossModel.getCrossServerRewardConfig(6 /* WIN_SERVER */, this.m_data.duanWei).reward;
            }
            else {
                this.currentState = 'fail';
                itemList = CrossModel.getCrossServerRewardConfig(7 /* FAIL_SERVER */, this.m_data.duanWei).reward;
            }
            this.commitProperties();
            if (this.m_data.isWin) {
                for (var i in this.m_data.bestList) {
                    var name_1 = this.m_data.bestList[i];
                    this['m_best' + i].visible = true;
                    this['playerName' + i].text = name_1;
                }
            }
            for (var _i = 0, itemList_1 = itemList; _i < itemList_1.length; _i++) {
                var i = itemList_1[_i];
                var item = com_main.ComItemNew.create('count', true, true);
                item.setItemInfo(i.itemId, i.count);
                this.m_rewardList.addChild(item);
            }
        };
        CrossResultSucView.prototype.addEvent = function () {
            com_main.EventManager.addTouchTapListener(this.shake_group, this, this.onclick);
        };
        CrossResultSucView.prototype.onclick = function (e) {
            com_main.UpManager.history();
            SceneManager.crossResultRunScene();
        };
        CrossResultSucView.NAME = 'CrossResultSucView';
        return CrossResultSucView;
    }(com_main.CView));
    com_main.CrossResultSucView = CrossResultSucView;
})(com_main || (com_main = {}));
