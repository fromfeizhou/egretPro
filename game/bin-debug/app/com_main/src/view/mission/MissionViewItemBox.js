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
    var MissionViewItemBox = /** @class */ (function (_super_1) {
        __extends(MissionViewItemBox, _super_1);
        function MissionViewItemBox() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/mission/MissionViewItemBoxSkin.exml");
            return _this;
        }
        MissionViewItemBox.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_groupBase, this, this.onClickItem);
        };
        MissionViewItemBox.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        MissionViewItemBox.prototype.onDestroy = function () {
            if (this.m_pEffect) {
                this.m_pEffect.onDestroy();
                this.m_pEffect = null;
            }
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        //活跃度领取
        MissionViewItemBox.prototype.onClickItem = function (e) {
            var info = MissionModel.getActiveInfoById(this.m_index);
            switch (info.state) {
                case 0: {
                    Utils.open_view(TASK_UI.NOR_BOX_INFO_PANEL, { awards: this.m_pCfg.Reward });
                    break;
                }
                case 1: {
                    MissionProxy.send_MISSION_ACTIVE_REWAED(this.m_index);
                    break;
                }
                case 2: {
                    EffectUtils.showTips(GCode(CLEnum.TAKE_OUT_END), 1, true);
                    break;
                }
            }
        };
        MissionViewItemBox.prototype.init = function (id) {
            this.m_index = id;
            this.m_pCfg = C.LivesRewardConfig[id];
            this.m_pLbValue.text = this.m_pCfg.liveness + "";
        };
        /**激活状态 0-不能领取 1-可领取 2-已领取 */
        MissionViewItemBox.prototype.updateCell = function () {
            var info = MissionModel.getActiveInfoById(this.m_index);
            if (info.state == 2) {
                this.m_ActiveRoot.visible = true;
                if (this.m_pEffect) {
                    this.m_pEffect.onDestroy();
                    Utils.removeFromParent(this.m_pEffect);
                    this.m_pEffect = null;
                }
            }
            else {
                this.m_ActiveRoot.visible = false;
                this.showEffect(info.state);
            }
        };
        MissionViewItemBox.prototype.showEffect = function (state) {
            var tempType = 1;
            if (this.m_index <= 2)
                tempType = 1;
            else if (this.m_index <= 4) {
                tempType = 2;
            }
            else {
                tempType = 3;
            }
            var isShowEffect = false;
            if (state == 1) {
                isShowEffect = true;
            }
            if (!this.m_pEffect) {
                this.m_pEffect = new BoxEffect(tempType, isShowEffect);
                this.m_pEffect.anchorOffsetX = this.m_pEffect.width * 0.5;
                this.m_pEffect.anchorOffsetY = this.m_pEffect.height * 0.5;
                this.m_pEffect.x = 60;
                this.m_pEffect.y = 74;
                this.m_groupBase.addChild(this.m_pEffect);
            }
            this.m_pEffect.setEffectEnable(isShowEffect);
        };
        return MissionViewItemBox;
    }(com_main.CComponent));
    com_main.MissionViewItemBox = MissionViewItemBox;
    var BoxEffect = /** @class */ (function (_super_1) {
        __extends(BoxEffect, _super_1);
        function BoxEffect(boxType, isShowEffect) {
            var _this = _super_1.call(this) || this;
            _this.m_pCurloadCount = 0;
            _this.m_pIsShowEffect = false;
            _this.skinName = Utils.getSkinName("app/mission/BoxEffectSkin.exml");
            if (isShowEffect) {
                _this.m_pIsShowEffect = isShowEffect;
            }
            if (boxType) {
                _this.m_pBoxType = boxType;
            }
            return _this;
        }
        BoxEffect.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_pMCList = [];
            this.m_pBoxEffect.addEventListener("complete", this.actionComplete, this);
            this.setEffectEnable(this.m_pIsShowEffect);
        };
        BoxEffect.prototype.setEffectEnable = function (isShowEffect) {
            if (isShowEffect === void 0) { isShowEffect = false; }
            if (isShowEffect)
                this.m_pBoxEffect.play(0);
            else
                this.m_pBoxEffect.stop();
            this.m_pIsShowEffect = isShowEffect;
            var iconPath = "bx-bu_png";
            switch (this.m_pBoxType) {
                case 1: {
                    iconPath = !isShowEffect ? "bx-bu_png" : "bx-bul_png";
                    break;
                }
                case 2: {
                    iconPath = !isShowEffect ? "bx-lan_png" : "bx-lanl_png";
                    break;
                }
                case 3: {
                    iconPath = !isShowEffect ? "bx-jin_png" : "bx-jinl_png";
                    break;
                }
            }
            this.m_pIcon.source = iconPath;
            if (isShowEffect && this.m_pMCList.length == 0) {
                this.initAnimation();
            }
            for (var index = 0; index < this.m_pMCList.length; index++) {
                this.m_pMCList[index].visible = this.m_pIsShowEffect;
            }
        };
        BoxEffect.prototype.initAnimation = function () {
            this.m_pCurloadCount = 0;
            // this.m_pMC0 = new MCDragonBones();
            // this.m_pMC0.initAsync(IETypes.EUI_BoxEffect01);
            // this.m_pMC0.addLoadCompleteEvent(()=>{
            // 	this.m_pCurloadCount++;
            // 	if(this.m_pCurloadCount==2){
            // 		this.onShowEffect();
            // 	}
            // },this);
            // this.m_pMC0.play(IETypes.EUI_BoxEffect01,0);
            // this.m_pEffectRoot.addChildAt(this.m_pMC0,0);
            this.createMc(IETypes.EUI_BoxEffect01, 0);
            this.createMc(IETypes.EUI_BoxEffect02, 2);
        };
        BoxEffect.prototype.createMc = function (mcName, layerIndex) {
            var _this = this;
            var tempMc = new MCDragonBones();
            tempMc.initAsync(mcName);
            tempMc.addLoadCompleteEvent(function () {
                _this.m_pCurloadCount++;
                if (_this.m_pCurloadCount == 2) {
                    _this.onShowEffect();
                }
            }, this);
            tempMc.x = this.m_pEffectRoot.width * 0.5;
            tempMc.y = this.m_pEffectRoot.height * 0.5;
            tempMc.play(mcName, 0);
            this.m_pEffectRoot.addChildAt(tempMc, layerIndex);
            this.m_pMCList.push(tempMc);
        };
        //动画加载完成
        BoxEffect.prototype.onShowEffect = function () {
            this.m_pBoxEffect.play(0);
        };
        //tween完成
        BoxEffect.prototype.actionComplete = function () {
            if (this.m_pBoxEffect)
                this.m_pBoxEffect.play(0);
            else {
                error("动画回调没用清除--------------------------");
            }
        };
        BoxEffect.prototype.onDestroy = function () {
            if (this.m_pEffectRoot) {
                egret.Tween.removeTweens(this.m_pEffectRoot);
                this.m_pBoxEffect.removeEventListener("complete", this.actionComplete, this);
                this.m_pBoxEffect = null;
            }
            if (this.m_pMCList) {
                for (var index = 0; index < this.m_pMCList.length; index++) {
                    var mc = this.m_pMCList[index];
                    mc.destroy();
                }
                this.m_pMCList = null;
            }
            _super_1.prototype.onDestroy.call(this);
        };
        return BoxEffect;
    }(com_main.CComponent));
    com_main.BoxEffect = BoxEffect;
})(com_main || (com_main = {}));
