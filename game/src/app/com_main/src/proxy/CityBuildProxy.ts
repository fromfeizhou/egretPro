class CityBuildProxy extends BaseProxy {

    public static m_pVersion: number = null;//城池缓存的数据版本


    protected listenerProtoNotifications(): any[] {
        return [

        ];
    }

    protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
        return [
            [ProtoDef.C2S_CITY_MADE_INFO, this, 'C2S_CITY_MADE_INFO', ProxyEnum.SEND], //玩家城市建造信息
            [ProtoDef.S2C_CITY_MADE_INFO, this, 'S2C_CITY_MADE_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CITY_MADE, this, 'C2S_CITY_MADE', ProxyEnum.SEND], //建造
            [ProtoDef.S2C_CITY_MADE, this, 'S2C_CITY_MADE', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CITY_MADE_SPEED, this, 'C2S_CITY_MADE_SPEED', ProxyEnum.SEND], //建造加速
            [ProtoDef.S2C_CITY_MADE_SPEED, this, 'S2C_CITY_MADE_SPEED', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CITY_MADE_REWARD, this, 'C2S_CITY_MADE_REWARD', ProxyEnum.SEND], //领取奖励
            [ProtoDef.S2C_CITY_MADE_REWARD, this, 'S2C_CITY_MADE_REWARD', ProxyEnum.RECEIVE],
        ]
    }

    public execute(notification: AGame.INotification) {
        let protocol: number = Number(notification.getName());
        let body = notification.getBody();
        debug(`WorldProxy===protocol: ${protocol}`, body)
        switch (protocol) {
            case ProtoDef.S2C_CITY_MADE_INFO: {//玩家城市建造信息
                let data = body as gameProto.IS2C_CITY_MADE_INFO;
                if (isNull(data)) break;
                let mi: gameProto.IPlayerMadeInfo[] = data.playerMadeInfo;
                let sumExp = data.sumExp;
                let cityProgress = data.cityProgress;
                CityBuildModel.initPlayerMadeInfo(mi);
                CityBuildModel.initSumExp(sumExp);
                CityBuildModel.initPlayerMadeInfoExp(cityProgress);
                CityBuildModel.initNpcLevel = data.npcLevel;
                break;
            }
            case ProtoDef.S2C_CITY_MADE: {//建造
                let data = body as gameProto.IS2C_CITY_MADE;
                if (isNull(data)) break;
                CityBuildProxy.C2S_CITY_MADE_INFO(CityBuildModel.curCityId);
                // let mi: gameProto.IPlayerMadeInfo[] = data.playerMadeInfo;
                // CityBuildModel.initPlayerMadeInfo(mi);
                break;
            }
            case ProtoDef.S2C_CITY_MADE_SPEED: {//建造加速
                let data = body as gameProto.IS2C_CITY_MADE_SPEED;
                if (isNull(data)) break;
                // CityBuildProxy.C2S_CITY_MADE_INFO(CityBuildModel.curCityId);
                let mi: gameProto.IPlayerMadeInfo[] = data.playerMadeInfo;
                CityBuildModel.initPlayerMadeInfo(mi);
                break;
            }
            case ProtoDef.S2C_CITY_MADE_REWARD: {//领取奖励
                let data = body as gameProto.IS2C_CITY_MADE_REWARD;
                if (isNull(data)) break;
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.rewards);
                // CityBuildModel.rewardCity(CityBuildModel.curCityId);
                // CityBuildProxy.C2S_CITY_MADE_INFO(CityBuildModel.curCityId);
                break;
            }
            // default:
            //     break;
        }

        AGame.ServiceBuilder.notifyView(notification);
    }

    /**玩家城市建造信息*/
    public static C2S_CITY_MADE_INFO(cityId: number) {
        let data: gameProto.C2S_CITY_MADE_INFO = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CITY_MADE_INFO);
        data.cityId = cityId;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**建造*/
    public static C2S_CITY_MADE(generalId: number, cityId: number, isNow: boolean) {
        let data: gameProto.C2S_CITY_MADE = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CITY_MADE);
        data.generalId = generalId;
        data.cityId = cityId;
        data.isNow = isNow;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**建造加速*/
    public static C2S_CITY_MADE_SPEED(cityId: number, itemId: number, num: number) {
        let data: gameProto.C2S_CITY_MADE_SPEED = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CITY_MADE_SPEED);
        data.cityId = cityId;
        data.itemId = itemId;
        data.num = num;
        AGame.ServiceBuilder.sendMessage(data);
    }
    
    /**领取奖励*/
    public static C2S_CITY_MADE_REWARD(cityId: number, generalId: number) {
        let data: gameProto.C2S_CITY_MADE_REWARD = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CITY_MADE_REWARD);
        data.cityId = cityId;
        data.generalId = generalId;
        AGame.ServiceBuilder.sendMessage(data);
    }


}