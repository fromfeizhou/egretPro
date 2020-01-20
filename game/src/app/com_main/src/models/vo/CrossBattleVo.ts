
enum CSBFaction {
    NONE = 0,
    OUR = 1,
    EMENY = 2
}

class CSBCityInfoVo extends BaseClass implements IFObject {
    /**配置表的城市id */
    areaId: number;
    /**阵营id */
    occupant?: (number|null);
    /**服务器城市唯一id  跟服务器通信用*/
    warAreaId: number;
    //守军数量
    defTeamNum?: (number|null);
    //攻击数量
    attTeamNum?: (number|null);
    //箭塔数量,index 0表示左塔，1表示右塔
    towerNum?: (boolean[]|null) = [];
    //0和平状态，1战斗中
    status: number;
    /**是否是我方阵营 */
    private m_bIsOur: boolean;
    private m_isCamp: boolean;

    /**阵营 */
    private m_faction: CSBFaction;
    /**城市名 */
    private m_sCityName: string = '';

    /**点击后显示面板的状态 */
    private m_menuStatus: string = "atk";
    private m_infoStatus: string = "our";
    
    public static create(body: gameProto.IWarAreaVo) {
        var obj: CSBCityInfoVo = new CSBCityInfoVo(body);
        return obj;
    }

    public constructor(body: gameProto.IWarAreaVo) {
        super();
        this.init(body);
    }

    public init(body?: gameProto.IWarAreaVo) {
        let keys: Array<string> = [
            "areaId","occupant","warAreaId","defTeamNum","attTeamNum","towerNum","status"
        ];

        for (let ind in keys) {
            let key = keys[ind];
            this[key] = body[key];
        }

        this.m_bIsOur = CrossModel.getSelfGroup() == this.occupant;
        if(this.occupant == 0){
            this.m_faction = CSBFaction.NONE;
        }else if(this.m_bIsOur){
            this.m_faction = CSBFaction.OUR;
        }else{
            this.m_faction = CSBFaction.EMENY;
        }

        this.m_isCamp = this.areaId > 5;

        /**点击面板的状态 */
        if(!this.m_isCamp && this.m_bIsOur){
            this.m_menuStatus = 'own';
        }else if(!this.m_isCamp && !this.m_bIsOur){
            this.m_menuStatus = 'atk';
        }else if (this.m_isCamp && this.m_bIsOur){
            this.m_menuStatus = 'camp';
        }else {
            this.m_menuStatus = 'emenyCamp';
        }
        if(DEBUG){
            this.m_sCityName = this.warAreaId+ GLan(C.CrossServerAreaConfig[this.areaId].name);
        }else{
            this.m_sCityName = GLan(C.CrossServerAreaConfig[this.areaId].name);
        }
        this.m_sCityName = GLan(C.CrossServerAreaConfig[this.areaId].name);
    }

    /**是否我方阵营 */
    public isMyGroup(){
        return this.m_bIsOur;
	}

    /**是否城门 */
    public isMyCamp(){
        return this.m_bIsOur && this.m_isCamp;
    }

    /**获取阵营 */
    public getFaction():CSBFaction{
        return this.m_faction;
    }

    /**获取面板状态 */
    public getMenuStatus(){
        return this.m_menuStatus;
    }

    public getTowerNum(): number{
        let num = 0;
        for(let i of this.towerNum){
            if(i){
                num += 1;
            }
        }
        return num;
    }

    public getCityName(){
        return this.m_sCityName;
    }

    public onDestroy() {

    }
}