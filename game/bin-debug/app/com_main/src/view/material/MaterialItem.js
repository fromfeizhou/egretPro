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
    var MaterialItem = /** @class */ (function (_super_1) {
        __extends(MaterialItem, _super_1);
        function MaterialItem() {
            var _this = _super_1.call(this) || this;
            _this.m_copyId = 0;
            _this.m_copyInfo = null;
            _this.m_bIsGary = false;
            _this.skinName = Utils.getSkinName("app/material/MaterialItemSkin.exml");
            return _this;
        }
        MaterialItem.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        MaterialItem.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        MaterialItem.prototype.createChildren = function () {
            _super_1.prototype.createChildren.call(this);
            this.m_imgCard.mask = this.m_mask;
            this.initEvent();
        };
        MaterialItem.prototype.initEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnFight, this, this.onBtnFight);
            com_main.EventManager.addTouchScaleListener(this.m_imgLocked, this, this.onImgLock);
        };
        MaterialItem.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        /**设置材料副本信息 */
        MaterialItem.prototype.setItemInfo = function (type, id) {
            this.m_nType = type;
            this.m_copyId = id;
            this.copyCfg = C.MaterialConfig[this.m_copyId];
            this.refreshMaterialView();
            this.rewardShow();
        };
        /**刷新 */
        MaterialItem.prototype.refreshMaterialView = function () {
            this.refreshCard();
            this.openLv = this.copyCfg.playerLevel;
            var isOpen = RoleData.level >= this.openLv;
            // this.m_pSingleAward.visible = isOpen;
            this.m_labPass.text = "";
            var isPass = MaterialModel.ifMaterialpass(this.m_copyId);
            this.m_imgLocked.visible = !isOpen;
            if (isOpen && isPass) {
                Utils.isGray(false, this.m_imgCard);
                this.m_black.visible = false;
            }
            else {
                this.m_black.visible = true;
            }
            this.m_btnFight.visible = true;
            var boo = MaterialModel.ifMateialPass(this.m_copyId);
            this.m_copyInfo = MaterialModel.getMaterialItemInfo(this.copyCfg.type);
            if (this.m_copyInfo && boo) {
                this.m_btnFight.currentState = 'style6';
                this.m_btnState = BtnState.SWEEPING;
                this.m_btnFight.setTitleLabel(GCode(CLEnum.MAT_SWEEP_FREE));
            }
            else {
                this.m_btnFight.currentState = 'style1';
                this.m_btnState = BtnState.CHALLANGE;
                if (!isOpen) {
                    this.m_pRoot.touchChildren = false;
                    this.m_btnFight.visible = false;
                    this.m_labPass.text = GCodeFromat(CLEnum.FUNC_OPEN_LIMIT, this.openLv);
                }
                else {
                    if (!isPass) {
                        var lastCfg = C.MaterialConfig[this.copyCfg.prev];
                        this.m_labPass.text = GCodeFromat(CLEnum.MAT_TIPS_TGKQ, lastCfg.name);
                        this.m_pRoot.touchChildren = false;
                        this.m_btnFight.visible = false;
                        return;
                    }
                    this.m_btnFight.setTitleLabel(GCode(CLEnum.CAMP_FIGHT));
                    this.m_pRoot.touchChildren = true;
                }
            }
            // RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_btnFight, { x: 116, y: -3, scale: 0.78 }, [ MaterialModel.redTpye[this.copycfg.type]], 2, { id: this.m_copyId })
        };
        /**刷新卡片 */
        MaterialItem.prototype.refreshCard = function () {
            if (!this.copyCfg)
                return;
            this.m_labTile.text = GLan(this.copyCfg.name);
            this.m_comFightItem.setFight(this.copyCfg.power);
            if (this.copyCfg.scenetype == 1) {
                var cfg = GeneralModel.getGeneralConfig(this.copyCfg.model);
                this.m_imgCard.source = GeneralModel.getSoldierBigLogo(cfg.role);
            }
            else {
                this.m_imgCard.source = "arena_item_stage_" + this.copyCfg.model + "_jpg";
            }
            this.m_imgCard.width = this.copyCfg.scenetype == 1 ? 580 : 314;
            this.m_imgCard.height = this.copyCfg.scenetype == 1 ? 755 : 529;
            this.m_imgCard.scaleX = this.copyCfg.scenetype == 1 ? 0.7 : 1;
            this.m_imgCard.scaleY = this.copyCfg.scenetype == 1 ? 0.7 : 1;
            this.m_labLevel.text = GCodeFromat(CLEnum.LEVEL1, this.copyCfg.grade);
        };
        /**奖励显示 */
        MaterialItem.prototype.rewardShow = function () {
            Utils.removeAllChild(this.m_pItemsRoot);
            var awardInfos = Utils.parseCommonItemJson(this.copyCfg.reward);
            for (var i = 0; i < awardInfos.length; i++) {
                var info = awardInfos[i];
                var itemView = com_main.ComItemNew.create('count');
                itemView.setItemInfo(info.itemId, info.count);
                itemView.scaleX = 0.75;
                itemView.scaleY = 0.75;
                this.m_pItemsRoot.addChild(itemView);
            }
        };
        MaterialItem.prototype.setViewState = function (state) {
            if (this.currentState != state)
                this.currentState = state;
        };
        /**当前挑战为0是按钮判断*/
        MaterialItem.prototype.getBtnAddState = function (type) {
            var resideNum = 0;
            var cfg = C.MaterialTypeConfig[type];
            var vipCfg = C.VipPrivillegesConfig[cfg.vipBuyPrivilege];
            var buyMax = Number(vipCfg['vip' + RoleData.vipLevel]); //最大购买数量
            var currCfg = MaterialModel.getMaterialItemInfo(type);
            var m_maxCount = C.MaterialTypeConfig[type].freeCount;
            var m_num = 0; //已使用次数
            var m_buyNum = 0; //已购买次数
            if (cfg) {
                m_num = currCfg.used;
                m_buyNum = currCfg.bought;
            }
            var m_coinPrice = Utils.parseCommonItemJson(cfg.buyPrice)[0];
            var info = MaterialModel.getMaterialItemInfo(type);
            if (info) {
                resideNum = buyMax - info.bought; //剩余购买次数
            }
            else {
                resideNum = buyMax;
            }
            if ((m_maxCount - m_num + m_buyNum) >= m_maxCount) {
                EffectUtils.showTips(GCode(CLEnum.MAT_FIGHT_MAX), 1, true);
                return;
            }
            if (resideNum > 0) {
                Utils.open_view(TASK_UI.MATERIAL_INFO__BUY_DLG, { synum: resideNum, useNum: m_num, maxCount: m_maxCount, itemId: m_coinPrice.itemId, price: m_coinPrice.count, type: type });
            }
            else
                EffectUtils.showTips(GCode(CLEnum.MAT_TIPS_GMCS), 1, true);
        };
        MaterialItem.prototype.onImgLock = function () {
            EffectUtils.showTips(GCodeFromat(CLEnum.FUNC_OPEN_LIMIT, this.openLv), 1, true);
        };
        /**
       * 挑战事件
       */
        MaterialItem.prototype.onBtnFight = function (e) {
            var currCount = MaterialModel.getCurrCount(this.m_nType);
            if (currCount <= 0) {
                if (platform.isHidePayFunc()) {
                    EffectUtils.showTips("挑战次数不足");
                }
                else {
                    MaterialModel.showMaterialBuyWnd(this.m_nType);
                }
                return;
            }
            switch (this.m_btnState) {
                case BtnState.CHALLANGE:
                    Utils.open_view(TASK_UI.POS_CAMP_VIEW, { type: CheckPointType.MATERIAL, battleId: this.m_copyId, copyType: this.m_nType });
                    break;
                case BtnState.SWEEPING:
                    MaterialProxy.C2S_MATERIAL_CHALLENGE(this.m_copyId, true); //扫荡
                    break;
            }
        };
        return MaterialItem;
    }(com_main.CComponent));
    com_main.MaterialItem = MaterialItem;
})(com_main || (com_main = {}));
