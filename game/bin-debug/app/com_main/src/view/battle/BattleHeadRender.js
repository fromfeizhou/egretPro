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
    var BattleHeadRender = /** @class */ (function (_super_1) {
        __extends(BattleHeadRender, _super_1);
        function BattleHeadRender(arg) {
            var _this = _super_1.call(this) || this;
            _this.hpLen = 109;
            _this.m_flowTime = 0;
            _this.skinName = Utils.getAppSkin("battle_new/top_new/battle_head_render.exml");
            _this.m_flowTime = 0;
            _this.m_uVo = arg;
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onDestroy, _this);
            return _this;
        }
        BattleHeadRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        BattleHeadRender.prototype.init = function (arg) {
            this.m_flowTime = 0;
            this.m_uVo = arg;
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
            this.refreshView();
        };
        BattleHeadRender.prototype.getUnitId = function () {
            return this.m_uVo.elementId;
        };
        Object.defineProperty(BattleHeadRender.prototype, "flowTime", {
            get: function () {
                return this.m_flowTime;
            },
            set: function (num) {
                this.m_flowTime = num;
            },
            enumerable: true,
            configurable: true
        });
        BattleHeadRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.refreshView();
        };
        BattleHeadRender.prototype.refreshView = function () {
            var config = C.GeneralConfig[this.m_uVo.sysId];
            if (config) {
                //初始化头像信息				
                this.generalType.source = "gt_" + this.m_uVo.soldierType + "_png";
                this.generalHead.source = GeneralModel.getCircleLogo(config.role);
            }
            this.setBloodProgress(0);
            com_main.EventManager.addTouchScaleListener(this.generalHead, this, this.onClick);
            this.rageNum = this.m_uVo.anager; //怒气值
            this.maxRageNum = 10000; //parseInt(C.ConstantConfig[502].value); //最大怒气值
            this.hp = 1; //血量百分比
            Utils.isGray(false, this.generalHead);
            this.rage.visible = true;
            this.angerMaxEffect.visible = false;
            this.refreshRage();
            this.refreshBlood();
        };
        BattleHeadRender.prototype.onClick = function () {
            if (this.hp == 0) {
                EffectUtils.showTips(GCode(CLEnum.WAR_HERO_DEAD));
                return;
            }
            if (this.rageNum < this.maxRageNum) {
                EffectUtils.showTips(GCode(CLEnum.WAR_ANGRT_FAL));
                return;
            }
            var generalConfig = C.GeneralConfig[this.m_uVo.sysId];
            var skillid = Number(generalConfig.angerSkill.split("_")[0]);
            BattleProxy.send_BATTLE_USE_SKILL(this.m_uVo.elementId, skillid);
        };
        /**
         * 设置血条百分比 0~1;
         */
        BattleHeadRender.prototype.setBloodProgress = function (num) {
            this.bloodPro.width = this.hpLen * num;
        };
        /**
         * 设置怒气百分比 0~1;
         */
        BattleHeadRender.prototype.setRageProgress = function (num) {
            num = Math.max(0, num);
            num = Math.min(1, num);
            var index = Math.floor(num * 100 / 10);
            this.rage.source = "ra" + index + "_png";
            if (num >= 1) {
                this.angerMaxEffect.visible = true;
                if (!this.raAni) {
                    this.raAni = ImageEffect.load_2(IETypes.EBattle_Anger_Max);
                    this.raAni.addBitmap(this.angerMaxEffect);
                }
            }
            else {
                if (this.raAni) {
                    this.angerMaxEffect.visible = false;
                    this.raAni.removeAction();
                    this.raAni = null;
                }
            }
        };
        BattleHeadRender.prototype.closeRageProgress = function () {
            this.angerMaxEffect.visible = false;
            this.rage.visible = false;
            if (this.raAni) {
                this.raAni.removeAction();
                this.raAni = null;
            }
        };
        //增加怒气值
        BattleHeadRender.prototype.addRage = function (rage) {
            if (this.hp == 0) {
                return;
            }
            this.rageNum = Math.min(this.rageNum + rage, this.maxRageNum);
            this.refreshRage();
        };
        //设置怒气值
        BattleHeadRender.prototype.setRage = function (rage) {
            if (this.hp == 0) {
                return;
            }
            this.rageNum = rage;
            this.refreshRage();
        };
        //刷新怒气
        BattleHeadRender.prototype.refreshRage = function () {
            if (this.hp == 0) {
                return;
            }
            this.setRageProgress(this.rageNum / this.maxRageNum);
        };
        //初始化血条信息
        BattleHeadRender.prototype.refreshBlood = function () {
            this.setBloodProgress(this.m_uVo.getPercentHP());
        };
        //刷新血条信息
        BattleHeadRender.prototype.setHP = function (hp) {
            /**已经死亡的返回 */
            if (this.hp == 0)
                return;
            this.hp = hp;
            if (hp == 0) {
                Utils.isGray(true, this.generalHead);
                this.closeRageProgress();
            }
            this.setBloodProgress(hp / this.m_uVo.getMaxHp());
        };
        BattleHeadRender.prototype.onDestroy = function () {
            if (this.raAni) {
                this.raAni.removeAction();
                this.raAni = null;
            }
            com_main.EventManager.removeEventListeners(this);
            this.m_uVo = null;
            this.m_flowTime = 0;
        };
        return BattleHeadRender;
    }(com_main.CComponent));
    com_main.BattleHeadRender = BattleHeadRender;
})(com_main || (com_main = {}));
