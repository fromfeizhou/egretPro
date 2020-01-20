module com_main {
	/**
	 * pvp战报面板相关
	 */
    export class PvpNoticeView extends CView {
        public static NAME = 'PvpNoticeView';
        private readonly REQUEST_COUNT:number = 50;
      
        private m_pList:eui.List;
        private m_pApopUp:APopUp;
        


        public constructor() {
            super();
            this.name = PvpNoticeView.NAME;
            this.initApp("pvp_arena/PvpNoticeViewSkin.exml");
            PvpArenaProxy.send_APK_CHALLENGE_HIS(this.REQUEST_COUNT);
        }
        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.APK_GET_CHALLENGE_HIS,
               // ProtoDef.MISSION_ACTIVE_INFO,
            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.APK_GET_CHALLENGE_HIS:{
                    this.initNoticeList(body);
                    break;
                }default:{

                }
            }
        }

        public onDestroy(): void {
            super.onDestroy();
        }
        
        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_pApopUp.setBottomBorder();
            this.initView();
        }

        private initView(){
            let tempData = [];
            // tempData.push({name:"dfasdf"});
            // tempData.push({name:"234"});
            // tempData.push({name:"tehju"});
            // tempData.push({name:"qwer"});
            // tempData.push({name:"df"});
            // tempData.push({name:"qewr"});
            // tempData.push({name:"er"});
            // tempData.push({name:"d"});
            this.m_pApopUp.setTitleLabel(GCode(CLEnum.ARENA));
            this.m_pList.itemRenderer = PvpNoticeCell;
        }

        private initNoticeList(data:any){
            if(!data) return;
            let tempData = [];
            for(let key in data.apkChallengeHisVoList){
                let tempVo:ApkChallengeHisVo = ApkChallengeHisVo.create(data.apkChallengeHisVoList[key]);
                tempData.push(tempVo);
            }
            tempData.sort(
                (a,b)=>{
                    return b.challengeTime - a.challengeTime;
                }
            );

            this.m_pList.dataProvider = new eui.ArrayCollection(tempData);            
        }
    }
}