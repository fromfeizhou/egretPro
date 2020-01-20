module com_main {

    export class WorldCityFirstAwardComp extends CComponent {
        public m_imgHeadMask: eui.Image;
        public m_imgHead: eui.Image;

        public static create() {
            let obj = ObjectPool.pop(WorldCityFirstAwardComp, "WorldCityFirstAwardComp");
            return obj;
        }

        /**对象池回收 */
        public onPoolClear() {
            this.setSkin(null)
        }

        public onDestroy() {
            Utils.removeFromParent(this);
            ObjectPool.push(this);
            super.onDestroy();
        }

        $onRemoveFromStage(): void {
            EventManager.removeEventListeners(this);
            super.$onRemoveFromStage(false);
        }

        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("world/WorldCityFirstWardCompSkin.exml");
        }
        public setHero(genId: number) {
            this.m_imgHead.mask = this.m_imgHeadMask;
            let genCfhg: GeneralConfig = C.GeneralConfig[genId]
            this.m_imgHead.source = GeneralModel.getSoldierLogo(`${genCfhg.role}`);
        }
    }

}