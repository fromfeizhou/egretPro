
module com_main {
	/**
	 *
	 * @author
	 *
	 */
    export class ComPayButton extends ComCostButton {
        public set cost(cost: number) {
            if (PlatConst.isRmbPay()) {
                this.setCostImg('');
                this.setCostLabel('￥ ' + cost);
            } else {
                this.setCostLabel(cost.toString());
                this.setImagePropId(PropEnum.YU);
            }
        }
        /**设置按钮文本（移除价格显示） */
        public set otherLabel(str: string) {
            this.setCostImg('');
            this.setCostLabel(str);
        }
    }
}

