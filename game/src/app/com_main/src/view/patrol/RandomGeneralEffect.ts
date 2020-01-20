//挂机界面动画
module com_main {

    /**随机路线数据 */
    export interface RandomRouteData {
        routeId: number,
        gId: number,
        playerInfo: gameProto.IPatrolRandomPlayer
    }

    /**武将状态 */
    export const enum EumGeneralEffType {
        /**占用状态 */
        BUSY = 1,
        /**空闲状态 */
        FREE = 2
    }


    export class RandomGeneralEffect extends eui.Component {
        public m_data: RandomRouteData;
        public m_step: number;
        public m_speed: number;
        public m_status: EumGeneralEffType;
        public routeConfig: GuajiRouteConfig;
        public square: CSquare;
        public constructor(data: RandomRouteData) {
            super();
            this.m_data = data;
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            var square = CSquare.createId(this.m_data.gId, false, true);
            square.test = true;
            this.square = square;
            this.addChild(this.square);
            this.initByGid(this.m_data);

            // this.m_data.playerInfo.countryId

            let headInfo = new GeneralHeadTitle();
            headInfo.setData({ countryId: this.m_data.playerInfo.countryId, name: this.m_data.playerInfo.nickName, factName: this.m_data.playerInfo.guildName, isSelf: false });
            headInfo.anchorOffsetX = headInfo.width / 2;
            headInfo.anchorOffsetY = headInfo.height / 2 + 40;
            headInfo.x = 64;
            headInfo.y = -18 - 35;
            square.addChild(headInfo);
        }

        public onDestroy(): void {
            this.visible = false;
            Tween.removeTweens(this);
            Tween.removeTweens(this.square);
            this.m_status = EumGeneralEffType.FREE;
        }

        public initData(data: RandomRouteData) {
            this.m_data = data;
            this.m_step = 1;
            this.routeConfig = C.GuajiRouteConfig[data.routeId];
            this.m_speed = this.routeConfig.speed;
        }

        public initByGid(data: RandomRouteData) {
            this.initData(data);
            this.visible = true;
            this.square.initId(data.gId);
            this.square.changeStatus(2);
            this.square.changeDirection(1);
            this.playNextStep();
            // this.alpha = 0;
            // this.square.alpha = 0;

            this.m_status = EumGeneralEffType.BUSY;
        }

        public isFree() {
            return this.m_status == EumGeneralEffType.FREE;
        }

        public playNextStep() {
            let code: string = this.routeConfig["step" + this.m_step];
            let arr = code.split(':');
            if (arr[0] == "start") {
                this.playStart(arr);
            } else if (arr[0] == "walk") {
                this.playWalk(arr);
            } else if (arr[0] == "stand") {
                this.playStand(arr);
            } else if (arr[0] == "end") {
                this.playEnd(arr);
            }
            this.m_step = this.m_step + 1;
            if (this.m_step == 4) {
                this.showTalk();
            }
        }

        public playStart(codeArr: any[]) {
            let point = JSON.parse(codeArr[1]);
            let x = point[0];
            let y = point[1];
            let time = Number(codeArr[2]);
            this.square.x = x;
            this.square.y = y;

            // Tween.get(this.square).to({alpha:1},3000);
            Tween.get(this.square).wait(time).call(this.playNextStep, this);
        }

        public playWalk(codeArr: any[]) {
            let point = JSON.parse(codeArr[1]);
            let x = point[0];
            let y = point[1];
            let time = Number(codeArr[2]);

            let cpos: egret.Point = new egret.Point(this.square.x, this.square.y);
            let tpos: egret.Point = new egret.Point(x, y);
            this.square.setDirectionOnPos(cpos, tpos);
            this.square.changeStatus(CSquare_Status.STATUS_WALK);

            time = MathUtils.getInstance().getPosDis(cpos, tpos) / this.m_speed * 1000;
            Tween.get(this.square).to({ x: x, y: y }, time).call(this.playNextStep, this);
        }

        public playStand(codeArr: any[]) {
            let time = Number(codeArr[2]);
            this.square.changeStatus(CSquare_Status.STATUS_STAND);
            Tween.get(this.square).wait(time).call(this.playNextStep, this);

        }

        public playEnd(codeArr: any[]) {
            // console.log("路线跑完。。。。。。。。结束");
            // EventMgr.dispatchEvent(EventEnum.RANDOM_GENERAL_END,this.m_data.id);
            this.onDestroy();
        }

        public showTalk() {
            let content = PatrolModel.getGeneralTalk();
            if (content) {
                let talkFrame = new TalkFrame(content, 3000);
                // Utils.addChild(this.m_pOtherInfoNode, talkFrame);
                egret.callLater(() => {
                    if (talkFrame) {
                        let x = talkFrame.width / 2 + 15;
                        let y = - 50 - talkFrame.height;
                        talkFrame.x = x;
                        talkFrame.y = y;
                    }
                }, this);
                // talkFrame.y = -150;
                Utils.addChild(this.square, talkFrame);
            }
        }

    }
}