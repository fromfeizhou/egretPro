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
    /**
     * 军备进阶面板
     */
    var ArmsUpgrade = /** @class */ (function (_super_1) {
        __extends(ArmsUpgrade, _super_1);
        function ArmsUpgrade() {
            var _this = _super_1.call(this) || this;
            _this.name = com_main.ArmsWnd.NAME;
            _this.skinName = Utils.getAppSkin('arms/ArmsUpgradeSkin.exml');
            return _this;
        }
        ArmsUpgrade.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        ArmsUpgrade.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        ArmsUpgrade.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_pArrayCollection = new eui.ArrayCollection([]);
            this.m_materialList.itemRenderer = com_main.SoldierUpComsumeCell;
            this.m_materialList.dataProvider = this.m_pArrayCollection;
            this.m_btnUp.setTitleLabel(GCode(CLEnum.GRADE_UP));
            this.addEvent();
        };
        /**切换兵种 */
        ArmsUpgrade.prototype.changeType = function (type) {
            this.m_nArmyType = type;
            var buildId = MainMapModel.getBuildInfoBySolider(this.m_nArmyType).id;
            this.m_buildTrainCfg = MainMapModel.getBuildingTrainCfgbyBuildId(buildId);
            this.refreshView();
        };
        /**刷新界面 */
        ArmsUpgrade.prototype.refreshView = function () {
            var curCfg = MainMapModel.getSoldierLvCfg(this.m_nArmyType);
            this.m_nGradeLv = TeamModel.getTroopsInfo(this.m_nArmyType).level;
            var armyProgressConfig = TeamModel.getArmyProgressConfig(this.m_nArmyType, this.m_nGradeLv);
            if (armyProgressConfig == null) { //80级的时候
                armyProgressConfig = TeamModel.getArmyProgressConfig(this.m_nArmyType, 1);
            }
            this.m_costInfos = Utils.parseCommonItemJson(armyProgressConfig.coumses);
            this.m_pLbTitle.text = GLan(curCfg.name) + GCode(CLEnum.GRADE) + this.m_nGradeLv;
            //列表数据
            this.setList();
            //材料数据
            this.updateCosumeGroup();
            //材料消耗
            this.updateCosumeText();
        };
        /**属性显示 */
        ArmsUpgrade.prototype.setList = function () {
            var data = [];
            //当前阶 加成属性
            var curCfg = TeamModel.getArmyProgressConfig(this.m_nArmyType, this.m_nGradeLv);
            var curAttris = StringUtils.keyValsToNumber(curCfg.attribute);
            //下一阶加成属性
            var nextCfg = TeamModel.getArmyProgressConfig(this.m_nArmyType, this.m_nGradeLv + 1);
            var nextAttris = nextCfg != null ? StringUtils.keyValsToNumber(nextCfg.attribute) : {};
            //等级配置属性
            var levelCfg = MainMapModel.getSoldierLvCfg(this.m_nArmyType);
            var baseAttri = StringUtils.keyValsToNumber(levelCfg.attribute);
            for (var key in curAttris) {
                var attType = Number(key);
                var val = Utils.getAttriValByType(baseAttri, attType) + Utils.getAttriValByType(curAttris, attType);
                var next = Utils.getAttriValByType(baseAttri, attType) + Utils.getAttriValByType(nextAttris, attType);
                data.push({
                    key: key, curParm: Utils.getAttriNameByType(attType),
                    icon: Utils.getAttriIcon(attType), curAtt: val, preAtt: next
                });
            }
            this.m_pArrayCollection.replaceAll(data);
        };
        ArmsUpgrade.prototype.updateCosumeGroup = function () {
            var costInfos = this.m_costInfos.slice(1, this.m_costInfos.length);
            while (this.m_consumeGroup.numChildren > costInfos.length) {
                this.m_consumeGroup.removeChildAt(0);
            }
            for (var i = 0; i < costInfos.length; i++) {
                var info = costInfos[i];
                var item = null;
                if (i < this.m_consumeGroup.numChildren) {
                    item = this.m_consumeGroup.getChildAt(i);
                }
                else {
                    item = com_main.ComItemNew.create("count");
                    this.m_consumeGroup.addChild(item);
                }
                item.setItemInfo(info.itemId);
                item.refresVal2Max(PropModel.getPropNum(info.itemId), info.count);
            }
        };
        ArmsUpgrade.prototype.updateCosumeText = function () {
            var type = this.m_costInfos[0].itemId;
            var comsumeValue = this.m_costInfos[0].count;
            this.m_consumeIcon.source = RoleData.GetMaterialIconPathById(type);
            this.m_consumeValue.text = CommonUtils.numOutLenght(RoleData.silver) + "/" + comsumeValue;
            this.m_consumeValue.textColor = RoleData.silver < comsumeValue ?
                GameConfig.TextColors.red : GameConfig.TextColors.fontWhite;
            //885A2A
            this.m_consumeValue.strokeColor = RoleData.silver < comsumeValue ?
                0X000000 : 0X885A2A;
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        ArmsUpgrade.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnUp, this, this.onUp);
            com_main.EventMgr.addEvent(BuildEvent.SOLDIER_UPGRADE, this.onFinishUpgrade, this);
            com_main.EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.onItemChange, this);
            com_main.EventMgr.addEvent(RoleEvent.ROLE_RESOURCE, this.onRoleResource, this);
        };
        ArmsUpgrade.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
            com_main.EventMgr.removeEventByObject(BuildEvent.SOLDIER_UPGRADE, this);
            com_main.EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_RESOURCE, this);
        };
        /**资源刷新 */
        ArmsUpgrade.prototype.onRoleResource = function (sourceId) {
            if (!this.m_nArmyType)
                return;
            this.updateCosumeText();
        };
        /**道具变动 */
        ArmsUpgrade.prototype.onItemChange = function () {
            if (!this.m_nArmyType)
                return;
            this.updateCosumeGroup();
        };
        ArmsUpgrade.prototype.onUp = function (e) {
            if (!PropModel.isItemListEnough(this.m_costInfos, 3))
                return;
            var cfg = TeamModel.getArmyProgressConfig(this.m_nArmyType, this.m_nGradeLv + 1);
            if (!cfg) {
                EffectUtils.showTips(GCode(CLEnum.LEVEL_MAX), 1, true);
            }
            var maxLv = MainMapModel.getSoliderBuildLvByType(this.m_nArmyType) + 10;
            if (this.m_nGradeLv > maxLv) {
                EffectUtils.showTips(GCode(CLEnum.ARMY_GRADE_FAL), 1, true);
                return;
            }
            SoldierProxy.send_ARMY_UPGRADE_LEVEL(this.m_nArmyType);
        };
        ArmsUpgrade.prototype.onFinishUpgrade = function (param) {
            // armyType: number, level: number
            if (this.m_nArmyType != param.armyType)
                return;
            this.m_nGradeLv = TeamModel.getTroopsInfo(this.m_nArmyType).level;
            this.refreshView();
        };
        ArmsUpgrade.NAME = 'ArmsUpgrade';
        return ArmsUpgrade;
    }(com_main.CComponent));
    com_main.ArmsUpgrade = ArmsUpgrade;
})(com_main || (com_main = {}));
