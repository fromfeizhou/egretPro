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
    var SandTableCityTipsWnd = /** @class */ (function (_super_1) {
        __extends(SandTableCityTipsWnd, _super_1);
        function SandTableCityTipsWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.name = SandTableCityTipsWnd.NAME;
            _this.initApp("cross/sandTable/SandTableCityTipsSkin.exml");
            _this.m_data = param;
            return _this;
        }
        SandTableCityTipsWnd.prototype.listenerProtoNotifications = function () {
            return [];
        };
        SandTableCityTipsWnd.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
            }
        };
        SandTableCityTipsWnd.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        SandTableCityTipsWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.addEvent();
            this.initView();
        };
        /**添加监听事件 */
        SandTableCityTipsWnd.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnSure, this, this.onclickSure);
        };
        /**移除监听事件 */
        SandTableCityTipsWnd.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        SandTableCityTipsWnd.prototype.onclickSure = function () {
            com_main.UpManager.history();
        };
        /**初始化界面 */
        SandTableCityTipsWnd.prototype.initView = function () {
            if (isNull(this.m_data))
                return;
            var cCity = C.CrossServerCityConfig[this.m_data.id];
            var tName = CrossModel.getCrossCityTypeName(cCity.cityType);
            this.m_apopUp.setTitleLabel("\u3010" + tName + "\u3011" + cCity.cityName);
            this.m_btnSure.setTitleLabel(GCode(CLEnum.SURE));
            this.m_labCityLv.textFlow = Utils.htmlParser("<font color=#abb7d1>" + GCode(CLEnum.CROSS_CITY_LEVEL) + "</font><font color=#ffffff>" + GCodeFromat(CLEnum.CITY_BD_TITLE, cCity.cityType) + "</font>");
            this.m_labCityZone.textFlow = Utils.htmlParser("<font color=#abb7d1>" + GCode(CLEnum.CROSS_CAPTURE_ZONE) + "</font><font color=#ffffff>" + CrossModel.joinServerList(this.m_data.servers) + "</font>");
            this.addRewardHead(0, this.m_labEmperor);
            this.addRewardHead(1, this.m_labAllServer);
            this.addRewardHead(2, this.m_labDay);
            // 占领服皇帝奖励
            this.addRewardItem(0, 5 /* EMPEROR */);
            // 占领服全服奖励
            this.addRewardItem(1, 6 /* WIN_SERVER */);
            // 占领服每日奖励
            this.addRewardItem(2, 4 /* DAILY */);
        };
        /**添加奖励头 */
        SandTableCityTipsWnd.prototype.addRewardHead = function (type, lab) {
            if (isNull(this.m_data) || isNull(lab))
                return;
            var nNum = [CLEnum.EMPEROR_REWARD, CLEnum.ALL_SERVER_REWARD, CLEnum.DAY_REWARD];
            lab.textFlow = Utils.htmlParser("<font color=#abb7d1>" + GCode(CLEnum.CAPTURE_ZONE) + "</font><font color=#e7c772>" + GCode(nNum[type]) + "</font>");
        };
        /**添加奖励展示项 */
        SandTableCityTipsWnd.prototype.addRewardItem = function (idx, type) {
            if (isNull(this.m_data))
                return;
            var cCity = C.CrossServerCityConfig[this.m_data.id];
            var rewardCfg = CrossModel.getCrossServerRewardConfig(type, cCity.cityType);
            var rewardList0 = rewardCfg.reward;
            if (isNull(rewardList0) || rewardList0.length == 0)
                return;
            for (var i = 0; i < rewardList0.length; i++) {
                var item = rewardList0[i];
                var itemView = com_main.ComItemNew.create("count");
                itemView.scaleX = itemView.scaleY = 0.8;
                itemView.setItemInfo(item.itemId, item.count);
                this["m_pItemsRoot" + idx].addChild(itemView);
            }
        };
        SandTableCityTipsWnd.NAME = 'SandTableCityTipsWnd';
        return SandTableCityTipsWnd;
    }(com_main.CView));
    com_main.SandTableCityTipsWnd = SandTableCityTipsWnd;
})(com_main || (com_main = {}));
