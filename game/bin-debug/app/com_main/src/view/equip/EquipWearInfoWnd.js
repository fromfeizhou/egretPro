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
     * 装备穿戴信息界面
     */
    var EquipWearInfoWnd = /** @class */ (function (_super_1) {
        __extends(EquipWearInfoWnd, _super_1);
        function EquipWearInfoWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.name = com_main.EquipSelectedWnd.NAME;
            _this.m_nGeneralId = param.generalId;
            _this.m_nPos = param.pos;
            _this.initApp("equip/EquipWearInfoWndSkin.exml");
            return _this;
        }
        EquipWearInfoWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        EquipWearInfoWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.addEvent();
            this.m_tEquipArr = [];
            var genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            var equip = genVo.getEquipByPos(this.m_nPos);
            this.m_tEquipVos = EquipModel.getGenCanEquips(equip.equipmentUuid, this.m_nPos, false);
            this.m_tEquipArr = EquipModel.checkEquipNum(genVo, this.m_nGeneralId); //取武将当前穿戴装备
            this.refreshEquipInfo();
        };
        /**监听事件 */
        EquipWearInfoWnd.prototype.addEvent = function () {
            this.m_btnReplace.setTitleLabel(GCode(CLEnum.EQUIP_ZB_GH));
            com_main.EventManager.addTouchTapListener(this.m_btnReplace, this, this.onBtnEquip);
            this.m_btnUnload.setTitleLabel(GCode(CLEnum.EQUIP_ZB_XX));
            com_main.EventManager.addTouchTapListener(this.m_btnUnload, this, this.onBtnUnload);
        };
        /**装备更换 */
        EquipWearInfoWnd.prototype.onBtnEquip = function () {
            com_main.UpManager.history(true);
            Utils.open_view(TASK_UI.POP_EQUIP_SEL_WND, { generalId: this.m_nGeneralId, pos: this.m_nPos });
        };
        /**装备卸下 */
        EquipWearInfoWnd.prototype.onBtnUnload = function () {
            EquipProxy.C2S_GENERAL_EQUIP(this.m_nGeneralId, this.m_nPos, 0);
            com_main.UpManager.history(true);
        };
        /**刷新装备信息 */
        EquipWearInfoWnd.prototype.refreshEquipInfo = function () {
            if (this.m_tEquipVos && this.m_tEquipVos.length > 0) {
                for (var i = 0; i < this.m_tEquipVos.length; i++) {
                    var vo = this.m_tEquipVos[i];
                    if (vo.generalId == this.m_nGeneralId) {
                        this.m_curEquipVo = vo;
                        break;
                    }
                }
            }
            var attri = this.m_curEquipVo.mainAttri;
            this.m_imgAttriIcon.source = Utils.getAttriIcon(attri.key);
            this.m_labAttri.text = Utils.getAttriFormat(attri, false, '%s：%s');
            this.m_labFight.text = GCode(CLEnum.FIGHT1) + this.m_curEquipVo.fight;
            Utils.setPropLabName(this.m_curEquipVo.equipmentId, this.m_labEquipName);
            var color = Utils.getColorOfQuality(this.m_curEquipVo.quality);
            this.m_labLevel.textFlow = Utils.htmlParser(GCode(CLEnum.LEVEL2) + "<font color=" + color + ">" + this.m_curEquipVo.itemCfg.level + "</font>");
            this.m_euipItem.setItemInfo(this.m_curEquipVo.equipmentId);
            this.refreshSuitItem();
        };
        /**点击当前武将穿戴的单件装备在套装中的激活状态 */
        EquipWearInfoWnd.prototype.isGrayItem = function (genid) {
            for (var j = 0; j < this.m_tEquipArr.length; j++) {
                var equipVo = this.m_tEquipArr[j];
                if (equipVo) {
                    if (this.m_tEquipArr[j].equipmentId == genid) {
                        return false;
                    }
                }
            }
            return true;
        };
        /** 套装就激活件数 */
        EquipWearInfoWnd.prototype.isGraylabTitle = function (level) {
            var suitDatas = EquipModel.getGenSuits(this.m_nGeneralId, true);
            for (var i = 0; i < suitDatas.length; i++) {
                var info = suitDatas[i];
                if (info.key == this.m_curEquipVo.suitId) {
                    if (info.value <= level)
                        return false;
                }
            }
            return true;
        };
        /**刷新套装 */
        EquipWearInfoWnd.prototype.refreshSuitItem = function () {
            var suitCfg = C.EquipmentSetConfig[this.m_curEquipVo.suitId];
            var suitDatas = EquipModel.getGenSuits(this.m_nGeneralId);
            if (!suitCfg)
                return;
            this.m_labSuitName.text = suitCfg.name;
            this.m_labSuitName.textColor = Utils.getColorOfQuality(suitCfg.quality);
            var suits = suitCfg.suit.split(',');
            for (var i = 0; i < 4; i++) {
                var item = this["m_suitItem" + i];
                item.setItemInfo(Number(suits[i]));
                item.currentState = "equip";
                Utils.isGray(this.isGrayItem(Number(suits[i])), item);
            }
            Utils.removeAllChild(this.m_pAttriCon);
            for (var i = 0; i < 3; i++) {
                var labTile = new eui.Label();
                labTile.size = 20;
                labTile.width = 420;
                labTile.height = 30;
                var level = this.isGraylabTitle(i) ? i : -1;
                var color = level >= 0 ? GameConfig.TextColors.quality2 : GameConfig.TextColors.gray;
                var des = [GCodeFromat(CLEnum.EQUIP_TITLE_COLOR_TZ2, color), GCodeFromat(CLEnum.EQUIP_TITLE_COLOR_TZ3, color), GCodeFromat(CLEnum.EQUIP_TITLE_COLOR_TZ4, color)];
                labTile.textFlow = Utils.htmlParser(des[i] + EquipModel.getSuitAttriDes(this.m_curEquipVo.suitId, i));
                labTile.textColor = EquipModel.getSuitColor(level);
                labTile.x = 50;
                labTile.y = 16;
                this.m_pAttriCon.addChild(labTile);
            }
        };
        EquipWearInfoWnd.NAME = 'EquipWearInfoWnd';
        return EquipWearInfoWnd;
    }(com_main.CView));
    com_main.EquipWearInfoWnd = EquipWearInfoWnd;
})(com_main || (com_main = {}));
