module com_main {
	/**
	 * 提示弹框
	 */
    export class PromptTextWnd extends CComponent implements IFObject {
        public static NAME = 'PromptTextWnd';
        public static LabelOffset: number = 42;
        private m_pTextbg: eui.Image;
        private m_pTextline1: eui.Image;
        private m_pTextline2: eui.Image;
        private m_pTextLabel: com_main.CLabel;

        public static create(str: string = "", isWarning: boolean = false, defaultSize: number = 50): PromptTextWnd {
            let obj = ObjectPool.pop(com_main.PromptTextWnd, "PromptTextWnd", str, isWarning, defaultSize);
            return obj;
        }

        public onDestroy() {
            Utils.removeFromParent(this);
            ObjectPool.push(this);
        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage(false);
        }

        public constructor(str: string = "", isWarning: boolean = false, defaultSize: number = 50) {
            super();
            this.name = PromptTextWnd.NAME;
            this.skinName = Utils.getAppSkin('common/PromptTextSkin.exml');
            this.touchEnabled = false;
            this.cacheAsBitmap = true;
            this.init(str, isWarning, defaultSize);
        }

        public init(str: string = "", isWarning: boolean = false, defaultSize: number = 50) {
            NodeUtils.reset(this);

            this.m_pTextLabel.textFlow = Utils.htmlParser(str);
            this.m_pTextLabel.stroke = 1;
            this.m_pTextLabel.strokeColor = 0x000000;
            // this.m_pTextLabel.textColor = isWarning ? GameConfig.TextColors.red : GameConfig.TextColors.fontWhite;

            if (this.m_pTextLabel.width + PromptTextWnd.LabelOffset >= defaultSize) {
                this.setWidth(this.m_pTextLabel.width + PromptTextWnd.LabelOffset);
            } else {
                this.setWidth(defaultSize);
            }
        }

        protected childrenCreated(): void {
            super.childrenCreated();
        }

        public setWidth(w) {
            this.width = w;
        }
        // public onDestroy(): void {
        //     super.onDestroy();
        //     EventManager.removeEventListeners(this);
        // }

    }
}