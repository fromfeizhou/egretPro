// TypeScript file
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
     * 战利品
     */
    var PatrolAwardView = /** @class */ (function (_super_1) {
        __extends(PatrolAwardView, _super_1);
        function PatrolAwardView(data) {
            var _this = _super_1.call(this) || this;
            _this.name = PatrolAwardView.NAME;
            _this.m_tAwards = data;
            _this.initApp("patrol/PatrolAwardViewSkin.exml");
            return _this;
        }
        PatrolAwardView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        PatrolAwardView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_apopUp.setTitleLabel(GCode(CLEnum.HAN_WAR_AWARD));
            this.m_btnGet.setTitleLabel(GCode(CLEnum.TAKE_OUT));
            if (!this.m_tAwards)
                return;
            this.m_listItem.itemRenderer = PropRender;
            var exp = 0;
            var copper = 0;
            var res = [];
            for (var i = 0; i < this.m_tAwards.length; i++) {
                var data = this.m_tAwards[i];
                if (data.itemId == PropEnum.EXP) {
                    exp += data.count;
                }
                else if (data.itemId == PropEnum.SILVER) {
                    copper += data.count;
                }
                else {
                    res.push(data);
                }
            }
            if (res.length > 0) {
                var collection = new eui.ArrayCollection(res);
                this.m_listItem.dataProvider = collection;
                this.m_labTips.visible = false;
            }
            else {
                this.m_labTips.visible = true;
            }
            this.m_labExp.text = "+" + exp;
            this.m_labCopper.text = "+" + copper;
            com_main.EventManager.addTouchScaleListener(this.m_btnGet, this, this.onBtnGet);
        };
        /**领取挂机 */
        PatrolAwardView.prototype.onBtnGet = function () {
            com_main.UpManager.history();
            if (this.m_tAwards && this.m_tAwards.length) {
                PatrolProxy.C2S_RECEIVE_PATROL_REWARD();
            }
        };
        /**=====================================================================================
         * 协议回调 begin
         * =====================================================================================
         */
        PatrolAwardView.prototype.listenerProtoNotifications = function () {
            return [];
        };
        /**处理协议号事件 */
        PatrolAwardView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
            }
        };
        PatrolAwardView.NAME = 'PatrolAwardView';
        return PatrolAwardView;
    }(com_main.CView));
    com_main.PatrolAwardView = PatrolAwardView;
    var PropRender = /** @class */ (function (_super_1) {
        __extends(PropRender, _super_1);
        function PropRender() {
            return _super_1.call(this) || this;
        }
        PropRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        PropRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_item = com_main.ComItemNew.create('count');
            this.addChild(this.m_item);
        };
        PropRender.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            if (this.m_tData) {
                this.m_item.setItemInfo(this.m_tData.itemId, this.m_tData.count);
            }
        };
        return PropRender;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
