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
    var BoxComponet = /** @class */ (function (_super_1) {
        __extends(BoxComponet, _super_1);
        function BoxComponet() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("activity/newGeneral/componet/BoxComponetSkin.exml");
            return _this;
        }
        BoxComponet.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            // this.init();
        };
        BoxComponet.prototype.onDestroy = function () {
            if (this.m_pEffect) {
                this.m_pEffect.onDestroy();
                this.m_pEffect = null;
            }
            _super_1.prototype.onDestroy.call(this);
        };
        //设置label显示
        BoxComponet.prototype.initLb = function (num, id) {
            this.m_lbDes.text = '第' + num + '个';
            this.m_id = id;
        };
        //获取宝箱id
        BoxComponet.prototype.getId = function () {
            return this.m_id;
        };
        /**获取宝箱状态 */
        BoxComponet.prototype.GetBoxState = function () {
            return this.m_nState;
        };
        /** 设置奖励宝箱状态。0-已领取，1-可领取，2-不可领取 */
        BoxComponet.prototype.SetBoxState = function (state) {
            if (state == 0) {
                this.m_Box.visible = true;
                if (this.m_pEffect) {
                    this.m_pEffect.visible = false;
                }
            }
            else {
                if (!this.m_pEffect) {
                    this.m_pEffect = new com_main.BoxEffect(3, state == 1);
                    this.m_pEffect.anchorOffsetX = this.m_pEffect.width * 0.5;
                    this.m_pEffect.anchorOffsetY = this.m_pEffect.height * 0.5;
                    this.m_pEffect.x = this.width * 0.5;
                    this.m_pEffect.y = this.height * 0.5;
                    this.addChildAt(this.m_pEffect, 1);
                }
                this.m_pEffect.setEffectEnable(state == 1);
                this.m_pEffect.visible = true;
                this.m_Box.visible = false;
            }
            this.m_nState = state;
        };
        return BoxComponet;
    }(com_main.CComponent));
    com_main.BoxComponet = BoxComponet;
})(com_main || (com_main = {}));
