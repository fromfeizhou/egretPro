module com_main {

  export class WorldXiangYangComp extends CComponent {

        public static create() {
            let obj = ObjectPool.pop(WorldXiangYangComp, "WorldXiangYangComp");
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
            this.skinName = Utils.getAppSkin("world/WorldXiangYangCompSkin.exml");
        }
        
    }

}