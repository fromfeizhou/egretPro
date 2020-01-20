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
    var HistoryBattlesRewardBox = /** @class */ (function (_super_1) {
        __extends(HistoryBattlesRewardBox, _super_1);
        function HistoryBattlesRewardBox(param) {
            var _this = _super_1.call(this) || this;
            _this.name = com_main.HeadQuartersRewardBox.NAME;
            return _this;
        }
        HistoryBattlesRewardBox.prototype.onDestroy = function () {
            if (this.m_pEffect) {
                this.m_pEffect.onDestroy();
                this.m_pEffect = null;
            }
            _super_1.prototype.onDestroy.call(this);
        };
        HistoryBattlesRewardBox.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        Object.defineProperty(HistoryBattlesRewardBox.prototype, "BoxId", {
            /** 访问器 - 宝箱ID */
            get: function () {
                if (this._config)
                    return this._config.id;
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HistoryBattlesRewardBox.prototype, "NeedStarOpen", {
            /** 访问器 - 打开宝箱所需星星数量 */
            get: function () {
                if (this._config)
                    return this._config.star;
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        /**获取奖励串 */
        HistoryBattlesRewardBox.prototype.GetAwards = function () {
            if (this._config) {
                return this._config.starReward;
            }
            return "";
        };
        /** 初始化宝箱 */
        HistoryBattlesRewardBox.prototype.InitBox = function (boxIdx) {
            this._boxIdx = boxIdx;
            this.SetBoxState(2);
        };
        /** 设置宝箱配置 */
        HistoryBattlesRewardBox.prototype.SetBoxConfig = function (config) {
            this._config = config;
            this.m_StarNum.text = this._config.star.toString();
        };
        /** 设置奖励宝箱状态。0-已领取，1-可领取，2-不可领取 */
        HistoryBattlesRewardBox.prototype.SetBoxState = function (state) {
            if (state == 0) {
                this.m_Box.visible = true;
                if (this.m_pEffect) {
                    this.m_pEffect.visible = false;
                }
            }
            else {
                if (!this.m_pEffect) {
                    this.m_pEffect = new com_main.BoxEffect(this._boxIdx + 1, state == 1);
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
            this.m_labRaward.visible = state == 0 ? true : false;
            this.m_nState = state;
        };
        /**获取宝箱状态 */
        HistoryBattlesRewardBox.prototype.GetBoxState = function () {
            return this.m_nState;
        };
        // private RANGE:number = 15;
        // private ActiveEffect():void{
        // 	egret.Tween.removeTweens(this.m_Box);
        //     Tween.get(this.m_Box,{loop:true})
        // 	.to({rotation:-this.RANGE},400)
        //     .to({rotation:0},400)
        //     .to({rotation:this.RANGE},400)
        //     .to({rotation:0},400);
        // }
        HistoryBattlesRewardBox.prototype.UnActiveEffect = function () {
            egret.Tween.removeTweens(this.m_Box);
        };
        HistoryBattlesRewardBox.NAME = 'HistoryBattlesRewardBox';
        return HistoryBattlesRewardBox;
    }(com_main.CComponent));
    com_main.HistoryBattlesRewardBox = HistoryBattlesRewardBox;
})(com_main || (com_main = {}));
