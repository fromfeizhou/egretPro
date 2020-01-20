/**本地数据模块
 * localData.ts 拓展
 */
class LocalModel {
   /**========================================================================================================
    * 日常通知预定义begin 需要在init函数 的 dayNotices添加
    *========================================================================================================
    */

	/**当天通知-普通 */
	public static DAY_NOTICE_NORMAL:string = "day.notice.normal";
    /**当天通知-建筑升级 */
    public static DAY_NOTICE_BUILD:string = "day.notice.build";
    /**当天通知-建筑一键升级 */
    public static DAY_NOTICE_AUTO_BUILD:string = "day.notice.autoBuild";  //改成每次登陆都提醒
    /**当天通知-部队训练 */
    public static DAY_NOTICE_TRAIN:string = "day.notice.train";
    /**当天通知-城市建筑 */
    public static DAY_NOTICE_CITY_BUILD:string = "day.notice.cityBuild";

     /**========================================================================================================
    * 日常通知预定义end 需要在init函数 的 dayNotices添加
    *========================================================================================================
    */

    /**========================================================================================================
    *其他预定义 begin
    *========================================================================================================
    */
    
    /**武将红点记录 */
    public static GENERAL_OFF_RED:string = "general.off_red";
    
    /**========================================================================================================
    * 其他预定义 end
    *========================================================================================================
    */


    /**通知关闭状态值 */
    public static noticeLockedState:Dictionary;
    /**日常刷新通知类型数组 */
    public static dayNotices:Array<string>;
    /**武将红点记录 */
    public static generalOffReds:Array<number>;
    
	public static init() {
        this.noticeLockedState = Dictionary.create();
        this.dayNotices = [
            this.DAY_NOTICE_NORMAL,
            this.DAY_NOTICE_BUILD,
            // this.DAY_NOTICE_AUTO_BUILD,
            this.DAY_NOTICE_TRAIN,
            this.DAY_NOTICE_CITY_BUILD
        ];
        
        this.initDayNotice();
        this.initGeneralOffRed();
	}

	public static clear() {
        this.noticeLockedState.clear();
	}

    /**========================================================================================================
     * 通知状态 begin
     * ========================================================================================================
     */
    /**是否需要通知 */
    public static isNeedNotice(noticeType:string = LocalModel.DAY_NOTICE_NORMAL){
        if(GuideModel.hasGuideTrigger())
            return false;
        if(this.noticeLockedState.has(noticeType)){
            return false;
        }
        return true;
    }
    
    /**初始化日常通知状态 */
    public static initDayNotice(){
        let date = new Date();
        /**通知列表 */
        for(let i = 0; i < this.dayNotices.length; i++){
            /** 当天通知关闭(普通)*/
            let noticeType = this.dayNotices[i];
            let norTime = LocalData.getData(noticeType);
             if(norTime != ''){
                let day = new Date(Number(norTime)).getDay();
                if(day == date.getDay()){
                    this.noticeLockedState.add(noticeType,true);
                }
            }
        }
       
    }

    /**记录通知状态 */
    public static recordNotice(noticeType:string = LocalModel.DAY_NOTICE_NORMAL,isRecord:boolean = true){
        if(isRecord){
            var timeStr: string = new Date().getTime().toString();
            LocalData.setData(noticeType,timeStr);
            this.noticeLockedState.add(noticeType,true);
        }else{
            LocalData.removeData(noticeType);
            this.noticeLockedState.del(noticeType);
        }
    }
    /**========================================================================================================
     * 通知状态 end
     * ========================================================================================================
     */


    /**========================================================================================================
     * 武将红点记录 begin
     * ========================================================================================================
     */

      /**初始化武将红点记录 */
    public static initGeneralOffRed(){
        let res = LocalData.getData(LocalModel.GENERAL_OFF_RED,"[]");
        this.generalOffReds = JSON.parse(res);
        
    }

    /**添加武将红点记录 */
    public static addGeneralOffRed(generalId:number){
        if(this.generalOffReds.indexOf(generalId) >= 0) return;
        this.generalOffReds.push(generalId);
        LocalData.setData(LocalModel.GENERAL_OFF_RED,JSON.stringify(this.generalOffReds));
    }

    /**移除武将红点 */
    public static removeGeneralOffRed(generalId:number){
        let index = this.generalOffReds.indexOf(generalId);
        if(index >=0){
            this.generalOffReds.splice(index,1);
        }
        if(this.generalOffReds.length > 0){
            LocalData.setData(LocalModel.GENERAL_OFF_RED,JSON.stringify(this.generalOffReds));
        }else{
            LocalData.removeData(LocalModel.GENERAL_OFF_RED);
        }
    }

    /**是否过滤红点 */
    public static hasGeneralOffRed(generalId:number){
        let index = this.generalOffReds.indexOf(generalId);
        return index >=0;
    }

    /**========================================================================================================
     * 武将红点记录 end
     * ========================================================================================================
     */

	
}