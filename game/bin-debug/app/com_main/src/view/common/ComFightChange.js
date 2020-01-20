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
    var ComFightChange = /** @class */ (function (_super_1) {
        __extends(ComFightChange, _super_1);
        function ComFightChange(fight) {
            var _this = _super_1.call(this) || this;
            _this.name = ComFightChange.NAME;
            _this.m_nFightVal = fight;
            _this.skinName = Utils.getAppSkin("common/ComFightChangeSkin.exml");
            return _this;
        }
        ComFightChange.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            // SceneManager.onSceneWndEnter();
            Utils.TimerManager.remove(this.onLaterHandler, this);
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        ComFightChange.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.actionGroup.removeEventListener("complete", this.onPlayComplete, this);
        };
        ComFightChange.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            NodeUtils.setSize(this, { width: AGame.R.app.stageWidth, height: AGame.R.app.stageHeight });
            this.m_labfightNum.text = GeneralModel.FIGHT_RECORD.toString();
            this.m_changeNum = GeneralModel.FIGHT_RECORD;
            GeneralModel.FIGHT_RECORD = this.m_nFightVal;
            this.actionGroup.play();
            this.actionGroup.addEventListener("complete", this.onPlayComplete, this);
        };
        /**动画播完之后回调 */
        ComFightChange.prototype.onPlayComplete = function () {
            this.doAction();
        };
        /**设置战斗力 */
        ComFightChange.prototype.doAction = function () {
            CommonUtils.NumberActionTo(this.m_labfightNum, Number(this.m_labfightNum.text), this.m_nFightVal, 1000, false, false);
            var fightStr;
            if (this.m_nFightVal - this.m_changeNum > 0) {
                this.m_labNextFight.font = 'addHPNumber_fnt';
                fightStr = '+' + (this.m_nFightVal - this.m_changeNum);
            }
            else {
                this.m_labNextFight.font = 'hurtNumber_fnt';
                fightStr = (this.m_nFightVal - this.m_changeNum).toString();
            }
            this.m_labNextFight.text = fightStr;
            Utils.TimerManager.doTimer(1500, 1, this.onLaterHandler, this);
        };
        ComFightChange.prototype.onLaterHandler = function () {
            Utils.removeFromParent(this);
        };
        ComFightChange.NAME = 'ComFightChange';
        return ComFightChange;
    }(com_main.CComponent));
    com_main.ComFightChange = ComFightChange;
})(com_main || (com_main = {}));
