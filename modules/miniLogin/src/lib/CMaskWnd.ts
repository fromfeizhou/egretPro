module Mini {
	export class CMaskWnd extends eui.Component {
		private m_rectMask: eui.Rect;

		protected m_pRoot: eui.Group;
		private m_imgBg: eui.Image;
		private m_labTitle: eui.Label;
		private m_imgClose:eui.Image;

		public constructor() {
			super();
			this.width = GameConfig.curWidth();
			this.height = GameConfig.curHeight();
		}

		public onDestroy() {
			this.m_rectMask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onMaskClickListener, this);
			LoginConst.removeTouchEvent(this.m_imgClose, this.onMaskClickListener, this);
			if (this.parent) this.parent.removeChild(this);
		}


		protected childrenCreated() {
			super.childrenCreated();
			this.m_rectMask = new eui.Rect(GameConfig.curWidth(), GameConfig.curHeight(), 0x000000);
			this.m_rectMask.alpha = 0.6;
			this.addChild(this.m_rectMask);
			this.m_rectMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMaskClickListener, this);

			this.m_pRoot = new eui.Group();
			this.m_pRoot.horizontalCenter = 0;
			this.m_pRoot.verticalCenter = 0;
			this.addChild(this.m_pRoot);
			this.m_imgBg = new eui.Image(LoginConst.getResUrl('login_frame.jpg'));
			this.m_imgBg.scale9Grid = new egret.Rectangle(257,77,318,33);
			this.m_pRoot.addChild(this.m_imgBg);


			this.m_labTitle = new eui.Label('公 告');
			this.m_labTitle.y = 12;
			this.m_labTitle.horizontalCenter = 0;
			this.m_labTitle.size = 36;
			this.m_labTitle.textColor = 0xffff99;
			this.m_pRoot.addChild(this.m_labTitle);

			this.m_imgClose = LoginConst.createImage('close_btn.png',null,null,null,null,true);
			this.m_imgClose.top = -5;
			this.m_imgClose.right = -10;
			this.m_pRoot.addChildAt(this.m_imgClose,999);
			LoginConst.addTouchEvent(this.m_imgClose, this.onMaskClickListener, this);
		}

		protected setSize(width:number,heigth:number) {
			this.m_imgBg.width = width;
			this.m_imgBg.height = heigth;
		}

		protected setTitle(title: string) {
			this.m_labTitle.text = title;
		}

		private onMaskClickListener() {
			this.onDestroy();
		}
	}
}


