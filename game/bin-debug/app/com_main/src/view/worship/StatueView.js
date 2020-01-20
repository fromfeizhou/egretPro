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
/**雕像点击区域 */
var com_main;
(function (com_main) {
    var StatueView = /** @class */ (function (_super_1) {
        __extends(StatueView, _super_1);
        function StatueView(data) {
            var _this = _super_1.call(this) || this;
            _this.m_data = data;
            _this.skinName = Utils.getAppSkin("worship/StatueSkin.exml");
            return _this;
        }
        StatueView.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this, false);
            // EventManager.removeEventListeners(this);
        };
        StatueView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_comState.stateId = this.m_data.countryId;
            if (this.m_data.name == RoleData.nickName) {
                this.m_pName.textColor = 0x4bfe47;
            }
            else {
                this.m_pName.textColor = 0xff37ea;
            }
            this.m_pName.text = this.m_data.name;
            if (this.m_data.statueType == StatueType.BattleKing) {
                RedPointModel.AddInfoListener(this.m_title, { x: this.m_title.width - 10, y: 3 }, [RedEvtType.BATTLE_KING_WORSHIP], 3);
            }
            else {
                this.currentState = "modelKing";
            }
        };
        /**检测是否点中图标 */
        StatueView.prototype.check_is_touch = function (x, y) {
            var res = this.m_group.hitTestPoint(x, y, false);
            if (res)
                this.onClickStatue();
            return res;
        };
        StatueView.prototype.onDestroy = function () {
        };
        StatueView.prototype.onClickStatue = function () {
            switch (this.m_data.statueType) {
                case StatueType.BattleKing: {
                    Utils.open_view(TASK_UI.WORSHIP_PANEL);
                    return;
                }
            }
        };
        return StatueView;
    }(com_main.CComponent));
    com_main.StatueView = StatueView;
})(com_main || (com_main = {}));
