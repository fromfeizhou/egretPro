module Mini {
    export class LoginServerList extends CMaskWnd {

        public static NAME = 'LoginServerList';

        private m_tList: eui.List[];    //服务器列表（事件移除存储）

        public constructor() {
            super();
            this.width = GameConfig.curWidth();
            this.height = GameConfig.curHeight();
        }

        public onDestroy() {
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.setTitle('选择服务器')
            this.setSize(847, 684);

            this.createStatusIcon(458, 1);
            this.createStatusIcon(581, 2);
            this.createStatusIcon(694, 3);

            this.m_tList = [];

            let list = ServerList.getDatas();
            list.sort((a, b) => {
                if (a.rec) return -1;
                if (b.rec) return 1;
                return a.id - b.id;
            });
            this.createList('推荐服务器', list)
            this.initEvent();
        }

        /**创建标识 */
        private createStatusIcon(dx: number, status: number) {
            let label = LoginConst.createLabel('', dx + 54, 75, 24, 0xffffff);
            label.textFlow = new egret.HtmlTextParser().parser(LoginConst.getSerStateLab(status));
            this.m_pRoot.addChild(label);

            let img = LoginConst.createImage(`login_status_${status}.png`, dx + 10, 70);
            this.m_pRoot.addChild(img);
        }

        /**创建服务器列表 */
        private createList(title: string, list: IServerData[]) {
            let line = LoginConst.createImage('line_1006.png', 0, 150, 847);
            this.m_pRoot.addChild(line);

            let l_line = LoginConst.createImage('line_011.png', 159, 125);
            this.m_pRoot.addChild(l_line);

            let r_line = LoginConst.createImage('line_011.png', 690, 125);
            r_line.scaleX = -1;
            this.m_pRoot.addChild(r_line);

            let labTitle = LoginConst.createLabel(title, 0, 115, 26, 0xABB7D1);
            labTitle.horizontalCenter = 0;
            this.m_pRoot.addChild(labTitle);

            let scroll = new eui.Scroller;
            scroll.x = 16;
            scroll.y = 155;
            scroll.width = 817;
            scroll.height = 520;
            this.m_pRoot.addChild(scroll);

            let euiList = new eui.List;
            euiList.dataProvider = new eui.ArrayCollection(list);
            euiList.itemRenderer = ServerItemRender;
            let layout = new eui.TileLayout();
            layout.horizontalGap = 22;
            layout.paddingLeft = 42.5;
            euiList.layout = layout;
            scroll.addChild(euiList);
            scroll.viewport = euiList;

            this.m_tList.push(euiList);
        }



        private initEvent() {
            for (let i = 0; i < this.m_tList.length; i++) {
                this.m_tList[i].addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemSelected, this);
            }
        }

        private removeEvent() {
            for (let i = 0; i < this.m_tList.length; i++) {
                this.m_tList[i].removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemSelected, this);
            }
        }

        public onItemSelected(e: eui.ItemTapEvent) {
            let data = e.item as IServerData;
            if (data) {
                LoginManager.changeServerSel(data.id);
                this.onDestroy();
            }
        }

    }

    class ServerItemRender extends eui.ItemRenderer {
        private m_tData: IServerData;

        private m_imgState: eui.Image;
        private m_labName: eui.Label;

        private m_newImg: eui.Image;
        public constructor() {
            super();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let imgBg = LoginConst.createImage('zyt_23.png');
            this.addChild(imgBg);

            this.m_imgState = LoginConst.createImage('', 295, 29);
            this.addChild(this.m_imgState);

            this.m_labName = LoginConst.createLabel('', 60, 33, 24, 0xffffff);
            this.addChild(this.m_labName);

            this.m_newImg = LoginConst.createImage('zyt_40.png',-10,-8);
            this.addChild(this.m_newImg);

            this.touchChildren = false;
        }


        protected dataChanged() {
            this.m_tData = this.data;
            if (this.m_tData) {
                this.m_labName.textFlow = new egret.HtmlTextParser().parser(`${this.m_tData.name} ${LoginConst.getSerStateLab(this.m_tData.status)}`);

                let status =  this.m_tData.status;
                if(status == 4) status = 2;     //新服 流畅服 用绿色的
                this.m_imgState.source = LoginConst.getResUrl("login_status_" + status + ".png");

                if(this.m_tData.status == 4){
                    this.m_newImg.visible = true;
                }else{
                    this.m_newImg.visible = false;
                }
            }
        }


    }
}