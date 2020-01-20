module com_main {
    export class ObserveResultRender extends CComponent {

        public comHead: com_main.ComHeadItem;
        public lb_name: eui.Label;

        public name: string;

        public constructor(arg) {
            super();
            this.skinName = Utils.getAppSkin("battle_new/gongchengzhan/ObserveResult.exml");
            this.name = arg.name;
        }


        protected childrenCreated(): void {
            super.childrenCreated();

            this.lb_name.text = this.name;
        }


    }


}