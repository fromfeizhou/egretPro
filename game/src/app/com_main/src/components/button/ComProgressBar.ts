
module com_main {
	/**
	 *
	 * @author
	 *
	 */
	export class ComProgressBar extends CComponent {

		private m_Bar: CImage;
		
		private _progress:number;


		public get Progress():number{
			return this._progress;
		}
		public set Progress(progress:number){
			if(progress>1)
				this._progress = 1;
			else if(progress<0)
				this._progress = 0;
			else
				this._progress = progress;
			this.refresh();
		}

		public constructor() {
			super();
		}

		protected createChildren(): void {
			super.createChildren();
		}

		private refresh():void{
			egret.callLater(() => {
				if (this.m_Bar) {
					this.m_Bar.width = this._progress * this.width;
				}
			}, this);
		}

		$onRemoveFromStage(isclear = true): void {
			super.$onRemoveFromStage(false);
		}
	}
}

