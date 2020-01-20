module com_main {
	/**
	 * 军备主面板
	 */

    export interface IArmsTabView {
        changeType(type: SoldierMainType): void;
    }

    //界面参数
    export interface IArmsWndData {
        tagId?: number,
        soldierType?: SoldierMainType
    }

    export class ArmsWnd extends CView {
        public static NAME = 'ArmsWnd';
        public static Types = [SoldierMainType.ARROWSOLDIER, SoldierMainType.FOOTSOLDIER, SoldierMainType.RIDESOLDIER, SoldierMainType.PIKEMAN];

        public m_pViewRoot: eui.Group;
        public m_labTile: com_main.CLabel;
        public m_pItemRoot: eui.Group;
        public m_item0: com_main.ArmsTypeItem;
        public m_item1: com_main.ArmsTypeItem;
        public m_item2: com_main.ArmsTypeItem;
        public m_item3: com_main.ArmsTypeItem;
        public m_pMCRoot: eui.Group;
        public m_tabViewStack: eui.ViewStack;
        public m_conEffLab: eui.Group;
        public m_comTabGroup: com_main.ComTabGroup;
        public m_MainTopNew: com_main.MainTopNew;


        private m_nTagId: number;   //切卡
        private m_nSoldierType: SoldierMainType;//当前兵种

        private m_tItemList: ArmsTypeItem[]; //兵种类型数组
        private m_tViews: IArmsTabView[];

        private m_tParam: IArmsWndData;    //外部参数
        private m_tArmyMc: MCDragonBones;

        public constructor(param?) {
            super();
            this.name = ArmsWnd.NAME;
            this.m_tParam = param;
            this.initApp("arms/ArmsWndSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
            // this.clearMcEffect();
            if (this.m_tArmyMc) {
                GeneralMCMgr.removeMc(this.m_tArmyMc.dbName);
            }
            this.removeEvent();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_MainTopNew.setTitleName(GCode(CLEnum.ARMY));
            this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]);

            // this.standMCs = [];
            // this.attMCs = [];
            let tagBtb = [
                { name: GCode(CLEnum.ARMY_TAB_ZM) },
                { name: GCode(CLEnum.ARMY_TAB_SJ) },
            ];

            for (let i = 0; i < tagBtb.length; i++) {
                this.m_comTabGroup.addTabBtnData(tagBtb[i]);
            }
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            //兵种按钮

            this.m_tItemList = [];
            for (let i = 0; i < ArmsWnd.Types.length; i++) {
                let item = this[`m_item${i}`] as ArmsTypeItem;
                item.type = ArmsWnd.Types[i];
                this.m_tItemList.push(item);
                EventManager.addTouchTapListener(item, this, this.onItemClick);
            }
            //第二位 居中为当前选中对象
            this.m_nSoldierType = ArmsWnd.Types[1];

            //界面初始化
            let tagView1 = new com_main.ArmsTrain();
            let tagView2 = new com_main.ArmsUpgrade();

            this.m_tabViewStack.addChild(tagView1);
            this.m_tabViewStack.addChild(tagView2);
            this.m_tViews = [tagView1, tagView2];

            this.validateNow();

            let evtList = [RedEvtType.ARMS_TRAIN, RedEvtType.ARMS_GRADE];

            for (let i = 0; i < tagBtb.length; i++) {
                //红点处理
                RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(tagBtb[i].name),
                    { x: 132, y: -5 }, [evtList[i]], 2);

            }

            // this.validateNow();


            //设置切卡
            let tagId = 0;
            if (this.m_tParam && this.m_tParam.tagId) tagId = this.m_tParam.tagId;
            this.changeTag(tagId);
            //设置兵种
            let soldierType = (this.m_tParam && this.m_tParam.soldierType) ? this.m_tParam.soldierType : SoldierMainType.PIKEMAN;
            this.changeSoldierType(soldierType, false);
            this.addEvent();


            Utils.toStageBestScale(this.m_pViewRoot);

            /**检查新手引导面板条件 */
            this.onGuideCondition();

        }

        /**通过标签获取兵种类型 */
        private getRedEvtTypeByTagIndex(index: number): RedEvtType {
            switch (index) {
                case 1:
                    return RedEvtType.ARMS_GRADE;
                case 0:
                    return RedEvtType.ARMS_TRAIN;
            }
            return null;
        }

        /**兵种选项红点刷新 */
        private refreshArmsItem(type: RedEvtType): void {
            for (let i = 0; i < this.m_tItemList.length; i++) {
                this.m_tItemList[i].addRedEvent(type);
            }
        }

        //按钮点击回调
        private onItemClick(e: egret.Event): void {
            let item: ArmsTypeItem = e.currentTarget as ArmsTypeItem;
            if (item.type == this.m_nSoldierType) return;
            this.changeSoldierType(item.type);
        }

        /**切卡 */
        private changeTag(index: number) {
            if (this.m_nTagId == index) return;
            this.m_nTagId = index;
            this.m_comTabGroup.selectedIndex = index;
            this.m_tabViewStack.selectedIndex = index;

            if (this.m_nSoldierType) this.m_tViews[this.m_nTagId].changeType(this.m_nSoldierType);
            let type = this.getRedEvtTypeByTagIndex(index);
            this.refreshArmsItem(type);
            let ids = [IGUIDECD.ARMY_TAB_UP, IGUIDECD.ARMY_TAB_TRAI];
            this.onGuideConditionTab(ids[index]);
        }

        /**切换兵种 */
        private changeSoldierType(type: SoldierMainType, isAction: boolean = true) {
            let curId = 0;
            let targetId = 0;
            for (let i = 0; i < this.m_tItemList.length; i++) {
                let item = this.m_tItemList[i];
                if (item.type == this.m_nSoldierType) curId = i;
                if (item.type == type) targetId = i;
            }
            this.m_nSoldierType = type;

            //切换动画
            this.refreshTile();
            this.refreshMc();

            this.m_tViews[this.m_nTagId].changeType(this.m_nSoldierType);
            if (curId != targetId) {
                while (curId != targetId) {
                    this.doAction(targetId - curId, isAction);
                    curId = curId > targetId ? curId - 1 : curId + 1;
                }
            } else {
                //旋转动画
                this.doAction(0, isAction);
            }

        }

        /** 旋转动画 */
        private doAction(state: number, isAction: boolean = true): void {
            if (state < 0) {
                //左旋转
                let tmp = this.m_tItemList.pop();
                this.m_tItemList.unshift(tmp);
                this.m_pItemRoot.setChildIndex(tmp, 0);
            } else if (state > 0) {
                //右
                let tmp = this.m_tItemList.shift();
                this.m_tItemList.push(tmp);
                this.m_pItemRoot.setChildIndex(tmp, 0);
            }
            this.m_pItemRoot.setChildIndex(this.m_tItemList[1], this.m_pItemRoot.numChildren - 1);
            let posX = [0, 150, 300, 150];
            let scales = [0.7, 1, 0.7, 0.5];
            let alphas = [0.8, 1, 0.8, 0.5];
            for (let i = 0; i < this.m_tItemList.length; i++) {
                this.m_tItemList[i].doAction(posX[i], scales[i], alphas[i], isAction);
            }
        }

        //刷新标题
        private refreshTile(): void {
            let type: number = this.m_nSoldierType;
            let cfg = MainMapModel.getSoldierLvCfg(type);
            let lv = TeamModel.getTroopsInfo(type).level;
            this.m_labTile.text = GLan(cfg.name) + GCode(CLEnum.GRADE) + lv;
        }

        /**刷新动画 */
        private refreshMc() {
            let name = IETypes.EARMY_ARROWSOLDIER;
            switch (this.m_nSoldierType) {
                case SoldierMainType.FOOTSOLDIER:
                    name = IETypes.EARMY_FOOTSOLDIER
                    break;
                case SoldierMainType.RIDESOLDIER:
                    name = IETypes.EARMY_RIDESOLDIER
                    break;
                case SoldierMainType.PIKEMAN:
                    name = IETypes.EARMY_PIKEMAN
                    break;
            }
            if (this.m_tArmyMc) {
                GeneralMCMgr.removeMc(this.m_tArmyMc.dbName);
            }
            this.m_tArmyMc = GeneralMCMgr.createMc(name);
            this.m_pMCRoot.addChild(this.m_tArmyMc);
        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
        private addEvent() {
            EventMgr.addEvent(BuildEvent.SOLDIER_UPGRADE, this.onFinishUpgrade, this);
            EventMgr.addEvent(ArmyEvent.ARMY_FINISH, this.onFinishTrain, this);

        }

        private removeEvent() {
            EventMgr.removeEventByObject(BuildEvent.SOLDIER_UPGRADE, this);
            EventMgr.removeEventByObject(ArmyEvent.ARMY_FINISH, this);
        }
        /**训练完成 */
        private onFinishTrain(): void {
            this.showUpGradeEffect();
        }

        private onFinishUpgrade(e): void {
            this.refreshTile();
            if (e) {
                let type = e.armyType;
                let level = e.level;
                let res = TeamModel.getSoldierGradeAdd(type, level);
                if (res && res.length > 0) {
                    TipsUtils.showTipsFightUpList(res, new egret.Point(0, 0), this.m_conEffLab);
                }
            }
        }

		/**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

        /**检查新手引导面板条件 */
        public onGuideCondition() {
            EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.ARMY_WND);

        }

        /**检查新手引导面板条件 */
        public onGuideConditionTab(id: IGUIDECD) {
            if (id <= 0) return;
            EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, id);
        }

        /**=====================================================================================
		 * 动画 begin
		 * =====================================================================================
		 */

        /**建造升级完成 */
        public showUpGradeEffect() {
            let effect = NormalMcMgr.createMc(IETypes.EBuild_UpGrade, false);
            effect.playNorOnce(IETypes.EBuild_UpGrade, () => {
                NormalMcMgr.removeMc(effect);
            }, this);

            effect.scaleX = 2.2;
            effect.scaleY = 2.2;
            effect.x = 350;
            effect.y = 340;
            this.m_pViewRoot.addChild(effect);

            this.showLabEffect();
        }

        /**显示文本特效 */
        public showLabEffect() {
            let img = new eui.Image("lb_zc_mbcg_png");
            img.width = 362;
            img.height = 96;
            AnchorUtil.setAnchor(img, 0.5);
            img.x = 350;
            img.y = 360;
            this.m_pViewRoot.addChild(img);
            let actionY = img.y - img.height;

            let line = new eui.Image('line_1009_png');
            line.scale9Grid = new egret.Rectangle(247, 7, 71, 46);
            line.width = 700;
            AnchorUtil.setAnchor(line, 0.5);
            this.m_pViewRoot.addChild(line);
            line.x = img.x;
            line.y = actionY;

            //动画1
            let tw = egret.Tween.get(img);
            img.scaleX = 0.1;
            img.scaleY = 0.1;
            img.alpha = 0;

            tw.to({ scaleX: 1, scaleY: 1, alpha: 1, y: actionY }, 400, Ease.backOut);
            tw.wait(100);
            tw.to({ alpha: 0 }, 1000, Ease.cubicOut);
            tw.call(() => {
                if (img) {
                    Utils.removeFromParent(img);
                }
            }, this);

            //动画2
            let twLine = egret.Tween.get(line);
            line.scaleX = 0.1;
            line.scaleY = 0.1;
            line.alpha = 0;
            twLine.wait(200);
            twLine.to({ alpha: 1, scaleX: 1, scaleY: 1 }, 200, Ease.backOut);
            twLine.wait(100);
            twLine.to({ alpha: 0 }, 1000, Ease.cubicOut);
            twLine.call(() => {
                if (line) {
                    Utils.removeFromParent(line);
                }
            }, this);
        }
    }
}