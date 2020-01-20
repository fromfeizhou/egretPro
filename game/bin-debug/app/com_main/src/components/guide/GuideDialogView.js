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
     * 剧情对话面板相关
     */
    var GuideDialogView = /** @class */ (function (_super_1) {
        __extends(GuideDialogView, _super_1);
        function GuideDialogView(id) {
            var _this = _super_1.call(this) || this;
            _this.name = GuideDialogView.NAME;
            _this.m_nId = id;
            _this.skinName = Utils.getComSkin("guide/guide_dialog_view_skin.exml");
            return _this;
        }
        GuideDialogView.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            if (this.m_mcList) {
                for (var i = 0; i < this.m_mcList.length; i++) {
                    this.m_mcList[i].destroy();
                }
                this.m_mcList = null;
            }
            egret.Tween.removeTweens(this.m_pRoot);
            egret.Tween.removeTweens(this.m_pIconRoot0);
            egret.Tween.removeTweens(this.m_pIconRoot1);
            Utils.TimerManager.remove(this.onTimeHandler, this);
            Sound.playGialogById(0, null, null);
            _super_1.prototype.onDestroy.call(this);
        };
        GuideDialogView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_pRoleRoot.mask = this.m_pMask;
            this.initCfgIcon();
        };
        /**初始化配置 和头像 */
        GuideDialogView.prototype.initCfgIcon = function () {
            var id = this.m_nId;
            //第一条特殊处理
            if (id == 1) {
                id = RoleData.countryId;
            }
            var cfg = C.GuideDialogConfig[id];
            if (!cfg) {
                this.closeDialog();
                return;
            }
            this.m_tDesList = JSON.parse(GLan(cfg.dialog));
            this.m_mcList = [];
            var icons = JSON.parse(cfg.generalId);
            var names = JSON.parse(GLan(cfg.name));
            for (var i = 0; i < icons.length; i++) {
                this.createIcon(cfg.type, icons[i], names[i], i);
            }
            this.m_soundList = cfg.sound.split('_');
            this.initView();
        };
        GuideDialogView.prototype.initView = function () {
            var _this = this;
            com_main.EventManager.addTouchTapListener(this.m_pBtnMask, this, this.onShowNext);
            //跳过处理
            com_main.EventManager.addTouchScaleListener(this.m_pSkipRoot, this, this.skipGuide);
            Utils.toStageBestScale(this.m_pRoot);
            this.m_nDesId = 0;
            this.onShowNext();
            //显示动画
            this.m_bAction = true;
            var tw = egret.Tween.get(this.m_pRoot);
            this.m_pRoot.alpha = 0;
            tw.to({ alpha: 1 }, 500, Ease.backOut);
            tw.call(function () {
                _this.m_bAction = false;
            }, this);
        };
        /**定时器 */
        GuideDialogView.prototype.onTimeHandler = function () {
            this.m_nDesDt--;
            if (this.m_nDesDt <= 0) {
                Utils.TimerManager.remove(this.onTimeHandler, this);
                this.onShowNext();
            }
        };
        /**创建形象 */
        GuideDialogView.prototype.createIcon = function (type, generalId, name, fix) {
            var root = this["m_pIconRoot" + fix];
            var genCard = this["m_genCard" + fix];
            var labName = this["m_labName" + fix];
            labName.text = name;
            if (generalId == 0) {
                root.visible = false;
                return;
            }
            genCard.setInfo(generalId, type == 1, false);
        };
        //显示下一句
        GuideDialogView.prototype.onShowNext = function () {
            if (this.m_bAction)
                return;
            if (this.m_nDesId >= this.m_tDesList.length) {
                this.closeDialog();
                return;
            }
            if (!this.m_pLbDec)
                return;
            var info = this.m_tDesList[this.m_nDesId];
            this.m_pLbDec.textFlow = Utils.htmlParser(info[1]);
            if (this.m_soundList && this.m_soundList[this.m_nDesId]) {
                var soundId = Number(this.m_soundList[this.m_nDesId]);
                Sound.playGialogById(soundId, this.soundComplete, this);
            }
            if (info[0] == 0) {
                this.currentState = 'left';
                this.toLowLight(true);
                this.doIconAction(this.m_pIconRoot0, true);
                this.doIconAction(this.m_pIconRoot1, false);
            }
            else {
                this.currentState = 'right';
                this.toLowLight(false);
                this.doIconAction(this.m_pIconRoot0, false);
                this.doIconAction(this.m_pIconRoot1, true);
            }
            this.m_nDesId++;
            //有音效的等音效播完再进入下个对话
            if (this.m_soundList && this.m_soundList[this.m_nDesId - 1]) {
            }
            else {
                this.autoClose(5);
            }
        };
        GuideDialogView.prototype.soundComplete = function () {
            this.autoClose(1);
        };
        GuideDialogView.prototype.autoClose = function (sec) {
            Utils.TimerManager.remove(this.onTimeHandler, this);
            this.m_nDesDt = sec;
            Utils.TimerManager.doTimer(1000, 0, this.onTimeHandler, this);
        };
        /**缩放 */
        GuideDialogView.prototype.doIconAction = function (root, isShow) {
            egret.Tween.removeTweens(root);
            var tw = egret.Tween.get(root);
            if (isShow) {
                tw.to({ scaleX: 1, scaleY: 1 }, 300, Ease.cubicOut);
            }
            else {
                tw.to({ scaleX: 0.9, scaleY: 0.9 }, 300, Ease.cubicOut);
            }
        };
        /**低亮 */
        GuideDialogView.prototype.toLowLight = function (isLeft) {
            if (isLeft) {
                this.m_genCard0.play();
                this.m_genCard1.stop();
            }
            else {
                this.m_genCard0.stop();
                this.m_genCard1.play();
            }
            Utils.isLowlight(!isLeft, this.m_genCard0);
            Utils.isLowlight(isLeft, this.m_genCard1);
        };
        /**跳过 */
        GuideDialogView.prototype.skipGuide = function () {
            this.closeDialog();
        };
        GuideDialogView.prototype.closeDialog = function () {
            Utils.TimerManager.remove(this.onTimeHandler, this);
            this.m_nDesId = 0;
            SceneManager.closeGuidePanelByName(GuideDialogView.NAME);
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_DIALOGUE_END, null);
        };
        GuideDialogView.NAME = 'GuideDialogView';
        return GuideDialogView;
    }(com_main.CView));
    com_main.GuideDialogView = GuideDialogView;
})(com_main || (com_main = {}));
