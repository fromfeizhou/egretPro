module com_main {
    export class ComState extends CComponent {
        public static NAME = 'ComState';

        public m_imgFlag: eui.Image;
        public m_labName: eui.Label;


        private m_nStateId: number;
        private m_nDefName: string;

        public constructor() {
            super();
            this.name = ComState.NAME;
            // this.skinName = Utils.getAppSkin("common/ComStateSkin.exml")
        }

          $onRemoveFromStage(): void {
            super.$onRemoveFromStage(false);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.cacheAsBitmap = true;
            this.commitProperties();
        }

        /**设置国家id */
        public get stateId() {
            return this.m_nStateId;
        }
        public set stateId(id: number) {
            if (this.m_nStateId == id) return;
            this.m_nStateId = id;
            this.refreshView();
        }

        /**设置中立 群雄等默认字段 */
        public setDefautName(val: string, size: number = 22) {
            this.m_nDefName = val;
            this.m_labName.size = size;
        }

        /**显示刷新 */
        private refreshView() {
            switch (this.currentState) {
                case 'nor5': {
                    this.m_imgFlag.source = Utils.getCountyBigiFlagById(this.m_nStateId);
                    break;
                }

                default: {
                    let defName = this.m_nDefName ? this.m_nDefName : GCode(CLEnum.STATE_YE);
                    this.m_imgFlag.source = Utils.getCountyMiniFlagById(this.m_nStateId);
                    this.m_labName.text = Utils.getCountryName(this.m_nStateId,defName);
                    this.m_labName.textColor = Utils.getCountryColor(this.m_nStateId);
                    break;
                }
            }
        }

    }
}