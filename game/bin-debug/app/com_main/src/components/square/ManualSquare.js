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
    var ManualSquare = /** @class */ (function (_super_1) {
        __extends(ManualSquare, _super_1);
        function ManualSquare(generalId) {
            var _this = _super_1.call(this) || this;
            _this.generalId = generalId;
            _this.initSquare();
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onDestroy, _this);
            return _this;
        }
        ManualSquare.prototype.initSquare = function () {
            this.width = 180;
            this.height = 160;
            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
            var config = C.GeneralConfig[this.generalId];
            var gCid = config.ourModelCode;
            this.m_pHero = com_main.CSoldiers.createId(gCid);
            this.m_pHero.x = 136;
            this.m_pHero.y = 55 + 35;
            // this.m_pHero.test = true;
            this.m_pHero.changeStatus(CSquare_Status.STATUS_STAND);
            this.m_pHero.changeDirection(CSquare_Direction.RIGHT_UP);
            this.addChild(this.m_pHero);
            var gconfig = GeneralModel.getGeneralArmyConfig(this.generalId);
            var cid = gconfig.ourModelCode;
            this.m_pSoldier = com_main.CSoldiers.createId(cid);
            this.m_pSoldier.x = 82 - 10;
            this.m_pSoldier.y = 93 + 35 - 10;
            // this.m_pSoldier.visible = false;
            this.m_pSoldier.changeDirection(CSquare_Direction.RIGHT_UP);
            this.m_pSoldier.changeStatus(CSquare_Status.STATUS_STAND);
            this.addChild(this.m_pSoldier);
            this.m_pTips = new eui.Group();
            this.m_pTips.width = 125;
            this.m_pTips.height = 32;
            this.m_pTips.x = 125;
            this.m_pTips.y = 80;
            this.m_pTips.visible = false;
            this.addChild(this.m_pTips);
            // RES.getResAsync("border_1001_png", (k, v) => {
            var tipBg = new eui.Image();
            this.m_pTips.addChild(tipBg);
            tipBg.source = "border_1001_png";
            tipBg.width = 125;
            tipBg.height = 32;
            var m_pLbName = new eui.Label();
            m_pLbName.textFlow = Utils.htmlParser(GCode(CLEnum.WOR_SOR_FAL1));
            m_pLbName.size = 24;
            m_pLbName.horizontalCenter = 0;
            m_pLbName.y = 2;
            this.m_pTips.addChild(m_pLbName);
            // let actionName = this.packageActionName(null, CSquare_Direction.RIGHT, CSquare_Status.STATUS_STAND);
            // this.createSoldiers(this.m_pSoldiersCode, this.m_pType, actionName );
        };
        ManualSquare.prototype.isShowSorlider = function (visible) {
            this.m_pSoldier.visible = visible;
        };
        ManualSquare.prototype.isShowTip = function (visible) {
            this.m_pTips.visible = visible;
        };
        ManualSquare.prototype.isShowHead = function (visible) {
        };
        ManualSquare.prototype.onDestroy = function () {
            this.m_pHero.onDestroy();
            this.m_pSoldier.onDestroy();
        };
        return ManualSquare;
    }(egret.DisplayObjectContainer));
    com_main.ManualSquare = ManualSquare;
})(com_main || (com_main = {}));
