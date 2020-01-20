module com_main {
    export class MBuildPP extends CComponent {

        public static NAME = 'MBuildPP';
        private m_pIcon: eui.Image;//
        private m_pNum: eui.Label;//


        private m_pID: number = 0;
        private m_pIconType: PropEnum = 0;
        private m_pType: MBuildIconStatus = 0;

		/**
         * 销毁方法
         */
        public onDestroy() {
            super.onDestroy();

        }

        public get iconWidth() {
            return 74;
        }
        public get iconHeight() {
            return 90;
        }

        public set type(type: number) {
            if (this.m_pType == type) return;
            this.m_pType = type;
            this.setIcon();
        }

        public get type(): number {
            return this.m_pType;
        }

        public static create(id: number, type: number): MBuildPP {
            var obj = new MBuildPP(id, type);
            return obj;
        }
        /**征收点击 */
        public static resRecevice(buildId: number) {
            let build = MainMapModel.getBuildInfo(buildId);
            if (build) {
                switch (build.type) {
                    case BuildingType.FARMLAND:
                    case BuildingType.DWELLINGS:
                    case BuildingType.LOGGING_CAMP:
                    case BuildingType.IRON_WORKS:
                    case BuildingType.FUDING:
                    case BuildingType.TAVERN: {
                        MainMapProxy.send_BUILDING_LEVY(build.type);
                        break;
                    }
                }
            }
        }

        public constructor(id: number, type: number) {
            super();

            this.name = MBuildPP.NAME;

            this.m_pID = id;

            if (type != MBuildIconStatus.BuildItem)
                this.m_pIconType = MainMapModel.getValueIconType(id);
            else
                this.m_pIconType = id;
            this.m_pType = type;

            this.skinName = Utils.getAppSkin("map/map_build_pp.exml");

            this.touchEnabled = false;
            this.touchChildren = false;
        }

        protected childrenCreated() {
            super.childrenCreated();

            this.init();
        }

        public setNum(num: any, isMax: boolean = false) {
            this.m_pNum.text = num + '';

            let color = isMax ? 0xFEAD00 : 0xFFFDDD;

            this.m_pNum.textColor = color;
        }

        public get num() {
            return parseInt(this.m_pNum.text);
        }

        /**初始化 */
        private init() {
            this.setIcon();
        }

        public get iconType() {
            return this.m_pIconType;
        }

        private setIcon() {
            let texture = null;

            switch (this.m_pType) {
                case MBuildIconStatus.ZS: {
                    texture = PropModel.getPropIcon(this.m_pIconType);
                    break;
                }
                case MBuildIconStatus.UpAndZS: {
                    switch (this.m_pIconType) {
                        case PropEnum.FOOD: {
                            texture = 'common_up_2_png';
                            break;
                        }
                        case PropEnum.SILVER: {
                            texture = 'common_up_3_png';
                            break;
                        }
                        case PropEnum.IRON: {
                            texture = 'common_up_3_png';
                            break;
                        }
                        case PropEnum.BFS: {
                            texture = 'common_up_4_png';
                            break;
                        }
                        default: {
                            texture = 'common_up_1_png';
                            break;
                        }
                    }
                    break;
                }
                case MBuildIconStatus.UpLevel: {
                    texture = 'common_up_1_png';
                    break;
                }
                case MBuildIconStatus.BuildItem: {
                    texture = PropModel.getPropIcon(this.m_pIconType);
                    break;
                }
            }

            if (texture)
                this.m_pIcon.source = texture;
        }

        /**检测是否点中图标 */
        public check_is_touch(x: number, y: number): boolean {
            let res = this.m_pIcon.hitTestPoint(x, y);
            if (res) MBuildPP.resRecevice(this.m_pID);
            return res;
        }

        /**产出特效 */
        public showOutEffect(count: number) {
            if (count && count > 0) {
                if (MainMapModel.isNormalSourceBuilding(this.m_pID)) {
                    ZSEffectModel.onShowZSEffect(this.m_pIconType, 6, this, MainTopBar.getIconProObj(this.m_pIconType), 3);
                }
                let layer = MainMap.getLabelLayer();
                if (!layer) return;

                let txt: egret.BitmapText = new egret.BitmapText();
                txt.font = RES.getRes("font_source_fnt");
                txt.text = PropModel.getItemDesc(MainMapModel.getValueIconType(this.m_pID)) + "+" + count;
                txt.lineSpacing = -10;
                txt.x = this.x + this.width * 0.5;
                txt.y = this.y + this.height;
                AnchorUtil.setAnchor(txt, 0.5);
                txt.scaleX = 0;
                txt.scaleY = 0;
                let ty = txt.y - 40;
                Utils.addChild(layer, txt);
                egret.Tween.get(txt)
                    .to({ scaleX: 1, scaleY: 1, y: ty }, 500, Ease.backInOut)
                    .wait(1000)
                    .to({ alpha: 0 }, 500)
                    .call(() => { Utils.removeFromParent(txt); }, this);
            }
        }
    }
}