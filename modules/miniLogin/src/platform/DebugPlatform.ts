class DebugPlatform implements Platform {
    async getUserInfo() {
        return { nickName: "username" }
    }

    initPlatform(){

    }

    async login() {
        LoginManager.runGame();
    }

    loginCallback(isp: number,param: string){

    }

    async showShareMenu() {

    }

    /**分享 */
    share(data:any){
        
    }

    async pay(orderNo: number, shopId: number,shopName:string,price:number) {

    }

    reportRegister() {

    }

    reportLogin() {

    }

    reportData(dateType: string) {

    }
    WXattention(){

    }

    isHidePayFunc(){
        return false;
    }

    isMsgCheckFunc(msg: string ,callback: Function,target: any){
        callback.call(target,true);
    }
}