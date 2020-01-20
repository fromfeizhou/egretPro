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
    var GeneralHeadRender = /** @class */ (function (_super_1) {
        __extends(GeneralHeadRender, _super_1);
        function GeneralHeadRender(state) {
            var _this = _super_1.call(this) || this;
            _this.m_generalId = 0;
            _this.skinName = Utils.getSkinName("components/com_general_head_render.exml");
            _this.init(state);
            return _this;
        }
        GeneralHeadRender.create = function (state) {
            var obj = ObjectPool.pop(GeneralHeadRender, "GeneralHeadRender", state);
            obj.commitProperties();
            return obj;
        };
        /**对象池回收 */
        GeneralHeadRender.prototype.onPoolClear = function () {
            this.setSkin(null);
        };
        GeneralHeadRender.prototype.$onRemoveFromStage = function () {
            this.$setParent(null);
            Utils.isGray(false, this.Image_head);
            ObjectPool.push(this);
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        GeneralHeadRender.prototype.onDestroy = function () {
            if (this.$parent == null)
                return;
            Utils.removeFromParent(this);
            _super_1.prototype.onDestroy.call(this);
        };
        GeneralHeadRender.prototype.init = function (state) {
            if (state === void 0) { state = 'base'; }
            NodeUtils.reset(this);
            this.currentState = state;
            this.commitProperties();
        };
        GeneralHeadRender.prototype.createChildren = function () {
            _super_1.prototype.createChildren.call(this);
            this.Image_head.mask = this.Image_mask;
            // this.m_pRoot.cacheAsBitmap = true;
        };
        /**刷新士兵存量进度
         * @param 当前数量 num
         * @param 最大数量 maxNum
         * @param 是否上阵 isOnBatt
        */
        GeneralHeadRender.prototype.refreshArmyPro = function (num, maxNum, isOnBatt) {
            if (isOnBatt === void 0) { isOnBatt = false; }
            if (isOnBatt) {
                this.m_pLbTroops.text = "" + num;
                this.m_pProTroops.visible = true;
                var per = num / maxNum;
                this.m_pProTroops.scaleX = per > 1 ? 1 : per;
            }
            else {
                this.m_pLbTroops.text = "" + maxNum;
                this.m_pProTroops.visible = false;
            }
        };
        /**玩家拥有的武将 */
        GeneralHeadRender.prototype.setGenId = function (id) {
            this.m_generalId = id;
            this.m_generalVo = GeneralModel.getOwnGeneral(this.m_generalId);
            this.refresh();
        };
        /**非玩家拥有 */
        GeneralHeadRender.prototype.setGenViewInfo = function (generalId, level, starNum, qualityLevel, name) {
            if (level === void 0) { level = 1; }
            if (starNum === void 0) { starNum = 0; }
            var cfg = C.GeneralConfig[generalId];
            if (!cfg)
                return;
            if (this.Image_type) {
                this.Image_type.source = GeneralModel.getSoldierTypeIcon(cfg.generalOccupation, 2);
            }
            qualityLevel = qualityLevel || cfg.qualityLevel;
            name = name || GLan(cfg.name);
            this.Image_head.source = GeneralModel.getSoldierLogo(cfg.role);
            this.lb_name_before.text = name;
            this.lb_name_before.textColor = GeneralModel.getGeneralQualityColor(qualityLevel);
            this.m_pLbLv.text = GCodeFromat(CLEnum.LEVEL1, level);
            this.Image_back_di.source = GeneralModel.getComHeadItemBgByQuality(qualityLevel);
            this.refreshStar(starNum);
        };
        GeneralHeadRender.prototype.refresh = function () {
            if (!this.m_generalVo) {
                this.Image_head.source = GeneralModel.getSoldierLogo('0');
                this.Image_back_di.source = GeneralModel.getComHeadItemBgByQuality(0);
                return;
            }
            this.setGenViewInfo(this.m_generalId, this.m_generalVo.level, this.m_generalVo.star, this.m_generalVo.quality);
        };
        /**刷新星星 */
        GeneralHeadRender.prototype.refreshStar = function (starNum) {
            this.m_group_start.visible = starNum > 0;
            this.m_group_startbg.visible = starNum > 0;
            var startCfg = GeneralModel.getStarCfg(starNum);
            var starCount = startCfg.starlevel;
            var res = GeneralModel.getStarRes(startCfg.starType);
            this.refreshStarBg(startCfg.starType);
            while (this.m_group_start.numChildren > starCount) {
                this.m_group_start.removeChildAt(0);
            }
            for (var i = this.m_group_start.numChildren; i < starCount; i++) {
                var star = new eui.Image(res);
                star.width = 23;
                star.height = 23;
                this.m_group_start.addChild(star);
            }
        };
        /**刷新星星背景 */
        GeneralHeadRender.prototype.refreshStarBg = function (type) {
            // if (this.m_nStarType == type) {
            // 	return;
            // }
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
        GeneralHeadRender.prototype.showName = function () {
            this.lb_name_before.visible = true;
        };
        GeneralHeadRender.prototype.setViewState = function (state) {
            if (this.currentState != state) {
                this.currentState = state;
                this.commitProperties();
            }
        };
        return GeneralHeadRender;
    }(com_main.CComponent));
    com_main.GeneralHeadRender = GeneralHeadRender;
})(com_main || (com_main = {}));
