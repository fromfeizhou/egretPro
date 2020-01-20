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
    var BossHurtWnd = /** @class */ (function (_super_1) {
        __extends(BossHurtWnd, _super_1);
        /**boss伤害排名界面 */
        function BossHurtWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.hurtInfo = null; //boss伤害榜单数据
            _this.name = BossHurtWnd.NAME;
            _this.hurtInfo = param.list.bossRankingListInfo;
            _this.m_hurtNum = param.list.hurt;
            _this.initApp("boss/BossHurtWndSkin.exml");
            return _this;
        }
        BossHurtWnd.prototype.onDestroy = function () {
            this.hurtInfo = null;
            _super_1.prototype.onDestroy.call(this);
        };
        BossHurtWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_APopUp.setTitleLabel(GCode(CLEnum.BOSS_HURT_RANK));
            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_hurtList.dataProvider = this.m_pCollection;
            this.m_hurtList.itemRenderer = BossHurtRender;
            this.m_hurtList.useVirtualLayout = true;
            this.initPanel();
        };
        /**初始化排名奖励列表 */
        BossHurtWnd.prototype.initPanel = function () {
            var hurtArr = [];
            if (this.hurtInfo && this.hurtInfo.length > 0) {
                for (var i = 0; i < this.hurtInfo.length; i++) {
                    var info = this.hurtInfo[i];
                    var data = { ranking: info.ranking, name: info.name, fight: info.fight, hurt: info.hurt, playerId: info.playerId, countryId: info.countryId };
                    hurtArr.push(data);
                }
                this.m_pCollection.replaceAll(hurtArr);
            }
            this.m_hurtTip.visible = false;
            var roleId = RoleData.playerId;
            if (this.hurtInfo && this.hurtInfo.length > 0) {
                for (var j = 0; j < this.hurtInfo.length; j++) {
                    var myInfo = this.hurtInfo[j];
                    var myData = { ranking: myInfo.ranking, name: myInfo.name, fight: myInfo.fight, hurt: myInfo.hurt, playerId: myInfo.playerId, countryId: myInfo.countryId };
                    var newRoleId = myInfo.playerId;
                    if (newRoleId == roleId) {
                        this.setRoleHurt(myData);
                        return;
                    }
                    else {
                        this.setRoleHurt(null);
                    }
                }
            }
            else {
                this.m_hurtTip.visible = true;
                this.setRoleHurt(null);
            }
        };
        /**初始化自己的伤害信息 */
        BossHurtWnd.prototype.setRoleHurt = function (hurtData) {
            this.m_roleName.text = RoleData.nickName;
            this.m_hurtPower.text = GeneralModel.getGeneralTotalFight() + "";
            this.m_comState.stateId = RoleData.countryId;
            this.m_hurtCount.text = this.m_hurtNum + '';
            this.m_rankingNum.text = GCode(CLEnum.ARENA_NONE);
            this.m_myHurtCoin.visible = false;
            if (hurtData) {
                this.m_hurtCount.text = hurtData.hurt + '';
                RankModel.refreshRankIcon(this.m_myHurtCoin, this.m_rankingNum, hurtData.ranking);
            }
        };
        BossHurtWnd.NAME = "BossHurtWnd";
        return BossHurtWnd;
    }(com_main.CView));
    com_main.BossHurtWnd = BossHurtWnd;
    /**
    * bossItem
    * @class
    * @extends eui.ItemRenderer
    */
    var BossHurtRender = /** @class */ (function (_super_1) {
        __extends(BossHurtRender, _super_1);
        function BossHurtRender() {
            return _super_1.call(this) || this;
        }
        BossHurtRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        BossHurtRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.bossHurtCell = new com_main.BossHurtCell();
            this.addChild(this.bossHurtCell);
        };
        BossHurtRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            this.bossHurtCell.setItemInfo(this.m_tData.ranking, this.m_tData.name, this.m_tData.fight, this.m_tData.hurt, this.m_tData.playerId, this.m_tData.countryId);
        };
        return BossHurtRender;
    }(eui.ItemRenderer));
    com_main.BossHurtRender = BossHurtRender;
})(com_main || (com_main = {}));
