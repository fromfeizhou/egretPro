module com_main {
    /**装备格子 */
    export class EquipItem extends CComponent {
        public static NAME: string = 'EquipItem';

        public m_imgBg: com_main.CImage;
        public m_imgIcon: com_main.CImage;
        public m_pInfoCon: eui.Group;
        public m_labLv: eui.Label;
        public m_labTitle: eui.Label;
        public m_imgFight: eui.Image;
        public m_pGenCon: eui.Group;
        public m_labGenName: eui.Label;
        public m_labEquipName: eui.Label;
        public m_labEquipLv: eui.Label;
        public m_pEffRoot: eui.Group;

        public m_imgPro: eui.Image;
        public m_labProNum: eui.Label;

        //强化
        public m_pInfoCon0: eui.Group;
        public m_labQh: eui.Label;

        //名字+阶数
        public m_pInfoCon1: eui.Group;
        public m_labName: eui.Label;
        public m_labSJLv: eui.Label;

        //精炼
        public m_pInfoCon2: eui.Group;
        public m_labWrought: eui.Label;

        private m_nItemId: number;        //格子物品id
        private m_nPos: IEquipPos;      //格子位置
        private m_nState: number;    //提升状态
        private m_eqLvEff: MCDragonBones;
        public m_labWear: eui.Label;   //穿戴显示

        public constructor(state?: string) {
            super();
            this.name = EquipItem.NAME;
            this.currentState = state || 'normal'
            this.skinName = Utils.getAppSkin("equip/EquipItemSkin.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }
        public onDestroy(): void {
            super.onDestroy();
            this.clearLvEffect();
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.touchChildren = false;
            this.m_nItemId = 0;
            this.m_labWear.visible = false;
            this.validateNow();
        }

        /**位置 */
        public get pos(): IEquipPos {
            return this.m_nPos
        }

        public set pos(val: IEquipPos) {
            this.m_nPos = val;
        }

        /**设置装备信息 */
        public setItemInfo(itemId: number, level: number = 0, title: string = '', tagIndex: number = 0, color: number = GameConfig.TextColors.white) {
            this.refreshItemView(itemId);
            this.refreshLevel(level, title, color);
            // this.refreshLvEffect(tagIndex, level);

        }
        /**设置装备是否穿戴 */
        public setWearState(state: boolean) {
            this.refreshEquipWearState(state);
        }

        /**设置武将名字 */
        public setGeneral(generalId: number) {
            if (!this.m_pGenCon) return;
            if (generalId > 0) {
                this.m_pGenCon.visible = true;
                GeneralModel.setLabGaneralName(generalId, this.m_labGenName);
            } else {
                this.m_pGenCon.visible = false;
            }
        }

        /**
         * @param {state} 0不显示 1提升 2 下降
         * 设置战力提示图标
         *  */
        public setFightState(state: number = 0) {
            this.m_nState = state;
            if (state == 1) {
                this.m_imgFight.source = 'com_state_up_png';
                this.m_imgFight.visible = true;
            } else if (state == 2) {
                this.m_imgFight.source = 'com_state_down_png';
                this.m_imgFight.visible = true;
            } else {
                this.m_imgFight.visible = false;
            }
        }

        public get state() {
            return this.m_nState;
        }

        /**刷新图标 */
        private refreshItemView(itemId: number) {
            if (this.m_nItemId == itemId) return;
            this.m_nItemId = itemId;
            if (this.m_nItemId > 0) {
                let itemCfg = C.ItemConfig[itemId];
                this.m_imgIcon.source = PropModel.getPropIcon(itemId);
                Utils.initPropkuang(this.m_imgBg, itemId);
            } else {
                this.m_imgIcon.source = EquipModel.getEquipIconByPos(this.m_nPos);
                this.m_imgBg.source = 'Qualitykuang0_png';
            }
            this.refreshEquipName();
            this.refreshEquipLv();

            this.reEquipName();//装备总览设置名字
            this.refreshRedEffect();

        }


        /**设置属性组显示 */
        public setInfoGroupVis(val: boolean) {
            if (!this.m_pInfoCon) return;
            this.m_pInfoCon.visible = val;
        }

        /**刷新等级 */
        private refreshLevel(level: number, title: string = '', color: number) {
            if (!this.m_labLv) return;
            this.m_labLv.text = level + '';
            this.m_labTitle.text = title;
            this.m_labLv.textColor = this.m_labTitle.textColor = color;

        }

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
        private refreshEquipWearState(state: boolean) {
            // this.m_labWear.visible=true;
            this.m_labWear.text = state ? GCode(CLEnum.EQUIP_ZB_WCD):GCode(CLEnum.EQUIP_ZB_YCD);
            this.m_labWear.textColor = state ? GameConfig.TextColors.red : GameConfig.TextColors.green;
        }
        /**刷装备名字 */
        private refreshEquipName() {
            if (!this.m_labEquipName) return;
            if (this.m_nItemId > 0) {
                Utils.setPropLabName(this.m_nItemId, this.m_labEquipName);
            } else {
                this.m_labEquipName.text = '';
            }
        }
        /**刷装备等级 */
        private refreshEquipLv() {
            if (!this.m_labEquipLv) return;
            if (this.m_nItemId > 0) {
                Utils.setPropLabLv(this.m_nItemId, this.m_labEquipLv);
            } else {
                this.m_labEquipLv.text = '';
            }
        }
        /**-装备总览start---------------------------------------------------------------------------------------------------------------------- */

        /**设置属性组显示 */
        public setInfoGroup(val: boolean) {
            if (!this.m_pInfoCon0) return;
            this.m_pInfoCon0.visible = val;
            this.m_pInfoCon1.visible = val;
            this.m_pInfoCon2.visible = val;
        }
        /**刷装备名字 */
        private reEquipName() {
            if (!this.m_labName) return;
            if (this.m_nItemId > 0) {
                Utils.setPropLabName(this.m_nItemId, this.m_labName);
            } else {
                this.m_labName.text = '';
            }
        }
        /**刷新阶数 */
        public reLevel(level: number, title: string = '') {
            if (!this.m_labSJLv) return;
            this.m_labSJLv.text = GCodeFromat(CLEnum.GRADE2,level);
        }
        /**刷新强化 */
        public reStreng(level: number, title: string = '') {
            if (!this.m_labQh) return;
            this.m_labQh.text =GCode(CLEnum.STRENG) + level;
        }
        /**刷新精炼 */
        public reWrought(level: number, title: string = '') {
            if (!this.m_labWrought) return;
            this.m_labWrought.text =GCode(CLEnum.WROUGH) + level;
        }



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
        public refreshRedEffect() {
            let itemInfo = C.ItemConfig[this.m_nItemId];

            if (itemInfo && itemInfo.quality >= 5) {
                this.createLvEffect();
            } else {
                this.clearLvEffect();
            }
        }
        private createLvEffect() {
            if (this.m_eqLvEff) return;
            this.m_eqLvEff = NormalMcMgr.createMc(IETypes.EUI_EqLevelEff);
            this.m_eqLvEff.x = this.width / 2;
            this.m_eqLvEff.y = 49;
            this.m_pEffRoot.addChild(this.m_eqLvEff);
        }
        private clearLvEffect() {
            if (this.m_eqLvEff) {
                NormalMcMgr.removeMc(this.m_eqLvEff);
                this.m_eqLvEff = null;
            }
        }
        /**点击强化特效 */
        public createUpGradeEffect() {
            let effect = NormalMcMgr.createMc(IETypes.EUI_EqUpGradeEff, false);
            effect.playNorOnce(IETypes.EUI_EqUpGradeEff, () => {
                NormalMcMgr.removeMc(effect);
            }, this);
            
            effect.x = 50;
            effect.y = 50;
            this.m_pEffRoot.addChild(effect);
        }


        //=============================================================================================================================================
        //特效 end
        //============================================================================================================================================= 
    }
}