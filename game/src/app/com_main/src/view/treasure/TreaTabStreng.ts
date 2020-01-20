module com_main {
    export class TreaTabStreng extends CView {
        public static NAME = 'TreaTabStreng';

        public m_pViewRoot: eui.Group;
        public m_labName: eui.Label;
        public m_treaIcon: com_main.TreaIconView;
        public m_comFightItem: com_main.ComFightItem;
        public m_pStarRoot: eui.Group;
        public m_treaInfo: com_main.TreaInfoComp;
        public m_treaLvComp: com_main.TreaLvComp;
        public m_treaStar: com_main.TreaStarComp;
        public m_treaInlay: com_main.TreaInlayComp;
        public m_btnLeft: eui.Group;
        public m_btnRight: eui.Group;
        public m_pInlayRoot: eui.Group;
        public m_stone0: com_main.TreaInlayStone;
        public m_stone1: com_main.TreaInlayStone;
        public m_stone2: com_main.TreaInlayStone;
        public m_stone3: com_main.TreaInlayStone;
        public m_pLabEffRoot: eui.Group;

        private m_tViews: TreaBaseComp[];
        private m_nCurIndex: number; //当前切卡
        private m_nItemId: number;   //当前宝物id
        private m_tTreaVo: TreasureVo;
        private m_tOwnerList: number[];

        public constructor(width: number, height: number, itemId: number) {
            super();
            this.name = TreaTabStreng.NAME;
            this.initApp("treasure/TreaTabStrengSkin.exml");
            this.width = width;
            this.height = height;
            this.m_nItemId = itemId;
        }

        public onDestroy(): void {
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            Utils.toStageBestScale(this.m_pViewRoot);
            this.m_tViews = [];
            this.m_tViews.push(this.m_treaInfo);
            this.m_tViews.push(this.m_treaLvComp);
            this.m_tViews.push(this.m_treaStar);
            this.m_tViews.push(this.m_treaInlay);

            this.initView();
            this.changeTag(0);
            this.addEvent();
        }


        private initView() {
            this.m_tTreaVo = TreasureModel.getData(this.m_nItemId);
            let isShow = this.m_tTreaVo ? false : true;

            this.m_tOwnerList = TreasureModel.getAllList(TreasureModel.isOwner(this.m_nItemId));
            if (this.m_tOwnerList.length == 1) {
                this.m_btnLeft.visible = false;
                this.m_btnRight.visible = false;
            } else {
                this.m_btnLeft.visible = true;
                this.m_btnRight.visible = true;
            }
            if (!this.m_tTreaVo) {
                this.m_tTreaVo = TreasureModel.getPreViewVo(this.m_nItemId);
            }
            this.m_treaInfo.baoWuFrom(isShow);
            if (this.m_tTreaVo) {
                this.refreshIcon();
                this.refreshStar();
                this.initStone();
                this.refreshLevel();
                this.refreshFight();
            }
        }

        /**设置itemId */
        public set itemId(val: number) {
            if (this.m_nItemId == val) return;
            this.m_nItemId = val;
            this.initView();
        }
        public get itemId() {
            return this.m_nItemId;
        }

        /**设置当前切卡 */
        public changeTag(index: number) {
            if (this.m_nCurIndex == index) return;
            this.m_nCurIndex = index;
            for (let i = 0; i < this.m_tViews.length; i++) {
                let isCur = i == index;
                this.m_tViews[i].visible = isCur;
                if (isCur) this.m_tViews[i].itemId = this.m_nItemId;
            }
            this.m_pInlayRoot.visible = index == 3;
        }



        /**刷新图标 */
        private refreshIcon() {
            this.m_treaIcon.setItemId(this.m_nItemId,true);
            this.m_treaIcon.createEffect();
            this.m_labName.text = this.m_tTreaVo.treaCfg.name
            Utils.setLabColorByQuality(this.m_labName, this.m_tTreaVo.quality);
        }

        /**刷新等级 */
        private refreshLevel() {

        }

        /**刷新战斗力 */
        private refreshFight(isAct: boolean = false) {
            if (this.m_tTreaVo) {
                this.m_comFightItem.setFight(this.m_tTreaVo.fight, isAct);
            }
        }

        /**刷新星级 */
        private refreshStar() {
            let starNum = this.m_tTreaVo.star;
            while (this.m_pStarRoot.numChildren > starNum) {
                this.m_pStarRoot.removeChildAt(0);
            }
            for (let i = this.m_pStarRoot.numChildren; i < starNum; i++) {
                let star = new eui.Image();
                star.source = "common_star_png";
                this.m_pStarRoot.addChild(star);
            }
        }

        /**初始化宝石 */
        private initStone() {
            if (!this.m_tTreaVo) return;
            let holes = this.m_tTreaVo.holes;
            for (let i = 0; i < holes.length; i++) {
                let cell = this[`m_stone${i}`] as TreaInlayStone;
                cell.setStoneInfo(holes[i].gemstoneId, i);
            }
            this.refresStoneLocked();
        }

        /**刷新解锁状态 */
        private refresStoneLocked() {
            if (!this.m_tTreaVo) return;
            let openNum = this.m_tTreaVo.holeOpenNum;
            for (let i = 0; i < 4; i++) {
                let cell = this[`m_stone${i}`] as TreaInlayStone;
                cell.setLockedState(openNum <= cell.holeId)
            }
        }


        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

        private addEvent() {
            EventManager.addTouchScaleListener(this.m_btnLeft, this, this.onBtnLeft);
            EventManager.addTouchScaleListener(this.m_btnRight, this, this.onBtnRight);

            EventMgr.addEvent(TreaEvent.TREA_LEVEL_UPDATE, this.onTreaLevel, this);
            EventMgr.addEvent(TreaEvent.TREA_STAR_UPDATE, this.onTreaStar, this);
            EventMgr.addEvent(TreaEvent.TREA_STONE_UPDATE, this.onTreaStone, this);

            for (let i = 0; i < 4; i++) {
                let cell = this[`m_stone${i}`] as TreaInlayStone;
                EventManager.addTouchTapListener(cell, this, this.onStoneCellHandler);
            }
        }

        private removeEvent() {
            EventMgr.removeEventByObject(TreaEvent.TREA_LEVEL_UPDATE, this);
            EventMgr.removeEventByObject(TreaEvent.TREA_STAR_UPDATE, this);
            EventMgr.removeEventByObject(TreaEvent.TREA_STONE_UPDATE, this);
        }

        /**镶嵌点击 */
        private onStoneCellHandler(e: egret.TouchEvent) {
            if (!this.m_tTreaVo) {
                return;
            }

            let cell = e.$currentTarget as TreaInlayStone;
            if (!cell) return;

            if (cell.isInLocked()) {
                let openLv = this.m_tTreaVo.getStoneOpenStar(cell.holeId);
                EffectUtils.showTips(GCodeFromat(CLEnum.TREA_BS_OPEN, openLv), 1, true);
                return;
            }

            let list = PropModel.getGemList(PropStoneType.ALL);
            if (list.length == 0 && cell.itemId == 0) {
                EffectUtils.showTips(GCode(CLEnum.TREA_BS_TIPS1), 1, true);
                return;
            }

            let param: any = { itemId: this.m_nItemId, pos: cell.holeId, oldStoneId: cell.itemId };
            Utils.open_view(TASK_UI.TREASURE_INLAY, param);
        }

        /**宝物等级刷新 */
        private onTreaLevel(data: { itemId: number, level: number }) {
            let list: string[] = [];
            if (data.level == 0) {
                EffectUtils.showTips(GCode(CLEnum.TREA_UP_TIPS1), 1, true);
                return;
            }
            if (data.level > 0) {
                list.push(GCodeFromat(CLEnum.LEVEL_ADD, data.level))
            } else {
                list.push(`${GCode(CLEnum.LEVEL2)}<font color=#ff0000>${data.level}</font>`);
            }
            this.doFightAct(list);
        }

        /**宝物星级刷新 */
        private onTreaStar() {
            this.refreshStar();
            this.refresStoneLocked();
            this.doFightAct([GCodeFromat(CLEnum.STAR_ADD, 1)]);
        }

        /**宝物宝石刷新 */
        private onTreaStone() {
            /**刷新宝石显示 */
            if (!this.m_tTreaVo) return;
            let holes = this.m_tTreaVo.holes;
            for (let i = 0; i < holes.length; i++) {
                let cell = this[`m_stone${i}`] as TreaInlayStone;
                cell.itemId = holes[i].gemstoneId;
            }
            this.doFightAct();
        }


        /**战力动画 */
        private doFightAct(list: string[] = []) {
            let oldFight = this.m_comFightItem.getFight();;
            let change = this.m_tTreaVo.fight - oldFight;
            if (change == 0) return;
            let res = change > 0 ? GCodeFromat(CLEnum.FIGHT_ADD, change) : GCodeFromat(CLEnum.FIGHT_CUT, change);
            list.push(res);
            TipsUtils.showTipsFightUpList(list, new egret.Point(0, 0), this.m_pLabEffRoot);
            this.refreshFight(true);
        }

        /**左切换 */
        private onBtnLeft() {
            this.changeTrea(true);
        }
        /**右切换 */
        private onBtnRight() {
            this.changeTrea();
        }

        /**切卡宝物 */
        private changeTrea(isLeft: boolean = false) {
            let index = this.m_tOwnerList.indexOf(this.m_nItemId);
            if (isLeft) index--;
            else index++;

            let length = this.m_tOwnerList.length;

            if (index < 0) {
                index = length - 1;
            }
            if (index >= length) {
                index = 0;
            }
            this.itemId = this.m_tOwnerList[index];
            //当前切卡刷新
            this.m_tViews[this.m_nCurIndex].itemId = this.m_nItemId;
        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */



    }
}