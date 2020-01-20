// class RewardProxy extends BaseProxy {
//     public constructor() {
//         super();
//     }
//     protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
//         return [
//             [ProtoDef.S2C_WORLDMAP_EVENT_WAR_OVER, this, 'S2C_WORLDMAP_EVENT_WAR_OVER', ProxyEnum.RECEIVE], //事件战斗完成
//             [ProtoDef.ARENA_BATTLE_REWARD, this, 'ArenaBattleRewardResp', ProxyEnum.RECEIVE], //擂台战斗奖励返回
//             [ProtoDef.S2C_CHALLENGE_BOSS, this, 'S2C_CHALLENGE_BOSS', ProxyEnum.RECEIVE],//挑战怪物获胜信息
//             [ProtoDef.S2C_MATERIAL_CHALLENGE, this, 'S2C_MATERIAL_CHALLENGE', ProxyEnum.RECEIVE],//挑战材料副本获胜信息
//             [ProtoDef.HQ_CHANLLNGES_REWARD, this, 'HQChanllngesRewardResp', ProxyEnum.RECEIVE], //行营挑战胜利结算信息
//             // [ProtoDef.PATROL_CHALLENGE_REWARD, this, 'PatrolChallengeRewardResp', ProxyEnum.RECEIVE],//巡查挑战完获得奖励
//             [ProtoDef.APK_CHALLENGE_RESULT, this, 'ChallengeResultResp', ProxyEnum.RECEIVE],//挑战结束
//             [ProtoDef.S2C_PATROL_CHALLENGE_REWARD, this, 'S2C_PATROL_CHALLENGE_REWARD', ProxyEnum.RECEIVE],   //领取巡查奖励返回 
//         ]
//     }
//     public execute(notification: AGame.INotification) {
//         let body = notification.getBody();
//         let protocol: number = Number(notification.getName());
//         switch (protocol) {
//             /**事件战斗完成 */
//             case ProtoDef.S2C_WORLDMAP_EVENT_WAR_OVER: {
//                 // required int32 eventCoordinatesId=1;
//                 // required int32 eventDataId=2;
//                 // required int64 battleId=3;
//                 // required bool isVictory=4;//	是否胜利
//                 // repeated ValuesMessage valuesMessage = 5;//奖励信息
//                 if (Long.fromValue(body.battleId).toNumber() == BattleModel.getJoinedBattleId()) {
//                     Utils.open_view(TASK_UI.POP_RESULT_ARENA_BATTLE_VIEW, { result: body.isVictory, rewards: body.valuesMessage, battleType: CheckPointType.FIGHT_WILD });
//                 } else {
//                 }
//                 break;
//             }
//             /**擂台结算奖励 */
//             case ProtoDef.ARENA_BATTLE_REWARD: {
//                 if (Long.fromValue(body.battleId).toNumber() == BattleModel.getJoinedBattleId()) {
//                     Utils.open_view(TASK_UI.POP_RESULT_ARENA_BATTLE_VIEW, { result: body.result, rewards: body.reward, battleType: CheckPointType.ARENA });
//                 }
//                 break;
//             }
//             /**挑战材料副本获胜信息 */
//             case ProtoDef.S2C_MATERIAL_CHALLENGE: {
//                 // let data: gameProto.S2C_MATERIAL_CHALLENGE = body as gameProto.S2C_MATERIAL_CHALLENGE;
//                 MaterialModel.copyTypeinfo = body.type;
//                 if(MaterialModel.copyTypeinfo){
//                  MaterialModel.copyType =  MaterialModel.copyTypeinfo.type;
//                 }else{
//                      MaterialModel.copyType = 0;
//                 }
//                 if (Long.fromValue(body.battleId).toNumber() == BattleModel.getJoinedBattleId()) {
//                     Utils.open_view(TASK_UI.POP_RESULT_ARENA_BATTLE_VIEW, { result: body.success, rewards: body.valuesMessage, battleType: CheckPointType.MATERIAL });
//                 }
//                 break;
//             }
//             /**挑战boss怪物获胜信息 */
//             case ProtoDef.S2C_CHALLENGE_BOSS: {
//                 // BossModel.setBossInfoByType(body.info);
//                 let data: gameProto.S2C_CHALLENGE_BOSS = body as gameProto.S2C_CHALLENGE_BOSS;
//                 BossModel.challType = data.bossType;
//                 if (Long.fromValue(data.battleId).toNumber() == BattleModel.getJoinedBattleId()) {
//                     Utils.open_view(TASK_UI.POP_RESULT_ARENA_BATTLE_VIEW, { result: data.success, rewards: data.valuesMessage, battleType: CheckPointType.BOSS,bossType:data.bossType, lastHit:data.lastHit,rank:data.rank,damage:data.damage});
//                 }
//                 break;
//             }
//             /**行营挑战胜利结算信息 */
//             case ProtoDef.HQ_CHANLLNGES_REWARD: {
//                 if (Long.fromValue(body.battleId).toNumber() == BattleModel.getJoinedBattleId()) {
//                     Utils.open_view(TASK_UI.POP_RESULT_RAMPART_BATTLE_VIEW, body);
//                 }
//                 break;
//             }
//             /**巡查挑战完获得奖励 */
//             case ProtoDef.S2C_PATROL_CHALLENGE_REWARD: {
//                 if (Long.fromValue(body.battleId).toNumber() == BattleModel.getJoinedBattleId()) {
//                     Utils.open_view(TASK_UI.POP_RESULT_ARENA_BATTLE_VIEW, { result: body.result, rewards: body.message, battleType: CheckPointType.PATRO });
//                 }
//                 break;
//             }
//             /**挑战结束 */
//             case ProtoDef.APK_CHALLENGE_RESULT: {
//                 for (let key in body.apkRankVoList) {
//                     let vo = body.apkRankVoList[key];
//                     if (vo.playerId == RoleData.playerId) {
//                         PvpArenaModel.setRank(vo.rank);
//                     }
//                 }
//                 if (Long.fromValue(body.battleId).toNumber() == BattleModel.getJoinedBattleId()) {
//                     Utils.open_view(TASK_UI.POP_RESULT_ARENA_BATTLE_VIEW, { result: body.result, rewards: body.message, battleType: CheckPointType.PK });
//                 }
//                 break;
//             }
//         }
//     }
// }
