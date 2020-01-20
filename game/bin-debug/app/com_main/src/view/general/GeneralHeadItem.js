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
    var GeneralHeadItem = /** @class */ (function (_super_1) {
        __extends(GeneralHeadItem, _super_1);
        function GeneralHeadItem(param) {
            var _this = _super_1.call(this) || this;
            _this.renderType = 0; // 0是武将系统的  1是擂台系统的
            _this.suipianNum = 0;
            _this.needSuipian = 0;
            _this.m_bRedEvt = false;
            _this.m_generalId = param;
            if (_this.m_generalId) {
                _this.m_generalVo = GeneralModel.getOwnGeneral(_this.m_generalId);
                var soulId = _this.m_generalVo.config.itemId;
                _this.suipianNum = PropModel.getPropNum(_this.m_generalVo.config.itemId);
                _this.needSuipian = _this.m_generalVo.config.soul;
            }
            _this.skinName = Utils.getAppSkin("general/GeneralHeadItemRender.exml");
            return _this;
        }
        GeneralHeadItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.Image_head.mask = this.Image_mask;
            this.m_nProMaxWidth = this.Image_pro_yellow.width;
            this.refresh(this.m_generalId);
            if (this.m_generalVo && !this.m_generalVo.isOwn) {
                com_main.EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.onPropItemChange, this);
            }
        };
        /**红点监听 已拥有对象才创建 减低计算*/
        GeneralHeadItem.prototype.addRedPoint = function () {
            if (this.m_bRedEvt)
                return;
            this.m_bRedEvt = true;
            RedPointModel.AddInfoListener(this, { x: 102, y: -2 }, [RedEvtType.GEN_STAR, RedEvtType.GEN_SKILL, RedEvtType.GEN_LEVEL, RedEvtType.GEN_TUPODAN, RedEvtType.GEN_TREA_EQ, RedEvtType.GEN_FATE], 2, { generalId: this.generalId }, false);
        };
        /**移除红点 */
        GeneralHeadItem.prototype.removeRedPoint = function () {
            this.m_bRedEvt = false;
            RedPointModel.RemoveInfoListenerByCode(this.hashCode);
        };
        /**物品数量变化 */
        GeneralHeadItem.prototype.onPropItemChange = function (itemId) {
            if (this.m_generalVo && !this.m_generalVo.own && itemId == this.m_generalVo.config.itemId) {
                // debug(GeneralModel.getGeneralName(this.m_generalId),this.m_generalVo.config.itemId,itemId)
                this.refreshSoulItemNum();
            }
        };
        GeneralHeadItem.prototype.onDestroy = function () {
            this.setSkin(null);
            this.removeRedPoint();
            com_main.EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
        };
        Object.defineProperty(GeneralHeadItem.prototype, "generalId", {
            get: function () {
                return this.m_generalId;
            },
            set: function (id) {
                this.m_generalId = id;
                if (this.m_generalId)
                    this.m_generalVo = GeneralModel.getOwnGeneral(this.m_generalId);
                this.refresh(this.m_generalId);
            },
            enumerable: true,
            configurable: true
        });
        // public setBattleVisible(bool:boolean)
        // {
        // 	// this.Image_shangzhen.visible = bool;
        // }
        GeneralHeadItem.prototype.setType = function (type) {
            this.renderType = type;
        };
        GeneralHeadItem.prototype.refresh = function (generalId, isLevelupStar) {
            if (isLevelupStar) {
                this.m_generalId = generalId;
                this.m_generalVo = GeneralModel.getOwnGeneral(this.m_generalId);
            }
            if (!this.m_generalVo) {
                return;
            }
            var qualityLevel = this.m_generalVo.qualityLevel;
            if (qualityLevel > 5) {
                qualityLevel = 5;
            }
            else if (qualityLevel < 1) {
                qualityLevel = 1;
            }
            if (!this.m_generalVo.isOwn) {
                // qualityLevel = 0;
                Utils.isGray(true, this.Image_head);
            }
            else {
                Utils.isGray(false, this.Image_head);
            }
            this.Image_head.source = GeneralModel.getSoldierLogo(this.m_generalVo.config.role);
            this.Image_back_di.source = GeneralModel.getHeadItemBgByQuality(qualityLevel);
            this.lb_name_before.text = GeneralModel.getGeneralName(this.m_generalId);
            this.lb_name_before.textColor = Utils.getColorOfQuality(qualityLevel);
            if (this.m_generalId && this.m_generalVo) {
                //已经拥有的武将
                if (this.m_generalVo.own) {
                    this.currentState = "owner";
                    this.refreshLevelNum();
                    // if(this.renderType == 0)  //擂台的不处理
                    // {	
                    // 	this.Image_shangzhen.visible = this.m_generalVo.isOnBattle();
                    // }
                    this.refreshStar();
                    // if(isLevelupStar){
                    // 	this.Image_shangzhen.visible = false;
                    // }
                    this.addRedPoint();
                }
                else {
                    this.currentState = "collect";
                    this.refreshSoulItemNum();
                }
            }
        };
        /**刷新等级 */
        GeneralHeadItem.prototype.refreshLevelNum = function () {
            if (this.m_generalVo) {
                this.lb_level_before.text = GCodeFromat(CLEnum.LEVEL1, this.m_generalVo.level);
            }
        };
        /**刷新进度 */
        GeneralHeadItem.prototype.refreshSoulItemNum = function () {
            if (!this.m_generalVo)
                return;
            this.suipianNum = PropModel.getPropNum(this.m_generalVo.config.itemId);
            this.lb_suipian_num.text = this.suipianNum + "/" + this.needSuipian;
            var pro = Math.min(this.suipianNum / this.needSuipian, 1);
            this.Image_pro_yellow.width = this.m_nProMaxWidth * pro;
            if (this.suipianNum >= this.needSuipian) {
                this.m_groupCollectFlag.visible = true;
            }
            else {
                this.m_groupCollectFlag.visible = false;
            }
        };
        /**刷新星星 */
        GeneralHeadItem.prototype.refreshStar = function () {
            if (!this.m_generalVo)
                return;
            var startCfg = GeneralModel.getStarCfg(this.m_generalVo.star);
            var starNum = startCfg.starlevel;
            var res = GeneralModel.getStarRes(startCfg.starType);
            this.refreshStarBg(startCfg.starType);
            while (this.m_group_start.numChildren > starNum) {
                this.m_group_start.removeChildAt(0);
            }
            for (var i = this.m_group_start.numChildren; i < starNum; i++) {
                var star = new eui.Image(res);
                star.width = 23;
                star.height = 23;
                this.m_group_start.addChild(star);
            }
        };
        /**刷新星星背景 */
        GeneralHeadItem.prototype.refreshStarBg = function (type) {
            if (this.m_nStarType == type) {
                return;
            }
            this.m_nStarType = type;
            Utils.removeAllChild(this.m_group_startbg);
            Utils.removeAllChild(this.m_group_start);
            var res = GeneralModel.getStarBgRes(this.m_nStarType);
            for (var i = 0; i < 5; i++) {
                var star = new eui.Image(res);
                star.width = 23;
                star.height = 23;
                this.m_group_startbg.addChild(star);
            }
        };
        return GeneralHeadItem;
    }(eui.Component));
    com_main.GeneralHeadItem = GeneralHeadItem;
})(com_main || (com_main = {}));
