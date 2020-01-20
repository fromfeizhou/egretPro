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
     * 装备主界面
     */
    var EquipSelectedWnd = /** @class */ (function (_super_1) {
        __extends(EquipSelectedWnd, _super_1);
        function EquipSelectedWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.name = EquipSelectedWnd.NAME;
            _this.m_nGeneralId = param.generalId;
            _this.m_nPos = param.pos;
            _this.initApp("equip/EquipSelectedWndSkin.exml");
            return _this;
        }
        EquipSelectedWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        EquipSelectedWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_tEquipArr = [];
            this.m_apopUp.setTitleLabel(GCode(CLEnum.EQUIP_TITLE_CD));
            this.m_apopUp.setBottomBorder(false);
            this.m_btnEquip.setTitleLabel(GCode(CLEnum.EQUIP_TAB_ZB));
            com_main.EventManager.addTouchTapListener(this.m_btnEquip, this, this.onBtnEquip);
            var genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            var equip = genVo.getEquipByPos(this.m_nPos);
            this.m_tEquipVos = EquipModel.getGenCanEquips(equip.equipmentUuid, this.m_nPos, false);
            this.m_tEquipArr = EquipModel.checkEquipNum(genVo, this.m_nGeneralId); //取武将当前穿戴装备
            this.initEquipItems();
            this.setSelectedIndex(0);
        };
        /**装备穿戴 */
        EquipSelectedWnd.prototype.onBtnEquip = function () {
            var data = this.m_pCollection.getItemAt(this.m_nCurIndex);
            if (data) {
                EquipProxy.C2S_GENERAL_EQUIP(this.m_nGeneralId, this.m_nPos, data.uid);
            }
            com_main.UpManager.history(true);
        };
        /**初始化装备列表 */
        EquipSelectedWnd.prototype.initEquipItems = function () {
            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_listEquip.dataProvider = this.m_pCollection;
            this.m_listEquip.itemRenderer = EquipItemRender;
            this.m_listEquip.useVirtualLayout = true;
            this.m_listEquip.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickEquip, this);
            var res = [];
            for (var i = 0; i < this.m_tEquipVos.length; i++) {
                var vo = this.m_tEquipVos[i];
                var fstate = 0;
                var data = { uid: vo.uuid, sel: false, fstate: 1 };
                res.push(data);
            }
            this.m_pCollection.replaceAll(res);
        };
        /**点击回调 */
        EquipSelectedWnd.prototype.onClickEquip = function (e) {
            this.setSelectedIndex(e.itemIndex);
        };
        /**设置当前选中 */
        EquipSelectedWnd.prototype.setSelectedIndex = function (index) {
            if (this.m_nCurIndex == index)
                return;
            this.refrestSelItem(this.m_nCurIndex, false);
            this.m_nCurIndex = index;
            this.refrestSelItem(this.m_nCurIndex, true);
            //没有装备 不显示信息
            if (this.m_nCurIndex >= this.m_tEquipVos.length) {
                this.m_pEquipInfo.visible = false;
                return;
            }
            this.m_pEquipInfo.visible = true;
            this.m_curEquipVo = this.m_tEquipVos[index];
            this.refreshEquipInfo();
        };
        /**刷新选中装备 */
        EquipSelectedWnd.prototype.refrestSelItem = function (index, val) {
            var data = this.m_pCollection.getItemAt(index);
            if (data) {
                data.sel = val;
                this.m_pCollection.replaceItemAt(data, index);
            }
        };
        /**刷新装备信息 */
        EquipSelectedWnd.prototype.refreshEquipInfo = function () {
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
        EquipSelectedWnd.prototype.isGrayItem = function (genid) {
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
        EquipSelectedWnd.prototype.isGraylabTitle = function (level) {
            var suitDatas = EquipModel.getGenSuits(this.m_nGeneralId, true);
            for (var i = 0; i < suitDatas.length; i++) {
                var info = suitDatas[i];
                if (info.key == this.m_curEquipVo.suitId) { //判断穿戴套装是否有选中的套装部件
                    //选中的装备的如果已穿戴不模拟激活状态
                    var valueNum = this.isGrayItem(this.m_curEquipVo.equipmentId) ? info.value + 1 : info.value;
                    if (valueNum <= level)
                        return false;
                }
            }
            return true;
        };
        /* * 穿戴的套装是否有选中装备对应的套装*/
        EquipSelectedWnd.prototype.isSuit = function () {
            var suitDatas = EquipModel.getGenSuits(this.m_nGeneralId, true);
            for (var i = 0; i < suitDatas.length; i++) {
                var info = suitDatas[i];
                if (info.key == this.m_curEquipVo.suitId) { //判断穿戴套装是否有选中的套装部件
                    return true;
                }
            }
            return false;
        };
        /* * 判断套装是否激活*/
        EquipSelectedWnd.prototype.isSuitActivate = function (num) {
            var state;
            var suitDatas = EquipModel.getGenSuits(this.m_nGeneralId, true);
            for (var i = 0; i < suitDatas.length; i++) {
                var info = suitDatas[i];
                if (info.key == this.m_curEquipVo.suitId) {
                    if (info.value > num) {
                        state = 1;
                        break;
                    }
                    var valueNum = this.isGrayItem(this.m_curEquipVo.equipmentId) ? info.value + 1 : info.value;
                    if (valueNum > num) {
                        state = 2;
                        break;
                    }
                    else {
                        state = 0;
                        break;
                    }
                }
            }
            return state;
        };
        /**刷新套装 */
        EquipSelectedWnd.prototype.refreshSuitItem = function () {
            var suitCfg = C.EquipmentSetConfig[this.m_curEquipVo.suitId];
            if (!suitCfg)
                return;
            this.m_labSuitName.text = suitCfg.name;
            this.m_labSuitName.textColor = Utils.getColorOfQuality(suitCfg.quality);
            var suits = suitCfg.suit.split(',');
            for (var i = 0; i < 4; i++) {
                var item = this["m_suitItem" + i];
                var wearState = this.isGrayItem(Number(suits[i])); //穿戴状态
                item.setItemInfo(Number(suits[i]));
                item.setWearState(wearState);
                item.currentState = "equip";
                Utils.isGray(this.m_curEquipVo.equipmentId != Number(suits[i]) && wearState, item);
            }
            Utils.removeAllChild(this.m_pAttriCon);
            for (var i = 0; i < 3; i++) {
                var labTile = new eui.Label();
                var level = this.isSuit() && this.isGraylabTitle(i) ? i : -1;
                var activte = void 0;
                if (this.isSuitActivate(i) == 1) {
                    activte = GCode(CLEnum.EQUIP_TITLE_YJH);
                }
                else if (this.isSuitActivate(i) == 2) {
                    activte = GCode(CLEnum.EQUIP_TITLE_CDJH);
                }
                else {
                    activte = '';
                }
                var color = level >= 0 ? GameConfig.TextColors.quality2 : GameConfig.TextColors.gray;
                var des = [GCodeFromat(CLEnum.EQUIP_TITLE_COLOR_TZ2, color), GCodeFromat(CLEnum.EQUIP_TITLE_COLOR_TZ3, color), GCodeFromat(CLEnum.EQUIP_TITLE_COLOR_TZ4, color)];
                labTile.textFlow = Utils.htmlParser(des[i] + EquipModel.getSuitAttriDes(this.m_curEquipVo.suitId, i) + '  ' + activte);
                labTile.size = 20;
                labTile.width = 450;
                labTile.height = 30;
                labTile.textColor = EquipModel.getSuitColor(level);
                labTile.x = 50;
                labTile.y = 16;
                this.m_pAttriCon.addChild(labTile);
            }
        };
        EquipSelectedWnd.NAME = 'EquipSelectedWnd';
        return EquipSelectedWnd;
    }(com_main.CView));
    com_main.EquipSelectedWnd = EquipSelectedWnd;
    /**装备cell */
    var EquipItemRender = /** @class */ (function (_super_1) {
        __extends(EquipItemRender, _super_1);
        function EquipItemRender() {
            return _super_1.call(this) || this;
        }
        EquipItemRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_equipItem = new com_main.EquipItem('equip');
            this.addChild(this.m_equipItem);
            this.m_imgSelected = new eui.Image('SelectKuang_png');
            this.m_imgSelected.x = -13;
            this.m_imgSelected.y = -13;
            this.addChild(this.m_imgSelected);
            this.m_imgSelected.visible = false;
        };
        EquipItemRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            this.m_imgSelected.visible = this.m_tData.sel;
            this.m_equipItem.setFightState(this.m_tData.fstate);
            var vo = EquipModel.getEquipVoByUId(this.m_tData.uid);
            if (vo) {
                this.m_equipItem.setItemInfo(vo.equipmentId);
                this.m_equipItem.setGeneral(vo.generalId);
            }
        };
        return EquipItemRender;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
