
module Mini {
    export class LoginNoticeWnd extends CMaskWnd {

        private m_loader: egret.URLLoader;
        private m_labDes: eui.Label;
        private m_sNotice: string;
        public constructor(notice?:string) {
            super();
            this.m_sNotice = notice;
        }

        public onDestroy() {
            if (this.m_loader) {
                this.m_loader.removeEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
                this.m_loader = null;
            }
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.setTitle('公 告');
            this.setSize(1044, 600);

            let scroll = new eui.Scroller();
            scroll.width = 986;
            scroll.height = 468;
            scroll.y = 91;
            scroll.horizontalCenter = 0;
            this.m_pRoot.addChild(scroll);
            let group = new eui.Group();
            scroll.addChild(group);
            scroll.viewport = group;

            this.m_labDes = new eui.Label();
            this.m_labDes.size = 26;
            this.m_labDes.width = 986;
            this.m_labDes.textColor = 0xaac7ff;
            this.m_labDes.lineSpacing = 10;
            this.m_labDes.touchEnabled = false;
            group.addChild(this.m_labDes);

            if (this.m_sNotice) {
                this.m_labDes.textFlow = new egret.HtmlTextParser().parser(this.m_sNotice);
            } else {
                this.m_loader = new egret.URLLoader();
                this.m_loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
                this.m_loader.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
                var request: egret.URLRequest = new egret.URLRequest(GameConfig.getNoticeUrl());
                this.m_loader.load(request);
            }
        }

        private onLoadComplete(event: egret.Event): void {
            var loader: egret.URLLoader = <egret.URLLoader>event.target;
            var noticeStr = loader.data as string;
            this.m_labDes.textFlow = new egret.HtmlTextParser().parser(noticeStr);
        }

    }
}