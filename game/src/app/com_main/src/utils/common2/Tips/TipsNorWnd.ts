/**
  * tips类
  * All Rights Reserved. 
  * 提示相关信息
  */
module com_main {
     export interface ITipsNor {
        title: string;
        des: string;
    }
    export class TipsNorWnd extends CView {
        public static NAME = 'TipsNorWnd';

        public m_labTitle: eui.Label;
        public m_labDes: com_main.CLabel;

        private m_sTitle: string = "";
        private m_sDes: string = "";

        public constructor(data:ITipsNor) {
            super();
            this.m_sTitle = data.title;
            this.m_sDes = data.des;
            this.name = TipsNorWnd.NAME;
            this.initApp("common/tips/TipsNorWndSkin.exml");
        }
        protected childrenCreated(): void {
            super.childrenCreated();
            
            this.m_labTitle.text = this.m_sTitle;
            this.m_labDes.textFlow =Utils.htmlParser(this.m_sDes);;

            var width = this.m_labDes.width;
            if (width > 400) {
                this.m_labDes.width = 400;
            }
        }
    }
}

