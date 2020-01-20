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
    var GeneralFateCell = /** @class */ (function (_super_1) {
        __extends(GeneralFateCell, _super_1);
        function GeneralFateCell() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/fate/GeneralFateCellSkin.exml");
            return _this;
        }
        GeneralFateCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_pBtn, this, this.onClickTask);
        };
        GeneralFateCell.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        GeneralFateCell.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListener(this.m_pBtn);
        };
        //btn
        GeneralFateCell.prototype.onClickTask = function (e) {
            // if (this.m_fateVo.status != FateStatus.CAN_ACTIVE) return;
            // FateProxy.C2S_RELATION_EFFECT(this.m_fateVo.id);
            if (this.m_fateVo.status == FateStatus.CAN_ACTIVE) {
                FateProxy.C2S_RELATION_EFFECT(this.m_fateVo.id);
            }
            else {
                EffectUtils.showTips(GCodeFromat(CLEnum.FATE_STAR_TIP, Utils.getPropName(this.m_fateVo.disGeneralSoulList[0])), 1, true);
                Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_fateVo.disGeneralSoulList[0]);
            }
        };
        //MissionInfoVo
        GeneralFateCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_fateVo = this.data;
            var curActiveMaxCfg = FateModel.getCurFinshActiveFateCfg(this.m_fateVo.id);
            this.m_lbName.textFlow = Utils.htmlParser(curActiveMaxCfg.name);
            this.m_lbContent.textFlow = Utils.htmlParser(curActiveMaxCfg.Desc);
            var content = this.m_fateVo.level != 1 ? GCodeFromat(CLEnum.FATE_GEN_NEXT, FateModel.getNextFateStar(this.m_fateVo.id)) : GCodeFromat(CLEnum.FATE_GEN_ALL, FateModel.getNextFateStar(this.m_fateVo.id));
            this.m_lbStar.textFlow = Utils.htmlParser(content);
            this.m_lbStar.visible = FateModel.getNextFateStar(this.m_fateVo.id) != 0;
            if (this.m_fateVo.level == 1) {
                this.m_pBtn.setTitleLabel(GCode(CLEnum.FATE_GEN_ACTIVE));
            }
            else {
                this.m_pBtn.setTitleLabel(GCode(CLEnum.GEN_STRENG));
            }
            this.m_pBtn.visible = this.m_fateVo.status != FateStatus.FINISH_ACTIVE && this.m_fateVo.isOwnGeneral();
            this.m_pActiveState.visible = this.m_fateVo.status == FateStatus.FINISH_ACTIVE;
            this.m_pBtn.currentState = this.m_fateVo.status !== FateStatus.CAN_ACTIVE ? "style6" : "style1";
            this.m_lbStar.visible = this.m_fateVo.status != FateStatus.FINISH_ACTIVE && this.m_fateVo.isOwnGeneral();
            this.m_lbEffect.visible = this.m_fateVo.status != FateStatus.FINISH_ACTIVE && this.m_fateVo.level != 1;
            if (this.m_fateVo.status == FateStatus.FINISH_ACTIVE || this.m_fateVo.level > 1) {
                this.m_lbName.textColor = 0xe7c772;
                this.m_lbContent.textColor = 0xaac7ff;
            }
            else {
                this.m_lbName.textColor = 0x878585;
                this.m_lbContent.textColor = 0x878585;
            }
            var attrAdd = this.m_fateVo.fateCfg.effect.split("_");
            this.m_lbEffect.text = "" + Utils.getAttriNameByType(Number(attrAdd[0])) + "+" + ("" + attrAdd[1]);
            this.m_pro.removeChildren();
            this.m_phead.removeChildren();
            var triggerParameter = curActiveMaxCfg.triggerParameter.split(",");
            var activiState = this.m_fateVo.status == FateStatus.FINISH_ACTIVE || this.m_fateVo.level > 1 ? "unlock" : "lock";
            for (var index = 0; index < triggerParameter.length; index++) {
                var triggerArr = triggerParameter[index].split("_");
                if (index != triggerParameter.length - 1) {
                    var pro = com_main.FateProComp.create(activiState);
                    pro.x = 96 * (index + 1);
                    pro.y = 44;
                    this.m_pro.addChild(pro);
                }
            }
            this.m_pro.validateNow();
            for (var index = 0; index < triggerParameter.length; index++) {
                var genHead = com_main.GeneralHeadRender.create("fate");
                var triggerArr = triggerParameter[index].split("_");
                var hero = GeneralModel.getOwnGeneral(Number(triggerArr[0]));
                var star = hero.isOwn ? hero.star : 0;
                genHead.setGenViewInfo(Number(triggerArr[0]), 1, star);
                genHead.x = 170 * index;
                genHead.scaleX = 0.8;
                genHead.scaleY = 0.8;
                Utils.isGray(!hero.isOwn, genHead.Image_head);
                this.m_phead.addChild(genHead);
                // genHead.validateNow();
            }
            // egret.callLater(() => {
            // 	this.m_phead.validateNow();
            // }, this)
            // egret.setTimeout(() => {
            // 	this.m_phead.validateNow();
            // }, this, 100);
        };
        return GeneralFateCell;
    }(eui.ItemRenderer));
    com_main.GeneralFateCell = GeneralFateCell;
})(com_main || (com_main = {}));
