module com_main {
    export interface IHeadInfo {
        /**类型 0角色 1武将 2自定义 */
        type: number,
        /**角色id 武将id 自定义地址 */
        url: string,
        /**vip等级 */
        vip?: number,
        /**官职 */
        official?: number,
    }

    export class ComHeadItem extends CComponent {
        public static NAME = 'ComHeadItem';

        protected m_headItem: ComHeadItemView;
        private m_tInfo: IHeadInfo;

        public constructor() {
            super();
            this.name = ComHeadItem.NAME;
        }

        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
        }

        public onDestroy(): void {
            this.m_headItem.onDestroy();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_headItem = ComHeadItemView.create();
            this.addChild(this.m_headItem);
            if (this.m_tInfo) {
                this.m_headItem = ComHeadItemView.create();
                this.addChild(this.m_headItem);
                this.m_headItem.info = this.m_tInfo;
            }
        }

        public get info() {
            return this.m_tInfo;
        }
        public set info(val) {
            this.m_tInfo = val;
            if (this.m_headItem) this.m_headItem.info = val;
        }

        /**重置(纹理清理后 重新刷新ui) */
        public refreshIconView() {
            if (this.m_headItem) this.m_headItem.refreshIconView();
        }
    }

    export class ComHeadItemView extends CComponent {
        public m_imgMask: eui.Image;
        public m_imgHead: eui.Image;
        public m_imgBg: eui.Image;
        public m_imgVip: eui.Image;
        public m_pOfficial: eui.Group;
        public m_labOfficial: eui.Label;

        private m_tInfo: IHeadInfo;

        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("common/ComHeadItemSkin.exml")
        }

        public static create(): ComHeadItemView {
            let obj = ObjectPool.pop(com_main.ComItemNew, "com_main.ComHeadItemView");
            return obj;
        }

        /**对象池回收 */
        public onPoolClear() {
            this.setSkin(null)
        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage(false);
        }

        public onDestroy(): void {
            super.onDestroy();
            Utils.removeFromParent(this);
            ObjectPool.push(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_imgHead.mask = this.m_imgMask;
            this.cacheAsBitmap = true;
        }

        public get info() {
            return this.m_tInfo;
        }
        public set info(val) {
            val = val ? val : { type: 1, url: '0', official: 0, vip: 0 };
            this.m_tInfo = val;
            this.refreshView();
        }

        /**重置(纹理清理后 重新刷新ui) */
        public refreshIconView() {
            if (this.m_tInfo.url == '0') return;
            this.m_imgHead.source = '';
            this.m_imgHead.source = Utils.getPlayerHeadSource(this.m_tInfo.type, this.m_tInfo.url);
        }

        /**显示刷新头像 */
        private onRefreshImg() {
            if (this.m_tInfo.url == '0') {
                this.m_imgHead.source = 'common_smr_png';
                return;
            }
            this.m_imgHead.source = Utils.getPlayerHeadSource(this.m_tInfo.type, this.m_tInfo.url);
        }

        /**显示刷新 */
        private refreshView() {
            if (!this.m_tInfo) return;
            if (platform.isHidePayFunc()) this.m_tInfo.vip = 0;
            this.m_imgBg.source = VipModel.getVipSrc(this.m_tInfo.vip);
            this.m_imgVip.source = VipModel.getVipLabSrc(this.m_tInfo.vip);

            let isOffic = this.m_tInfo.official && this.m_tInfo.official > 0;
            this.m_pOfficial.visible = isOffic;
            if (isOffic) {
                let name = C.JobConfig[this.m_tInfo.official].name;
                this.m_labOfficial.text = GLan(name);
            }
            this.onRefreshImg();
        }

    }
}