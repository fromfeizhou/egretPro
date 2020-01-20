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
    var LegionTechWnd = /** @class */ (function (_super_1) {
        __extends(LegionTechWnd, _super_1);
        function LegionTechWnd(data) {
            var _this = _super_1.call(this) || this;
            /**科技类型 */
            _this.m_nType = null;
            _this.m_nType = (data && data.type) || 1;
            _this.name = LegionTechWnd.NAME;
            _this.initApp("legion/LegionTechWndSkin.exml");
            return _this;
        }
        LegionTechWnd.prototype.onDestroy = function () {
            this.removeEvent();
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        LegionTechWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_PopUp.setTitleLabel(GCode(CLEnum.GUILD_TITEL_TECH));
            this.refreshView();
            this.addEvent();
        };
        /**刷新界面 */
        LegionTechWnd.prototype.refreshView = function () {
            var vo = LegionModel.getTeachVoByType(this.m_nType);
            if (!vo)
                return;
            this.m_labName.text = vo.name;
            this.m_imgIcon.source = vo.cfg.icon + '_png';
            /**贡献材料设置 */
            var cfg = C.GuildDonationConfig[this.m_nType];
            var itemGold = Utils.parseCommonItemJson(cfg.expend1)[0];
            this.m_btnGold.setCostImg(RoleData.GetMaterialIconPathById(itemGold.itemId));
            this.m_btnGold.setTitleLabel(GCode(CLEnum.GUILD_DONATE));
            this.m_btnGold.setCostLabel(itemGold.count.toString());
            var itemNor = Utils.parseCommonItemJson(cfg.expend2)[0];
            this.m_btnNor.setCostImg(RoleData.GetMaterialIconPathById(itemNor.itemId));
            this.m_btnNor.setTitleLabel(GCode(CLEnum.GUILD_DONATE));
            this.m_btnNor.setCostLabel(itemNor.count.toString());
            var award = Utils.parseCommonItemJson(cfg.gain)[0];
            this.m_labAwardScore.text = "" + award.count;
            this.m_labAwardExp.text = "" + cfg.guild_exp;
            this.refreshCount();
            this.refreshExp();
        };
        /**经验刷新 */
        LegionTechWnd.prototype.refreshExp = function () {
            var vo = LegionModel.getTeachVoByType(this.m_nType);
            if (!vo)
                return;
            this.m_labLevel.text = vo.level.toString();
            this.m_labCurDes.text = vo.des;
            this.maxExp = vo.maxExp;
            if (this.maxExp > 0) {
                this.m_labExp.text = vo.exp + "/" + this.maxExp;
                this.m_imgPro.width = (vo.exp / this.maxExp) * LegionTechWnd.PRO_MAX;
                this.m_labNextDes.text = vo.nextDes;
            }
            else {
                this.m_labExp.text = GCode(CLEnum.LEVEL_MAX1);
                this.m_imgPro.width = LegionTechWnd.PRO_MAX;
                this.m_labNextDes.text = GCode(CLEnum.NONE);
            }
        };
        //捐献次数刷新
        LegionTechWnd.prototype.refreshCount = function () {
            var curNum = LegionModel.getdonateResourceCount();
            var maxNum = LegionModel.getDonaMaxNum();
            var leftNum = maxNum - curNum;
            var isEmpty = leftNum == 0;
            this.m_labTimeVal.text = isEmpty ? GCode(CLEnum.GUILD_DONATE_NONE) : leftNum + "/" + maxNum;
            this.m_btnNor.enabled = !isEmpty;
            Utils.isGray(isEmpty, this.m_btnNor);
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        LegionTechWnd.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(LegionEvent.LEGION_TECH_UPDATE, this.onTechUpdate, this);
            com_main.EventManager.addTouchScaleListener(this.m_btnGold, this, this.onBtnGoldHandler);
            com_main.EventManager.addTouchScaleListener(this.m_btnNor, this, this.onBtnNorHandler);
        };
        LegionTechWnd.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(LegionEvent.LEGION_TECH_UPDATE, this);
        };
        /**金币升级 */
        LegionTechWnd.prototype.onBtnGoldHandler = function () {
            var cfg = C.GuildDonationConfig[this.m_nType];
            var info = Utils.parseCommonItemJson(cfg.expend1)[0];
            if (this.maxExp > 0) {
                if (PropModel.isItemEnough(info.itemId, info.count, 1)) {
                    LegionProxy.send_GUILD_TECH_DONATE(this.m_nType, 1); //捐献请求 参数tag 1金币  2材料
                }
            }
            else {
                EffectUtils.showTips(GCode(CLEnum.LEVEL_MAX1), 1, true);
            }
        };
        /**材料升级 */
        LegionTechWnd.prototype.onBtnNorHandler = function () {
            var cfg = C.GuildDonationConfig[this.m_nType];
            var info = Utils.parseCommonItemJson(cfg.expend2)[0];
            if (this.maxExp > 0) {
                if (PropModel.isItemEnough(info.itemId, info.count, 1) && this.maxExp > 0) {
                    LegionProxy.send_GUILD_TECH_DONATE(this.m_nType, 2); //捐献请求 参数tag 1金币  2材料
                }
            }
            else {
                EffectUtils.showTips(GCode(CLEnum.LEVEL_MAX1), 1, true);
            }
        };
        /**科技更新 */
        LegionTechWnd.prototype.onTechUpdate = function (type) {
            if (this.m_nType != type)
                return;
            this.refreshExp();
        };
        /**=====================================================================================
          * 事件监听 end
          * =====================================================================================
          */
        LegionTechWnd.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.GUILD_TECH_DONATE,
            ];
        };
        /**处理协议号事件 */
        LegionTechWnd.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.GUILD_TECH_DONATE: { // 联盟捐献
                    this.refreshCount();
                    break;
                }
            }
        };
        LegionTechWnd.NAME = 'LegionTechWnd';
        LegionTechWnd.PRO_MAX = 430;
        return LegionTechWnd;
    }(com_main.CView));
    com_main.LegionTechWnd = LegionTechWnd;
})(com_main || (com_main = {}));
