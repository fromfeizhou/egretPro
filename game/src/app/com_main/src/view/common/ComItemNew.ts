module com_main {
	/**
	 * 道具
	 */

    export class ComItemNew extends CComponent implements IFObject {
        public m_imgSoulMask: com_main.CImage;
        public m_pIconRoot: eui.Group;
        public m_imgBg: com_main.CImage;
        public m_imgIcon: com_main.CImage;
        public m_labCount: com_main.CLabel;
        public m_labName: com_main.CLabel;
        public m_imgQIcon: com_main.CImage;
        public m_pEffRoot: eui.Group;

        private m_generalEff: MCDragonBones;  //红品质特效
        private m_pItemId;

        protected m_bOpenTips = null;    //tips开启状态
        protected m_bOpenEff = true;   //物品特效

        public unAutoRemove: boolean;  //自动进入缓存堆栈
        private itemInfo: ItemConfig;
        private m_tParam: { state: string, openTips: boolean, openEff: boolean };//构造函数

        public static create(state: string = 'count', openTips: boolean = true, openEff: boolean = true): ComItemNew {
            let obj = ObjectPool.pop(com_main.ComItemNew, "com_main.ComItemNew", state, openTips, openEff);
            obj.init(state, openTips, openEff);
            NodeUtils.reset(obj);
            return obj;
        }

        public constructor(state: string = '', openTips: boolean = true, openEff: boolean = true) {
            super();
            this.skinName = Utils.getAppSkin("common/com_item_new.exml");
            this.m_tParam = { state: state, openTips: openTips, openEff: openEff };
        }

        public init(state: string = '', openTips: boolean = true, openEff: boolean = true) {
            if(state != '')this.currentState =  state;
            this.commitProperties();
            this.openTips = openTips;
            this.openEffect = openEff
        }

        /**对象池回收 */
        public onPoolClear() {
            this.setSkin(null)
        }

        $onRemoveFromStage(): void {
            if (this.unAutoRemove) return;

            this.$setParent(null);
            this.m_pItemId = null;
            this.m_imgIcon.source = '';
            this.openTips = false;
            this.openEffect = false;
            ObjectPool.push(this);
            super.$onRemoveFromStage(false);
        }

        public onDestroy(): void {
            if (this.$parent == null) return;
            Utils.removeFromParent(this);
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();
            // this.m_pIconRoot.cacheAsBitmap = true;

        }
        /**监听事件 */

        /**启用通用tips */
        public set openTips(val) {
            if (this.m_bOpenTips == val) return;
            this.m_bOpenTips = val;
            if (val) {
                EventManager.addTouchTapListener(this, this, this.onShowTip);
            } else {
                EventManager.removeEventListeners(this);
            }
            // if (val) {
            //     this.setTipsInfo();
            // } else {
            //     CTipsManager.clearTips(this);
            // }
        }
        public get openTips() {
            return this.m_bOpenTips;
        }
        /**弹出物品信息 */
        private onShowTip() {
            if (this.m_bOpenTips && this.m_pItemId > 0 && this.itemInfo.mainType != 18) {
                Utils.open_view(TASK_UI.TIP_CHECK_ITEM_INFO, { type: this.itemInfo.mainType, itemId: this.m_pItemId });
            }
        }
        /**启动红品质特效 */
        public set openEffect(val) {
            if (this.m_bOpenEff == val) return;
            this.m_bOpenEff = val;
            this.refreshEffect();
        }
        public get openEffect() {
            return this.m_bOpenEff;
        }

        /*修改tips */
        // private setTipsInfo() {
        //     // if (this.m_bOpenTips && this.m_pItemId > 0)
        //     // CTipsManager.addTips(this, { type: TipsEnum.Item, param: this.m_pItemId })
        //     Utils.open_view(TASK_UI.TIP_CHECK_ITEM_INFO, { type: this.itemInfo.mainType, param: this.m_pItemId });
        // }

        /**设置物品id 和 数量*/
        public setItemInfo(id: number, count: number = 0) {
            //由皮肤创建 没有执行初始化(初始化当前节点会塞入事件队里，避免主题初始化事件引用皮肤)
            if (this.m_tParam) {
                this.init(this.m_tParam.state, this.m_tParam.openTips, this.m_tParam.openTips);
                this.m_tParam = null;
            }

            if (this.m_pItemId == id) {
                this.refreshCount(count);
                this.refreshEffect();
                return;
            }
            this.m_pItemId = id;
            this.itemInfo = C.ItemConfig[this.m_pItemId];
            // this.setTipsInfo();
            this.refreshView(count);
            this.refreshEffect();
        }

        private refreshEffect() {
            if (this.m_bOpenEff && this.itemInfo && this.itemInfo.quality >= 5) {
                this.createGeneralEffect();
            } else {
                this.clearGeneralEffect();
            }
        }

        /**
         * 注意：该方式自动获取背包数量，自定义数量显示 使用接口setItemInfo
         * 设置物品id */
        public set itemId(id: number) {
            if (this.m_pItemId == id) return;
            this.m_pItemId = id;
            // this.setTipsInfo();
            this.refreshView();
            this.refreshEffect();
        }
        /**获得物品id */
        public get itemId() {
            return this.m_pItemId;
        }

        /**刷新显示 */
        private refreshView(count?: number): void {
            if (this.m_pItemId && this.m_pItemId > 0) {
                let info = PropModel.getCfg(this.m_pItemId);
                if (info) {
                    if (info.mainType == PropMainType.SOUL || info.mainType == PropMainType.SKILL_SOUL) {
                        this.m_pIconRoot.setChildIndex(this.m_imgIcon, 0);
                        this.m_imgIcon.mask = this.m_imgSoulMask;
                    } else {
                        this.m_pIconRoot.setChildIndex(this.m_imgBg, 0);
                        this.m_imgIcon.mask = null;
                    }
                    this.refreshIcon()
                    this.refreshName(info);
                    this.refreshQualityBg();
                    this.refreshCount(count);
                    this.refreshQuaIcon(info);
                }
            } else {
                this.resetViewState();
            }

        }
        /**重置显示 */
        private resetViewState(): void {
            this.m_imgIcon.source = "";
            this.m_imgBg.source = "";
            if (this.m_labName) {
                this.m_labName.text = "";
            }
            if (this.m_labCount) {
                this.m_labCount.text = "";
            }
            this.refreshQualityBg();

        }

        /**刷新图标 */
        private refreshIcon() {
            let image = PropModel.getPropIcon(this.m_pItemId);
            this.m_imgIcon.source = image;
        }

        /**刷新品质框 */
        private refreshQualityBg() {
            Utils.initPropkuang(this.m_imgBg, this.m_pItemId);
        }

        /**刷新名字 */
        private refreshName(config: ItemConfig) {
            if (this.m_labName) {
                Utils.setPropLabName(this.m_pItemId, this.m_labName)
            }
        }
        /**刷新碎片样式 */
        private refreshQuaIcon(info: ItemConfig) {
            if (info.mainType == PropMainType.EQUIP_SOUL || info.mainType == PropMainType.TREA_SOUL) {
                this.m_imgQIcon.visible = true;
                this.m_imgQIcon.source = PropModel.getQualitySoulIcon(this.m_pItemId);
            } else {
                this.m_imgQIcon.visible = false;
            }
        }

        /**刷新数量 */
        public refreshCount(count?: number) {
            if (this.m_labCount) {
                if (count) {
                    if (count > 1) {
                        this.m_labCount.text = CommonUtils.numOutLenght(count);
                    } else {
                        this.m_labCount.text = "";
                    }
                } else {
                    // let num = PropModel.getPropNum(this.m_pItemId);
                    // if (num > 0) {
                    //     this.m_labCount.text = CommonUtils.numOutLenght(num);
                    // } else {
                    this.m_labCount.text = "";
                    // }
                }

            }
        }
        /**刷新数量 50/1 */
        public refresVal2Max(val: number, max: number) {
            if (this.m_labCount) {
                Utils.setRedProcessText(this.m_labCount, val, max);
            }
        }
        /**刷新数量 */
        // public setCostColor(color) {
        //     if (this.m_labCount)
        //         return this.m_labCount.textColor = color;
        // }

        //=============================================================================================================================================
        //特效 begin
        //============================================================================================================================================= 
        /**设置红品质特效 */
        private createGeneralEffect() {
            if (this.m_generalEff) return;
            this.m_generalEff = NormalMcMgr.createMc(IETypes.EUI_EqLevelEff);
            this.m_pEffRoot.addChild(this.m_generalEff);
        }
        private clearGeneralEffect() {
            if (this.m_generalEff) {
                NormalMcMgr.removeMc(this.m_generalEff);
                this.m_generalEff = null;
            }
        }
        //=============================================================================================================================================
        //特效 end
        //============================================================================================================================================= 
    }
}