// TypeScript file


module com_main {
	/**
	 * vip客服
	 */
    export class ServiceWnd extends CView {
        public static NAME = 'ServiceWnd';
        public m_apopUp: com_main.APopUp;
        public m_imgGM: eui.Image;
        public m_labMsg0: eui.Label;
        public m_labMsg1: eui.Label;
        public m_labMsg2: eui.Label;
        public m_labMsg3: eui.Label;
        public m_labMsg4: eui.Label;
        public m_labMsg5: eui.Label;
        public m_labWx: eui.Label;
        public m_pBtnCopy: eui.Group;
        public m_pRoot: eui.Group;

        private m_loader: egret.URLLoader;
        private m_strWX: string = 'vipkefu77'

        public constructor(data?) {
            super();
            this.name = ServiceWnd.NAME;
            this.initApp("service/ServiceWndSkin.exml");

        }

        public onDestroy(): void {
            super.onDestroy();
            this.m_loader.removeEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.SERVICE_UI]);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_apopUp.setTitleLabelVisible(false);
            this.m_imgGM.source = LoginConst.getResUrl('jzGm.jpg', 'gmInfo')
            EventManager.addTouchScaleListener(this.m_pBtnCopy, this, this.onVipServiceBtn);

            this.m_loader = new egret.URLLoader();
            this.m_loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
            this.m_loader.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
            var request = new egret.URLRequest(LoginConst.getResUrl('jzGm.json?v=' + GameConfig.version, 'gmInfo'));
            request.requestHeaders = [new egret.URLRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")];
            this.m_loader.load(request);
        };

        private onLoadComplete(event) {
            var serverRequest = this.m_loader.data;
            if (!this.m_loader.data || this.m_loader.data == '') return;
            var data = JSON.parse(this.m_loader.data);
            /**
             * {"info":"单身","age":"22","name":"fuck me","height":"165cm","weight":"48kg","star":"射手座","city":"广州","wx":"vipkefu77",
             * "server":[["1.专属通道","VIP1v1"],["1.专属通道","VIP1v1"],["2.专属通道","VIP1v1"],["3.专属通道","VIP1v1"],["4.专属通道","VIP1v1"]]}
             */

            this.m_labMsg0.text = data['info'];
            this.m_labMsg1.text = data['age'];
            this.m_labMsg2.text = data['height'];
            this.m_labMsg3.text = data['weight'];
            this.m_labMsg4.text = data['star'];
            this.m_labMsg5.text = data['city'];

            this.m_strWX = data['wx'] || this.m_strWX;
            this.m_labWx.text = `VIP客服微信：${this.m_strWX}`;

            for (let i = 0; i < data['server'].length; i++) {
                let serviceCell = new ServiceCellComp();
                serviceCell.setTitle(data['server'][i][0], data['server'][i][1]);
                this.m_pRoot.addChild(serviceCell);
            }
        }


        //复制
        private onVipServiceBtn() {
            // egret.ExternalInterface.call("sendToCopy", this.m_strWX);
            // copyBoard(this.m_strWX);
            // EffectUtils.showTips(GCode(CLEnum.SERVICE_WND), 1);
        }

    }
    /**vip客服专属服务条例 */
    export class ServiceCellComp extends CComponent {
        public m_labTitle: eui.Label;
        public m_labDoc: eui.Label;

        private m_sTitle: string;
        private m_sDoc: string;
        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("service/ServicecCellSkin.exml");
            this.touchEnabled = false;
            this.touchChildren = false;
        }
        public setTitle(title: string, doc: string) {
            this.m_labTitle.text = title;
            this.m_labDoc.text = doc;
        }

    }
}

