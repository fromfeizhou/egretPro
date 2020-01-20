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
// TypeScript file			this.m_imgCard.source = GeneralModel.getSoldierBigLogo(info.config.role)
var com_main;
(function (com_main) {
    /**
     * 世界解锁对话框
     */
    var WorldDialogView = /** @class */ (function (_super_1) {
        __extends(WorldDialogView, _super_1);
        function WorldDialogView(data) {
            var _this = _super_1.call(this, data.id) || this;
            _this.m_nCid = 0;
            _this.m_step = 1;
            _this.name = WorldDialogView.NAME;
            _this.m_nId = data.id;
            _this.m_nCid = data.cityId;
            _this.m_step = data.step;
            return _this;
        }
        WorldDialogView.prototype.initCfgIcon = function () {
            var cfg = C.GuideDialogConfig[201];
            if (!cfg) {
                this.closeDialog();
                return;
            }
            this.m_taskCfg = C.WorldMapUnlockTaskConfig[this.m_nId];
            this.m_tDesList = JSON.parse(GLan(cfg.dialog));
            this.m_mcList = [];
            var icons = JSON.parse(cfg.generalId);
            var names = JSON.parse(GLan(cfg.name));
            for (var i = 0; i < icons.length; i++) {
                this.createIcon(cfg.type, icons[i], names[i], i);
            }
            this.m_pSkipRoot.visible = false;
            this.initView();
            this.updateDialog();
        };
        WorldDialogView.prototype.updateDialog = function () {
            if (isNull(this.m_taskCfg))
                return;
            if (this.m_step == WorldLockTaskStep.STATR) {
                this.m_pLbDec.textFlow = Utils.htmlParser(GLan(this.m_taskCfg.UnlockText1));
            }
            else {
                this.m_pLbDec.textFlow = Utils.htmlParser(GLan(this.m_taskCfg.UnlockText3));
            }
        };
        WorldDialogView.prototype.closeDialog = function () {
            com_main.UpManager.history();
            if (this.m_step == WorldLockTaskStep.STATR) {
                Utils.open_view(TASK_UI.POP_WORLD_LOCK_TASK_PANEL, { id: this.m_nId, cityId: this.m_nCid });
            }
            else {
                Utils.open_view(TASK_UI.POP_WORLD_NEW_OPEN_PANEL, { id: this.m_nId, cityId: this.m_nCid });
            }
        };
        WorldDialogView.NAME = 'WorldDialogView';
        return WorldDialogView;
    }(com_main.GuideDialogView));
    com_main.WorldDialogView = WorldDialogView;
})(com_main || (com_main = {}));
