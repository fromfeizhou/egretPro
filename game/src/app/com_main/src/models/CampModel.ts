
// interface IftTempCamp {
//     army: { [k: number]: IftCampHero },
//     adds: number[],
// }

// interface IftCampHero {
//     /**武将id */
//     gid: number;
//     /**所在部队编号 */
//     armyId: number;
//     /**所在位置  */
//     pos: number;
//     /**战斗力 */
//     fight?: number;
// }

// enum BGBType{
//     HQ = 1,//行营
//     ARENA = 2,//擂台
//     APK = 3,//竞技场进攻
//     PATRO = 4,//巡查
//     DEF_APK = 5,//竞技场防守
//     BOSS = 6,//怪物
// }

// /**
//  * 活动军营
//  * @class CampModel
//  */
// class CampModel {

//     private static m_mHeroDict: { [k: number]: CampVo } = {};


//     public static testInit(type: BGBType) {
//         let camp = this.m_mHeroDict[type];
//         if (!camp) {
//             camp = new CampVo();
//             this.m_mHeroDict[type] = camp;
//         }

//         camp.initHero(null);
//     }

//     public static initBaseCamp(type: BGBType) {
//         let camp = this.m_mHeroDict[type];
//         if (!camp) {
//             camp = new CampVo();
//             if(type == BGBType.APK||type == BGBType.DEF_APK)
//                 camp.armyNum = 1;
//             this.m_mHeroDict[type] = camp;
//         }

//         camp.initBase()
//     }

//     public static getCamp(type: BGBType): CampVo {
//         return this.m_mHeroDict[type];
//     }
//     public static getCampisOnBattle(type:BGBType){
//         let campVo = <CampVo>CampModel.getCamp(type);
//         return campVo.getCampAll();
//     } 
//     public static initCamp(pack: any) {
//         if (!pack) return;
//         const type: BGBType = pack.type
//             , data = pack.armyInfo
        
//         let camp = this.m_mHeroDict[type];
//         if (!camp) {
//             camp = new CampVo();
//             if(type == BGBType.APK||type == BGBType.DEF_APK)
//                 camp.armyNum = 1;
//             this.m_mHeroDict[type] = camp;
//         }

//         camp.initHero(data);
//     }



//     public static updateCamp(pack: any) {
//         if (!pack) return;
//         const type : BGBType = pack.type
//             , aid = pack.armyId
//             , heros = pack.generals
//             , camp = this.m_mHeroDict[type];
//         camp.updateHero(aid, heros);
//     }


// }