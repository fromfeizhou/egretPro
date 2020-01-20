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
    /**装备格子 */
    var EquipItem = /** @class */ (function (_super_1) {
        __extends(EquipItem, _super_1);
        function EquipItem(state) {
            var _this = _super_1.call(this) || this;
            _this.name = EquipItem.NAME;
            _this.currentState = state || 'normal';
            _this.skinName = Utils.getAppSkin("equip/EquipItemSkin.exml");
            return _this;
        }
        EquipItem.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        EquipItem.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.clearLvEffect();
        };
        EquipItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.touchChildren = false;
            this.m_nItemId = 0;
            this.m_labWear.visible = false;
            this.validateNow();
        };
        Object.defineProperty(EquipItem.prototype, "pos", {
            /**位置 */
            get: function () {
                return this.m_nPos;
            },
            set: function (val) {
                this.m_nPos = val;
            },
            enumerable: true,
            configurable: true
        });
        /**设置装备信息 */
        EquipItem.prototype.setItemInfo = function (itemId, level, title, tagIndex, color) {
            if (level === void 0) { level = 0; }
            if (title === void 0) { title = ''; }
            if (tagIndex === void 0) { tagIndex = 0; }
            if (color === void 0) { color = GameConfig.TextColors.white; }
            this.refreshItemView(itemId);
            this.refreshLevel(level, title, color);
            // this.refreshLvEffect(tagIndex, level);
        };
        /**设置装备是否穿戴 */
        EquipItem.prototype.setWearState = function (state) {
            this.refreshEquipWearState(state);
        };
        /**设置武将名字 */
        EquipItem.prototype.setGeneral = function (generalId) {
            if (!this.m_pGenCon)
                return;
            if (generalId > 0) {
                this.m_pGenCon.visible = true;
                GeneralModel.setLabGaneralName(generalId, this.m_labGenName);
            }
            else {
                this.m_pGenCon.visible = false;
            }
        };
        /**
         * @param {state} 0不显示 1提升 2 下降
         * 设置战力提示图标
         *  */
        EquipItem.prototype.setFightState = function (state) {
            if (state === void 0) { state = 0; }
            this.m_nState = state;
            if (state == 1) {
                this.m_imgFight.source = 'com_state_up_png';
                this.m_imgFight.visible = true;
            }
            else if (state == 2) {
                this.m_imgFight.source = 'com_state_down_png';
                this.m_imgFight.visible = true;
            }
            else {
                this.m_imgFight.visible = false;
            }
        };
        Object.defineProperty(EquipItem.prototype, "state", {
            get: function () {
                return this.m_nState;
            },
            enumerable: true,
            configurable: true
        });
        /**刷新图标 */
        EquipItem.prototype.refreshItemView = function (itemId) {
            if (this.m_nItemId == itemId)
                return;
            this.m_nItemId = itemId;
            if (this.m_nItemId > 0) {
                var itemCfg = C.ItemConfig[itemId];
                this.m_imgIcon.source = PropModel.getPropIcon(itemId);
                Utils.initPropkuang(this.m_imgBg, itemId);
            }
            else {
                this.m_imgIcon.source = EquipModel.getEquipIconByPos(this.m_nPos);
                this.m_imgBg.source = 'Qualitykuang0_png';
            }
            this.refreshEquipName();
            this.refreshEquipLv();
            this.reEquipName(); //装备总览设置名字
            this.refreshRedEffect();
        };
        /**设置属性组显示 */
        EquipItem.prototype.setInfoGroupVis = function (val) {
            if (!this.m_pInfoCon)
                return;
            this.m_pInfoCon.visible = val;
        };
        /**刷新等级 */
        EquipItem.prototype.refreshLevel = function (level, title, color) {
            if (title === void 0) { title = ''; }
            if (!this.m_labLv)
                return;
            this.m_labLv.text = level + '';
            this.m_labTitle.text = title;
            this.m_labLv.textColor = this.m_labTitle.textColor = color;
        };
        /**刷新星级 */
        // private refreshGrade(gradeLv: number) {
        //     if (!this.m_labGradeLv) return;
        //     if (gradeLv > 0) {
        //         this.m_labGradeLv.text = '+' + gradeLv;
        //     } else {
        //         this.m_labGradeLv.text = '';
        //     }
        // }
        /**装备穿戴状态 */
        EquipItem.prototype.refreshEquipWearState = function (state) {
            // this.m_labWear.visible=true;
            this.m_labWear.text = state ? GCode(CLEnum.EQUIP_ZB_WCD) : GCode(CLEnum.EQUIP_ZB_YCD);
            this.m_labWear.textColor = state ? GameConfig.TextColors.red : GameConfig.TextColors.green;
        };
        /**刷装备名字 */
        EquipItem.prototype.refreshEquipName = function () {
            if (!this.m_labEquipName)
                return;
            if (this.m_nItemId > 0) {
                Utils.setPropLabName(this.m_nItemId, this.m_labEquipName);
            }
            else {
                this.m_labEquipName.text = '';
            }
        };
        /**刷装备等级 */
        EquipItem.prototype.refreshEquipLv = function () {
            if (!this.m_labEquipLv)
                return;
            if (this.m_nItemId > 0) {
                Utils.setPropLabLv(this.m_nItemId, this.m_labEquipLv);
            }
            else {
                this.m_labEquipLv.text = '';
            }
        };
        /**-装备总览start---------------------------------------------------------------------------------------------------------------------- */
        /**设置属性组显示 */
        EquipItem.prototype.setInfoGroup = function (val) {
            if (!this.m_pInfoCon0)
                return;
            this.m_pInfoCon0.visible = val;
            this.m_pInfoCon1.visible = val;
            this.m_pInfoCon2.visible = val;
        };
        /**刷装备名字 */
        EquipItem.prototype.reEquipName = function () {
            if (!this.m_labName)
                return;
            if (this.m_nItemId > 0) {
                Utils.setPropLabName(this.m_nItemId, this.m_labName);
            }
            else {
                this.m_labName.text = '';
            }
        };
        /**刷新阶数 */
        EquipItem.prototype.reLevel = function (level, title) {
            if (title === void 0) { title = ''; }
            if (!this.m_labSJLv)
                return;
            this.m_labSJLv.text = GCodeFromat(CLEnum.GRADE2, level);
        };
        /**刷新强化 */
        EquipItem.prototype.reStreng = function (level, title) {
            if (title === void 0) { title = ''; }
            if (!this.m_labQh)
                return;
            this.m_labQh.text = GCode(CLEnum.STRENG) + level;
        };
        /**刷新精炼 */
        EquipItem.prototype.reWrought = function (level, title) {
            if (title === void 0) { title = ''; }
            if (!this.m_labWrought)
                return;
            this.m_labWrought.text = GCode(CLEnum.WROUGH) + level;
        };
        /**-装备总览end---------------------------------------------------------------------------------------------------------------------- */
        //=============================================================================================================================================
        //特效 begin
        //============================================================================================================================================= 
        /**设置流光特效 */
        // public refreshLvEffect(tag: number, level: number) {
        //     let showEff: boolean = false;
        //     if (tag == 1) {
        //         showEff = level >= 80;  //强化80
        //     } else if (tag == 2) {
        //         showEff = level >= 40;   //升阶40
        //     } else {
        //         showEff = level >= 200;   //精炼200
        //     }
        //     if (showEff) {
        //         this.createLvEffect();
        //     } else {
        //         this.clearLvEffect();
        //     }
        // }
        /**设置流光特效*/
        EquipItem.prototype.refreshRedEffect = function () {
            var itemInfo = C.ItemConfig[this.m_nItemId];
            if (itemInfo && itemInfo.quality >= 5) {
                this.createLvEffect();
            }
            else {
                this.clearLvEffect();
            }
        };
        EquipItem.prototype.createLvEffect = function () {
            if (this.m_eqLvEff)
                return;
            this.m_eqLvEff = NormalMcMgr.createMc(IETypes.EUI_EqLevelEff);
            this.m_eqLvEff.x = this.width / 2;
            this.m_eqLvEff.y = 49;
            this.m_pEffRoot.addChild(this.m_eqLvEff);
        };
        EquipItem.prototype.clearLvEffect = function () {
            if (this.m_eqLvEff) {
                NormalMcMgr.removeMc(this.m_eqLvEff);
                this.m_eqLvEff = null;
            }
        };
        /**点击强化特效 */
        EquipItem.prototype.createUpGradeEffect = function () {
            var effect = NormalMcMgr.createMc(IETypes.EUI_EqUpGradeEff, false);
            effect.playNorOnce(IETypes.EUI_EqUpGradeEff, function () {
                NormalMcMgr.removeMc(effect);
            }, this);
            effect.x = 50;
            effect.y = 50;
            this.m_pEffRoot.addChild(effect);
        };
        EquipItem.NAME = 'EquipItem';
        return EquipItem;
    }(com_main.CComponent));
    com_main.EquipItem = EquipItem;
})(com_main || (com_main = {}));
