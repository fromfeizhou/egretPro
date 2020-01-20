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
//带标题动画
var com_main;
(function (com_main) {
    var GenTitleMc = /** @class */ (function (_super_1) {
        __extends(GenTitleMc, _super_1);
        function GenTitleMc() {
            return _super_1.call(this) || this;
        }
        GenTitleMc.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.width = 10;
            this.height = 10;
            this.touchEnabled = false;
            this.touchChildren = false;
        };
        /**设置动画标题 */
        GenTitleMc.prototype.setMcInfo = function (id, scale, isSoldier, title) {
            scale = scale || 1;
            var config = C.GeneralConfig[id];
            var gCid = config.ourModelCode;
            this.m_hero = com_main.CSoldiers.createId(gCid);
            this.m_hero.changeStatus(CSquare_Status.STATUS_STAND);
            this.m_hero.changeDirection(CSquare_Direction.RIGHT_UP);
            NodeUtils.setScale(this.m_hero, scale);
            this.addChild(this.m_hero); //起点为脚下站立点
            if (title) {
                this.m_headInfo = new com_main.GeneralHeadTitle();
                this.m_headInfo.setData(title);
                this.m_headInfo.anchorOffsetX = this.m_headInfo.width / 2;
                this.m_headInfo.anchorOffsetY = this.m_headInfo.height;
                this.m_headInfo.y = -110;
                this.addChild(this.m_headInfo);
            }
            if (isSoldier) {
                var gconfig = GeneralModel.getGeneralArmyConfig(id);
                var cid = gconfig.ourModelCode;
                this.m_soldier = com_main.CSoldiers.createId(cid);
                this.m_soldier.x = -80;
                this.m_soldier.y = 60;
                this.m_soldier.changeDirection(CSquare_Direction.RIGHT_UP);
                this.m_soldier.changeStatus(CSquare_Status.STATUS_STAND);
                this.addChild(this.m_soldier);
            }
        };
        GenTitleMc.prototype.onDestroy = function () {
            if (this.m_headInfo) {
                this.m_headInfo.onDestroy();
                this.m_headInfo = null;
            }
            if (this.m_hero) {
                this.m_hero.onDestroy();
                this.m_hero = null;
            }
            if (this.m_soldier) {
                this.m_soldier.onDestroy();
                this.m_soldier = null;
            }
        };
        return GenTitleMc;
    }(eui.Component));
    com_main.GenTitleMc = GenTitleMc;
})(com_main || (com_main = {}));
