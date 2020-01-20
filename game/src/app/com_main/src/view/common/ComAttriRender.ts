module com_main {
    export interface ComAttriRD {
        state: string;
        name: string;
        value: string;
        isGay?: boolean;
    }
    /**属性 */
    export class ComAttriRender extends eui.ItemRenderer {
        public m_labName: eui.Label;
        public m_labVal: eui.Label;

        protected m_tData: ComAttriRD;
        protected m_bInit: boolean;

        public constructor() {
            super();
        }
        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

        }

        protected dataChanged() {
            this.m_tData = this.data;
            if (!this.m_bInit) {
                this.m_bInit = true;
                this.currentState = this.m_tData.state;
                this.commitProperties();
            }

            this.refresh();

            let isGay = this.m_tData.isGay;
            if (isGay == null) return;
            Utils.isGray(isGay, this);
        }

        protected refresh() {
            this.m_labName.text = this.m_tData.name;
            this.m_labVal.text = this.m_tData.value;
        }
    }


    /**属性 */
    export class ComAttriRenderII extends ComAttriRender {

        public constructor() {
            super();
        }

        protected refresh() {
            this.m_labName.text = this.m_tData.name;
            this.m_labVal.textFlow = Utils.htmlParser(this.m_tData.value);
        }
    }
}