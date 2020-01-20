/**
 * Created by yaowan on 2016/12/20.
 */
interface IEffectCfgInfo {
    /**特效名字 
     * 格式 EBuild_Flag_Green=>> 按第一个下划线 拆分 assets\effects\目录下 主文件夹
     * assets\effects\  EBuild  \   EBuild_Flag_Green   \   EBuild_Flag_Green.png等
     * */
    name: string,

    /**循环播放 */
    repeat: boolean,

    /**刷新帧率(整数) 默认3 3帧刷新一次 */
    fHold: number,

    /**png序列帧后缀格式化位数 1位：1,  2位 001, 3位 001 ... (png名字 与 特效名字一致)*/
    fileNum: number
}

class EffectData {

    private static m_pEffConfig: any;

    private static m_pEffectModels: EffectBase[][];

    public static initConfig() {
        if (!this.m_pEffConfig) {
            let effectList: Array<IEffectCfgInfo> = [
                // { name: IETypes.EBuild_Raid, repeat: true, fHold: 4, fileNum: 1 },
                // { name: IETypes.EBuild_Attack, repeat: true, fHold: 4, fileNum: 1 },
                // { name: IETypes.EBuild_Defend, repeat: true, fHold: 5, fileNum: 1 },
                // { name: IETypes.EBuild_BeAttack, repeat: true, fHold: 4, fileNum: 1 },

                // { name: IETypes.EBuild_Flag_Red, repeat: true, fHold: 5, fileNum: 1 },
                // { name: IETypes.EBuild_Flag_Blue, repeat: true, fHold: 5, fileNum: 1 },
                // { name: IETypes.EBuild_Flag_Gray, repeat: true, fHold: 5, fileNum: 1 },
                // { name: IETypes.EBuild_Flag_Green, repeat: true, fHold: 5, fileNum: 1 },
                // { name: IETypes.EBuild_UpGrade, repeat: false, fHold: 3, fileNum: 1 },
                //{ name: IETypes.EBuild_UpGrade_Big, repeat: false, fHold: 3, fileNum: 1 },                
                { name: IETypes.EBuild_Repair, repeat: true, fHold: 4, fileNum: 1 },
              //  { name: IETypes.EBuild_UpGrade_Small, repeat: false, fHold: 3, fileNum: 1 }, 
               // { name: IETypes.EBuild_UpGrade_MId, repeat: false, fHold: 3, fileNum: 1 },                
                               
                

                // { name: IETypes.EBuild_Event_D, repeat: true, fHold: 4, fileNum: 1 },
                // { name: IETypes.EBuild_Event_H, repeat: true, fHold: 4, fileNum: 1 },
                // { name: IETypes.EBuild_Event_Q, repeat: true, fHold: 4, fileNum: 1 },
                // { name: IETypes.EBuild_Event_X, repeat: true, fHold: 4, fileNum: 1 },


                { name: IETypes.EBattle_ArrowHit, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EBattle_Boom, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EBattle_Defend, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EBattle_Arrow, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EBattle_Disp, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EBattle_Giddy, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EBattle_Rush, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EBattle_TextDash, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EBattle_TextDefend, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EBattle_TextSalvo, repeat: true, fHold: 3, fileNum: 1 },

                { name: IETypes.EBattle_Blood, repeat: false, fHold: 1, fileNum: 1 },
                { name: IETypes.EBattle_GX, repeat: false, fHold: 3, fileNum: 1 },

                // { name: IETypes.EBattle_Fire1, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EBattle_Fire2, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EBattle_Fire3, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EBattle_Smoke, repeat: true, fHold: 3, fileNum: 1 },

                { name: IETypes.EMap_BirdFly, repeat: true, fHold: 3, fileNum: 1 },

                // { name: IETypes.ELoading_Horse, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.ELoading_HuoYan, repeat: true, fHold: 3, fileNum: 1 },

                { name: IETypes.ETechnology_UpGrade, repeat: true, fHold: 3, fileNum: 1 },

                { name: IETypes.EBarracks_GBYStand, repeat: false, fHold: 3, fileNum: 1 },
                { name: IETypes.EBarracks_GBYAtt, repeat: false, fHold: 3, fileNum: 1 },
                { name: IETypes.EBarracks_BBYStand, repeat: false, fHold: 3, fileNum: 1 },
                { name: IETypes.EBarracks_BBYAtt, repeat: false, fHold: 3, fileNum: 1 },
                { name: IETypes.EBarracks_QBYAtt, repeat: false, fHold: 3, fileNum: 1 },
                { name: IETypes.EBarracks_QBYStand, repeat: false, fHold: 3, fileNum: 1 },

                { name: IETypes.EBattle_Anger_Add, repeat: true, fHold: 3, fileNum: 1 },
                { name: IETypes.EBattle_Anger_Max, repeat: true, fHold: 3, fileNum: 1 },
                { name: IETypes.EBattle_Anger_nAdd, repeat: true, fHold: 3, fileNum: 1 },
                { name: IETypes.EBattle_Anger_Turn, repeat: false, fHold: 3, fileNum: 1 },
                { name: IETypes.EBattle_Anger_nMax, repeat: true, fHold: 3, fileNum: 1 },

                { name: IETypes.EBattle_Target, repeat: true, fHold: 3, fileNum: 1 },

                { name: IETypes.EMap_Water, repeat: true, fHold: 3, fileNum: 1 },
                { name: IETypes.EMap_Waterfall, repeat: true, fHold: 3, fileNum: 1 },
                { name: IETypes.EMap_Waterfall_xiao1, repeat: true, fHold: 3, fileNum: 1 },
                { name: IETypes.EMap_Waterfall_xiao, repeat: true, fHold: 3, fileNum: 1 },
                { name: IETypes.EMap_Waterfall_shuiche, repeat: true, fHold: 3, fileNum: 1 },
                { name: IETypes.EMap_Solider_Left, repeat: true, fHold: 5, fileNum: 1 },
                { name: IETypes.EMap_Solider_Right, repeat: true, fHold: 5, fileNum: 1 },
                { name: IETypes.EMap_Farmer_Right_down, repeat: true, fHold: 5, fileNum: 1 },
                { name: IETypes.EMap_Farmer_Left_Up, repeat: true, fHold: 5, fileNum: 1 },
                // /**庆典 */
                // { name: IETypes.EQD_Colour, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EQD_GQ, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EQD_Time, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EQD_XS, repeat: false, fHold: 3, fileNum: 1 },
                // { name: IETypes.EQD_Start, repeat: false, fHold: 3, fileNum: 1 },
                // { name: IETypes.EQD_ZIRAN, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EQD_BOMB, repeat: false, fHold: 3, fileNum: 1 },
                /**指引 */
                // { name: IETypes.EGuide_Fire, repeat: true, fHold: 3, fileNum: 1 },
                /**军功任务 */
                // { name: IETypes.EMilitary_Huohua, repeat: true, fHold: 3, fileNum: 1 },
                /**通用ui特效 */
                { name: IETypes.EUI_SilverAdd, repeat: false, fHold: 3, fileNum: 1 },
                { name: IETypes.EUI_FoodAdd, repeat: false, fHold: 3, fileNum: 1 },

                // { name: IETypes.EUI_Btn01, repeat: true, fHold: 3, fileNum: 1 },

                { name: IETypes.EUI_Tavern_OutFrame, repeat: true, fHold: 3, fileNum: 1 },
                { name: IETypes.EUI_Tavern_Top, repeat: true, fHold: 3, fileNum: 1 },

                // { name: IETypes.EUI_Fire_Wei, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EUI_Fire_Shu, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EUI_Fire_Wu, repeat: true, fHold: 3, fileNum: 1 },

                { name: IETypes.ETavern_Card, repeat: false, fHold: 3, fileNum: 3 },
                { name: IETypes.ETavern_Visitor, repeat: false, fHold: 2, fileNum: 1 },
                { name: IETypes.ETavern_Flower, repeat: false, fHold: 3, fileNum: 4 },
                { name: IETypes.ETavern_Select, repeat: true, fHold: 3, fileNum: 1 },

                // { name: IETypes.EUI_Gossip, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EUI_Receive_Reward, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EUI_Tan, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EUI_TreasureUp, repeat: false, fHold: 3, fileNum: 1 },
                { name: IETypes.EUI_FontStrengthenSuccess, repeat: false, fHold: 3, fileNum: 1 },
                { name: IETypes.EUI_FontStrengthenFail, repeat: false, fHold: 3, fileNum: 1 },


                // { name: IETypes.EUI_Guide_Icon, repeat: true, fHold: 4, fileNum: 1 },

                { name: IETypes.EUI_Gem_Success, repeat: false, fHold: 3, fileNum: 1 },
                { name: IETypes.EUI_Gem_Fail, repeat: false, fHold: 3, fileNum: 1 },
                { name: IETypes.EUI_Gem_Particle, repeat: true, fHold: 3, fileNum: 1 },

                // { name: IETypes.EUI_GenUpLv1, repeat: false, fHold: 2, fileNum: 1 },
                // { name: IETypes.EUI_GenUpLv2, repeat: false, fHold: 3, fileNum: 1 },
                // { name: IETypes.EUI_GenUpStar, repeat: false, fHold: 3, fileNum: 1 },
                // { name: IETypes.EUI_Up_Skill, repeat: false, fHold: 3, fileNum: 1 },
                // { name: IETypes.EUI_GeneralGet2, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EUI_GeneralGet3, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EUI_GeneralGet4, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EUI_GeneralGet5, repeat: true, fHold: 3, fileNum: 1 },
                // { name: IETypes.EUI_GeneralGetCard, repeat: false, fHold: 3, fileNum: 1 },

                /**世界地图 */
                { name: IETypes.EWorld_Smoke, repeat: true, fHold: 3, fileNum: 1 },
                
                { name: IETypes.EBuild_Boss_1, repeat: true, fHold: 3, fileNum: 1 },
                { name: IETypes.EBuild_Boss_2, repeat: true, fHold: 3, fileNum: 1 },
                { name: IETypes.EBuild_Boss_3, repeat: true, fHold: 3, fileNum: 1 },
                { name: IETypes.EBuild_BossRage, repeat: true, fHold: 3, fileNum: 1 },
            ];


            this.m_pEffConfig = {};


           for(let i = 0; i <effectList.length;i++){
               let cfg:IEffectCfgInfo = effectList[i];
               if(cfg){
                   this.m_pEffConfig[cfg.name] = this.createCfgItem(cfg.repeat,cfg.fHold,cfg.fileNum);
               }
           }


            this.m_pEffectModels = [];
        }
    }

