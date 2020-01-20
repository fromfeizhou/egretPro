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
    var BattleSkillName1 = /** @class */ (function (_super_1) {
        __extends(BattleSkillName1, _super_1);
        function BattleSkillName1(csquare, avo) {
            var _this = _super_1.call(this) || this;
            _this.m_maskLight = new com_main.LightMask();
            // this.skinName = Utils.getAppSkin("battle_new/skill/battle_skill_start_name_1.exml");
            _this.m_csquare = csquare;
            _this.m_oldPosition = new egret.Point(_this.m_csquare.x, _this.m_csquare.y);
            csquare.mapPos = _this.m_oldPosition;
            _this.m_avo = avo;
            // csquare.findEnd();
            BattleModel.setIsStopPlay(true);
            _this.showEffect();
            return _this;
        }
        BattleSkillName1.prototype.showEffect = function () {
            var _this = this;
            var width = egret.MainContext.instance.stage.stageWidth;
            var height = egret.MainContext.instance.stage.stageHeight;
            this.width = width;
            this.height = height;
            var globalPoint = this.m_csquare.parent.localToGlobal(this.m_csquare.x, this.m_csquare.y);
            this.addChild(this.m_csquare);
            this.m_csquare.removeTween();
            this.m_csquare.setXY(globalPoint.x, globalPoint.y);
            this.m_csquare.startSkillEffect(this.m_avo.getSkillConfig().skillEffectId, false);
            // let container: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
            // let bg: egret.Bitmap = new egret.Bitmap(RES.getRes("border_006_png"));
            // bg.alpha = 0.6;
            // let stage = egret.MainContext.instance.stage;
            // NodeUtils.setSize(bg, { width: stage.stageWidth, height: stage.stageHeight });
            // //挖空的大小图片
            // let texture = RES.getRes("Battle_skill_light_png");
            // let sp = new egret.Bitmap(texture);
            // NodeUtils.setSize(sp, { width: 739, height: 739 });
            // NodeUtils.setPosition(sp, 0, 0);
            // sp.anchorOffsetX = sp.anchorOffsetY = 370;
            // sp.x = globalPoint.x;
            // sp.y = globalPoint.y - 50;
            // sp.scaleX = sp.scaleY = 0.8;
            // container.addChild(bg);
            // container.addChild(sp);
            // sp.blendMode = egret.BlendMode.ERASE;
            // let renderTexture: egret.RenderTexture = new egret.RenderTexture();
            // renderTexture.drawToTexture(container);
            // let bitmap: egret.Bitmap = new egret.Bitmap(renderTexture);
            // this.addChildAt(bitmap,0);
            this.m_maskLight.setMaskSize(width, height);
            this.m_maskLight.setLightValue(200);
            this.addChild(this.m_maskLight);
            this.m_maskLight.x = 0;
            this.m_maskLight.y = 0;
            this.m_maskLight.setLightPos(globalPoint.x, globalPoint.y - 50);
            var time = ConstUtil.getValue(IConstEnum.BATTLE_SKILL_BLACK_TIME);
            egret.Tween.get(this.m_maskLight).wait(time - 300).to({ alpha: 0 }, 300).call(function () {
                if (_this.m_csquare.mapPos) {
                    com_main.BattleSceneMgr.getInstance().addChildToWorld(_this.m_csquare);
                    _this.m_csquare.x = _this.m_csquare.mapPos.x;
                    _this.m_csquare.y = _this.m_csquare.mapPos.y;
                    _this.m_csquare.mapPos = null;
                }
                Utils.removeFromParent(_this);
                BattleModel.setIsStopPlay(false);
            });
            var skillNameFrame = new com_main.SmallActiveSkillName(this.m_avo, this.m_csquare);
            skillNameFrame.y = 20 + this.m_csquare.y - this.m_csquare.anchorOffsetY - 35;
            skillNameFrame.x = 50 + this.m_csquare.x - this.m_csquare.anchorOffsetX;
            this.addChild(skillNameFrame);
        };
        return BattleSkillName1;
    }(egret.DisplayObjectContainer));
    com_main.BattleSkillName1 = BattleSkillName1;
})(com_main || (com_main = {}));
