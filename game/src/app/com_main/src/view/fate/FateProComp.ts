module com_main {

    export class FateProComp extends CComponent {

        public static create(state: string) {
            let obj = ObjectPool.pop(FateProComp, "FateProComp", state);
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
        public init(state: string = 'base') {
            NodeUtils.reset(this);
            this.currentState = state;
            this.commitProperties();
        }
        public constructor(state: string) {
            super();
            this.skinName = Utils.getAppSkin("fate/comp/FateProCompSkin.exml");
            this.init(state);
        }

    }

}