//跨服战动画
module com_main {

    export class CrossHero extends eui.Component {

        private headInfo: BattleHeadInfo;
        private square: CSquare;
        private m_data:{startPoint: Point,endPoint: Point, faction: number,playerName: string};

        public constructor(data:{startPoint: Point,endPoint: Point, faction: number,playerName: string}) {
            super();
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
            this.m_data = data;
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            // var square = CSquare.createId(this.m_data.gId, false, true);
            var square = CSquare.createId(1008, false, true);
            square.test = true;
            this.square = square;
            this.addChild(this.square);

            square.changeStatus(2);
            let radian: number = Utils.MathUtils.getRadian2(this.m_data.startPoint.x, this.m_data.startPoint.y, this.m_data.endPoint.x, this.m_data.endPoint.y);
            let angle1: number = Math.atan2(Math.sin(radian), Math.cos(radian)) * 180 / Math.PI;
            square.setDirectionOnAngle(angle1);

            let headInfo = new BattleHeadInfo();
            headInfo.anchorOffsetX = headInfo.width / 2;
            headInfo.anchorOffsetY = headInfo.height / 2;
            headInfo.x = 64;
            headInfo.y = -18 - 25;

            headInfo.showFactionName({name: this.m_data.playerName, faction: this.m_data.faction});
            square.addChild(headInfo);

            this.x = this.m_data.startPoint.x;
            this.y = this.m_data.startPoint.y + 15;

            let crossServerConst: CrossServerConstConfig = C.CrossServerConstConfig[CrossServerConstType.TEAM_MOVE_TIME];
            let time = Number(crossServerConst.value) * 1000;

            Tween.get(this).to({ x: this.m_data.endPoint.x, y: this.m_data.endPoint.y + 15 }, time).call(() => {
                Utils.removeFromParent(this);
            });
        }

        public onDestroy(): void {
            Tween.removeTweens(this);
        }
    }
}