    public static createCfgItem(repeat = false, fHao = 3, fileNum = 1) {
        var item: any = {};
        item.fHold = fHao;
        item.fType = FrameAnimNumType.num;
        item.isRepeat = repeat;
        item.fileNum = fileNum;
        return item;
    }

    public static loadConfig(eff_type) {
        return this.m_pEffConfig[eff_type];
    }


    /**战斗 */
    // public static BATTLE_MAP = "BATTLE_MAP";
    /**庆典 */
    public static CELEBRATION = "CELEBRATION";
    /**大地图 */
    public static WORLD_MAP = "WORLD_MAP";
    /**世界地图 */
    public static WORLD = "WORLD";
    /**宝石 */
    public static GEM = "GEM";
    /**封地 */
    public static FIEF = "FIEF";

    public static MAIN_MAP = "MAIN_MAP";

    public static NOVICE_MAP = "NOVICE_MAP";

    public static addEffectModule(name: string, effectcls: any) {
        this.removeEffectModule(name);
        this.m_pEffectModels[name] = this.m_pEffectModels[name] || [];
        this.m_pEffectModels[name] = effectcls.create();
    }

    public static removeEffectModule(name: string) {
        if (this.m_pEffectModels[name]) {
            this.m_pEffectModels[name].clear();
            this.m_pEffectModels[name] = null;
            delete this.m_pEffectModels[name];
        }
    }

    public static getEffectModule(name: string): EffectBase {
        return this.m_pEffectModels[name];
    }

    public static addEffect(name: string, type: string, bitmap: egret.Bitmap) {
        let effect = this.getEffectModule(name) as EffectBase;
        if (effect) effect.addEffect(type, bitmap);
    }

    public static removeEffect(name: string, type: string, bitmap: egret.Bitmap) {
        let effect = this.getEffectModule(name) as EffectBase;
        if (effect) effect.removeEffect(type, bitmap);
    }
}