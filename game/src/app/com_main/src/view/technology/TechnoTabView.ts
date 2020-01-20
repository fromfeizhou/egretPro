module com_main {
    export class TechnoTabView extends CView {
        public static NAME = 'TechnoTabView';

        public m_pCellRoot: eui.Group;

        private m_nType: TechnoType;
        private m_bInit:boolean;
        
        public constructor(type: TechnoType, width: number, height: number) {
            super();
            this.name = TechnoTabView.NAME;
            this.m_nType = type;
            this.width = width;
            this.height = height;
            this.initApp("technology/TechnoTabViewSkin.exml");
        }

        protected listenerProtoNotifications(): any[] {
            return [

            ];
        }

        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
            }
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            super.onDestroy();
        }


        protected childrenCreated(): void {
            super.childrenCreated();
           
        }
        public onShow(){
            if(this.m_bInit) return;
            this.m_bInit = true;
             let posList: { [key: number]: IPos } = {};
            let list = TechnoModel.getTechVosByType(this.m_nType);
            let bgRoot = new eui.Group();
            this.m_pCellRoot.addChild(bgRoot);

            for (let i = 0; i < list.length; i++) {
                let vo = list[i];
                let cell = new TechnoCell(list[i].id);
                cell.openEvent();
                let gidPos = vo.gidPos;
                // 188 200
                cell.x = 144 + (gidPos.col - 1) * 188;
                cell.y = 90 + (gidPos.row - 1) * 125;
                posList[vo.id] = { x: cell.x, y: cell.y };
                this.m_pCellRoot.addChild(cell);
            }
            for (let i = 0; i < list.length; i++) {
                let vo = list[i];
                let lvCfg = TechnoModel.getTechnoLvCfg(vo.id, vo.level);
                if (!lvCfg) return;
                let limit = StringUtils.keyValsToNumberArray(lvCfg.limitTechs);
                for (let k = 0; k < limit.length; k++) {
                    let data = limit[k];
                    if (data.value > 0) {
                        let start = posList[data.key];
                        let end = posList[vo.id];
                        this.createLine(bgRoot,start, end);
                    }
                }
            }
            bgRoot.cacheAsBitmap = true;
        }

        /**创建连线 */
        private createLine(bgRoot:eui.Group,start: IPos, end: IPos) {
            let img = new eui.Image('icon_suolian_png');
            img.fillMode = egret.BitmapFillMode.REPEAT;
            let width = Utils.MathUtils.getPosDis(start, end);
            img.width = width;
            img.height = 10;
            img.rotation = Utils.MathUtils.getPosAngle(start, end);
            let pos = Utils.MathUtils.getMid2Pos(start, end);
            img.x = pos.x;
            img.y = pos.y;
            AnchorUtil.setAnchorCenter(img);
            bgRoot.addChild(img);
        }
    }
}