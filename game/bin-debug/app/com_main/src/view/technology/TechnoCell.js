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
    var TechnoCell = /** @class */ (function (_super_1) {
        __extends(TechnoCell, _super_1);
        function TechnoCell(id) {
            var _this = _super_1.call(this) || this;
            _this.isShowRed = true;
            _this.m_nId = id;
            _this.skinName = Utils.getSkinName("app/technology/TechnoCellSkin.exml");
            return _this;
        }
        TechnoCell.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        TechnoCell.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            this.removeUpLvEff();
            this.delTimeHandler();
            com_main.EventMgr.removeEventByObject(TechnologyEvent.TECHNOLOGY_INFO_UPDATE, this);
            com_main.EventMgr.removeEventByObject(TechnologyEvent.TECHNOLOGY_TIME_UP, this);
            _super_1.prototype.onDestroy.call(this);
        };
        TechnoCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            AnchorUtil.setAnchorCenter(this);
            this.m_tTechnoVo = TechnoModel.getTechVoById(this.m_nId);
            this.refreshView();
            com_main.EventMgr.addEvent(TechnologyEvent.TECHNOLOGY_INFO_UPDATE, this.onTechnoInfoUpdate, this);
            com_main.EventMgr.addEvent(TechnologyEvent.TECHNOLOGY_TIME_UP, this.onTechnoTimeUp, this);
            if (this.m_tTechnoVo && this.isShowRed)
                RedPointModel.AddInfoListener(this, { x: 131, y: 33 }, [RedEvtType.TECHNO], 3, { teachType: this.m_tTechnoVo.type, teachId: this.m_tTechnoVo.id });
        };
        /**升级 */
        TechnoCell.prototype.onTechnoTimeUp = function (id) {
            if (this.m_nId == id) {
                this.refreshLevel();
                this.refreshUpLvEffect();
            }
        };
        /**开启事件 */
        TechnoCell.prototype.openEvent = function () {
            com_main.EventManager.addTouchScaleListener(this, this, this.onCellClick);
        };
        /**刷新显示 */
        TechnoCell.prototype.onTechnoInfoUpdate = function (id) {
            if (this.m_nId == id) {
                this.refreshView();
            }
        };
        Object.defineProperty(TechnoCell.prototype, "technoId", {
            /**设置id */
            set: function (id) {
                if (this.m_nId == id)
                    return;
                this.m_nId = id;
                this.m_tTechnoVo = TechnoModel.getTechVoById(id);
                this.refreshView();
            },
            enumerable: true,
            configurable: true
        });
        /**点击回调 */
        TechnoCell.prototype.onCellClick = function () {
            Utils.open_view(TASK_UI.POP_TECHNOLOGY_PANEL, this.m_nId);
        };
        /**刷新显示 */
        TechnoCell.prototype.refreshView = function () {
            if (!this.m_tTechnoVo)
                return;
            var cfg = this.m_tTechnoVo.techCfg;
            this.m_labName.text = GLan(cfg.name);
            this.m_imgIcon.source = TechnoModel.getIcon(this.m_nId);
            this.refreshLevel();
            this.refreshUpLvEffect();
        };
        /**刷新升级特效 */
        TechnoCell.prototype.refreshUpLvEffect = function () {
            if (TechnoModel.isInUpLv(this.m_nId)) {
                this.createUpLvEff();
                this.addTimeHandler();
            }
            else {
                this.removeUpLvEff();
                this.delTimeHandler();
            }
        };
        /**刷新等级 */
        TechnoCell.prototype.refreshLevel = function () {
            if (this.m_tTechnoVo.level > 0 || TechnoModel.isInUpLv(this.m_nId)) {
                Utils.isGray(false, this.m_grayGroup);
                var levelStr = GCodeFromat(CLEnum.TEC_LEVEL_NUM, this.m_tTechnoVo.level, this.m_tTechnoVo.maxLevel);
                this.m_labLv.textFlow = Utils.htmlParser(levelStr);
            }
            else {
                this.m_labLv.text = this.m_tTechnoVo.level + "/" + this.m_tTechnoVo.maxLevel;
                Utils.isGray(true, this.m_grayGroup);
            }
        };
        /**显示升级特效 */
        TechnoCell.prototype.createUpLvEff = function () {
            if (!this.m_pEffect) {
                this.m_pEffect = ImageEffect.load_2(IETypes.ETechnology_UpGrade);
                this.m_pEffect.addBitmap(this.m_pEffectImage);
            }
            this.m_pEffectImage.visible = true;
        };
        /**移除特效 */
        TechnoCell.prototype.removeUpLvEff = function () {
            if (this.m_pEffect) {
                this.m_pEffect.removeAction();
                this.m_pEffect = null;
                this.m_pEffectImage.visible = false;
            }
        };
        /**添加倒计时 */
        TechnoCell.prototype.addTimeHandler = function () {
            Utils.TimerManager.remove(this.timeCall, this);
            this.m_pTimeRoot.visible = true;
            this.m_tTimeData = TechnoModel.getTimeData();
            Utils.TimerManager.doTimer(1000, 0, this.timeCall, this);
            this.timeCall();
        };
        /**移除倒计时 */
        TechnoCell.prototype.delTimeHandler = function () {
            this.m_pTimeRoot.visible = false;
            Utils.TimerManager.remove(this.timeCall, this);
            this.m_tTimeData = null;
        };
        /**倒计时回调 */
        TechnoCell.prototype.timeCall = function () {
            var time = this.m_tTimeData.end - this.m_tTimeData.speed - TimerUtils.getServerTime();
            this.m_labTime.text = Utils.DateUtils.getFormatBySecond(time, 1);
        };
        /**红点移除 */
        TechnoCell.prototype.removeRed = function () {
            this.isShowRed = false;
            RedPointModel.RemoveInfoListenerByCode(this.hashCode);
        };
        return TechnoCell;
    }(com_main.CComponent));
    com_main.TechnoCell = TechnoCell;
})(com_main || (com_main = {}));
