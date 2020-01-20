
/** 新手地图数据管理 */
class NoviceMapModel {

	/**世界事件
	 * 
	 * 攻城奖励
	 * 
	 */
    private static m_pWorldEvents = {};

    public static m_pLastSelectBID: number = 0;

    private static m_pEventRefreshTime:number = 0;//事件刷新总事件
    private static m_pNextEventRefreshTime:number = 0;//下次刷新事件时间
    private static m_pNowEventRefreshTime:number = 0;//当前倒计时时间
    private static m_pIsCountDown:boolean = false;//是否开始事件刷新倒计时

    public static m_pNowEventCount: number = 0;

    
    public static clear() {
        // this.removeEventRefreshCountDown();
        EffectData.removeEffectModule(EffectData.WORLD_MAP);
        
        this.clearWorldEvents();
    }

    //==================================================================== 世界事件 ========================================

	/**
	 * 清理指定事件
	 * 返回建筑ids
	 * 
	 * isClearReward 是否清除城池奖励事件
	 *  */
    public static clearWorldEvents(): any {
        var ids = {};
        let events = this.m_pWorldEvents;

        for (var key in events) {
            if (events.hasOwnProperty(key)) {
                var element = events[key];

                for (var k in element) {
                    if (element.hasOwnProperty(k)) {
                        var _element = element[k];

                        let id = _element.id;
                        let index = _element.index;
                        if (!ids[id])
                            ids[id] = [];

                        ids[id].push(index);
                    }
                }
            }
        }

        for (var key in ids) {
            if (ids.hasOwnProperty(key)) {
                var element = ids[key];

                for (var _key in element) {
                    if (element.hasOwnProperty(_key)) {
                        var _element = element[_key];
                        this.removeWorldEvent(+key, +_element);
                    }
                }
            }
        }

        return ids;
    }

	/**
	 * 添加世界事件 
	 * 
	 * 
	 * info:
	 * 		type : WorldEvent
	 * 		id	 : 城池id
	 * 		startTime:倒计时开始时间
	 * 		endTime：倒计时结束时间
	 * 		
	 * 		affairId：事件id，对应CityBattleAffiarsInfo配置表id
	 * 		index：事件唯一索引
	 * */
    public static addWorldEvent(id: number, info: any) {
        if (!this.m_pWorldEvents[id])
            this.m_pWorldEvents[id] = [];

        this.m_pWorldEvents[id].push(info);
    }

	/**
	 * 移除世界事件
	 * 
	 *  */
    public static removeWorldEvent(id: number, index: number) {

        let events: any[] = this.m_pWorldEvents[id];

        for (var key in events) {
            if (events.hasOwnProperty(key)) {
                var data = events[key];
                if (data.index == index) {
                    events.splice(Number(key), 1);
                    return;
                }
            }
        }

        debug('移除失败');
    }

    public static getWorldEvents(id: number): any[] {
        let info = this.m_pWorldEvents[id];

        info = info ? info : [];

        return info;
    }

    /**解析额外世界事件 */
    public static analysisWorldEvent(data: any) {
        var ids = {};

        // if (data) {
        //     let list = data.cityBattleAffiarsInfo;
        //     let type = data.type;
        //     let config = C.AffairsConfig;
        //     var flag = true;

        //     if (type != WorldEventType.FIGHT) {
        //         // this.m_pNextEventRefreshTime = (<Long>data.nextRefreshTime).toNumber();
        //         this.m_pNextEventRefreshTime = data.nextRefreshTime;
        //         this.m_pNowEventRefreshTime = TimerUtils.getServerTimeMill();
        //         this.m_pEventRefreshTime = data.cdTime;

        //         this.startEventRefreshCountDown();
        //     }

        //     let time = TimerUtils.getServerTimeMill();

        //     for (var key in list) {
        //         if (list.hasOwnProperty(key)) {
        //             var element = list[key];
        //             let affairId = element.affairId;
        //             let id = element.id;//城池id
        //             let cfg = config[affairId];
        //             if (cfg) {
        //                 let type = cfg.type;
        //                 let affairType = cfg.affairType;
        //                 element["type"] = affairType;
        //                 element["worldEventType"] = type;

        //                 if (element.startTime)
        //                     //zb
        //                     // element.startTime = (<Long>element.startTime).toNumber();
        //                     element.startTime = element.startTime;

        //                 if (element.endTime) {
        //                     //zb
        //                     // element.endTime = (<Long>element.endTime).toNumber();
        //                     element.endTime = element.endTime;
        //                 }

        //                 this.addWorldEvent(id, element);

        //                 ids[id] = id;
        //             }
        //         }
        //     }
        // }

        return ids;
    }


	/**
	 * bid:建筑id
	 * index：事件标识
	 * 
	 * 事件触发后回调
	 */
    public static onTouchWorldEvent(body: any) {
        // let bid = body.id;
        // let index = body.index;
        // let event = this.m_pWorldEvents[bid];
        // if (event) {
        //     let cfg = C.AffairsConfig;
        //     for (var key in event) {
        //         if (event.hasOwnProperty(key)) {
        //             var element = event[key];
        //             if (element.index == index) {
        //                 let affairId = element.affairId;
        //                 let _config = cfg[affairId];

        //                 if (_config) {
        //                     let time = _config.time;
        //                     /**如果有倒计时事件，则需要倒计时 */
        //                     if (time) {
        //                         element.startTime = TimerUtils.getServerTimeMill();
        //                         element.endTime = element.startTime + time;
        //                     }

        //                     return element;

        //                 } else {
        //                     error('读取不到配置！！affairId:', affairId);
        //                 }
        //             }
        //         }
        //     }
        // }

        return body;
    }


    /**开启事件刷新倒计时 */
    public static startEventRefreshCountDown() {
        if (!this.m_pIsCountDown && this.m_pNextEventRefreshTime > 0 && this.m_pEventRefreshTime > 0) {
            this.m_pIsCountDown = true;
            Utils.TimerManager.doTimer(1000, 0, this.eventTimeCall, this);
        }
    }

    /**移除事件刷新倒计时 */
    public static removeEventRefreshCountDown() {
        if (this.m_pIsCountDown) {
            Utils.TimerManager.remove(this.eventTimeCall, this);
            this.m_pNextEventRefreshTime = 0;
            this.m_pNowEventRefreshTime = 0;
            this.m_pEventRefreshTime = 0;
            this.m_pIsCountDown = false;
        }
    }

    /**倒计时回调 */
    public static eventTimeCall() {
        this.m_pNowEventRefreshTime += 1000;

        // debug('事件刷新倒计时：',(this.m_pNextEventRefreshTime - this.m_pNowEventRefreshTime)/1000);

        if (this.m_pNowEventRefreshTime > this.m_pNextEventRefreshTime) {
            this.m_pNextEventRefreshTime += this.m_pEventRefreshTime;
            //请求刷新
            // NoviceMapProxy.send_CITY_BATTLE_NOVICE_AFFAIR();
        }
    }

    public static addNowEventCount() {
		this.m_pNowEventCount += 1;
		if (this.m_pNowEventCount >= 2) {
			this.refreshIcon();
		}
	}

	public static subNowEventCount(flag: boolean = true) {
		this.m_pNowEventCount -= 1;
		if (this.m_pNowEventCount == 1 && flag) {
			this.refreshIcon();
		}
	}

    /**刷新世界时间图标 */
	public static refreshIcon() {
		com_main.NoviceMap.refreshIcon();
	}

}