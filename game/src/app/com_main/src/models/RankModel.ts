class RankModel {
    public static RankType: RankType;
    public static rankList: { [key: number]: any[] } = {};
    public static ownerList: { [key: number]: any } = {};

    public static init() {
        this.rankList = {};
        this.ownerList = {};
    }

    public static clear() {
        this.rankList = {};
        this.ownerList = {};
    }

    /**解析服务器数据 */
    public static parseRankData(type: RankType, list: Uint8Array[], user: Uint8Array) {
        this.rankList[type] = [];
        for (let i = 0; i < list.length; i++) {
            this.rankList[type].push(this.parseSingleData(type, list[i]));
        }
        if (user && user.length > 0) {
            this.ownerList[type] = this.parseSingleData(type, user);
        }
    }

    /**解析单调榜单数据 */
    private static parseSingleData(type: RankType, data: Uint8Array) {
        switch (type) {
            case RankType.GENREAL:
            case RankType.ONEHERO: {
                return gameProto.HeroRank.decode(data);
            }
            case RankType.LEGION: {
                return gameProto.RankLegionMessage.decode(data);
            }
            case RankType.COUNTRY: {
                return gameProto.RankCountryMessage.decode(data);
            }
            case RankType.CROSS_SERVER_UNION_RANK: {
                return gameProto.RankLegionMessage.decode(data);
            }
            default: {
                return gameProto.CommRank.decode(data);
            }
        }
    }

    /**获得排行榜数据 */
    public static getNormalData(type: RankType): [gameProto.ICommRank[], gameProto.ICommRank] {
        return [this.rankList[type], this.ownerList[type]];
    }

    /**获得武将排行榜数据 */
    public static getGenRankData(): gameProto.IHeroRank[] {
        return this.rankList[RankType.GENREAL];
    }

     /**获得单武将排行榜数据 */
    public static getGenSingleRankData(): gameProto.IHeroRank[] {
        return this.rankList[RankType.ONEHERO];
    }

    /**获得国家城池排行榜数据 */
    public static getCountryRankData(): gameProto.IRankCountryMessage[] {
        return this.rankList[RankType.COUNTRY];
    }

    /**获得联盟排行榜数据 */
    public static getLegionRankData(): [gameProto.IRankLegionMessage[], gameProto.IRankLegionMessage] {
        return [this.rankList[RankType.LEGION], this.ownerList[RankType.LEGION]];
    }

    /**获得跨服联盟排行榜数据 */
    public static getCrossLegionRankData(): [gameProto.IRankLegionMessage[], gameProto.IRankLegionMessage] {
        return [this.rankList[RankType.CROSS_SERVER_UNION_RANK], this.ownerList[RankType.CROSS_SERVER_UNION_RANK]];
    }

    /**存在缓存 */
    public static hasCache(type: RankType) {
        return this.rankList[type] != null;
    }


    /**
     * 刷新排名图标
     * 添加一种排行方式如：1,2,3,(4-5)  4:rank,5:maxRank
     **/
    public static refreshRankIcon(imgRank: eui.Image, labRank: eui.Label, rank: Number, maxRank?: Number): void {
        if (imgRank && labRank) {
            if (rank > 0 && rank <= 3) {
                imgRank.visible = true;
                labRank.visible = false;
                imgRank.source = format("Icon_List_NO{1}_png", rank);
            } else {
                imgRank.visible = false;
                labRank.visible = true;
                if (maxRank && rank != maxRank) {
                    labRank.text = rank + "-" + maxRank;
                } else {
                    labRank.text = rank <= 0 ? GCode(CLEnum.RANK_NONE) : rank;
                }

            }
        }
    }
    /**
 * 刷新boss排名图标
 * 添加一种排行方式如：1,2,3,4  rank为等级 type boss类型
 **/
    public static refreshBossRankIcon(imgRank: eui.Image, labRank: eui.Label, rank: Number, type: number): void {
        if (imgRank && labRank) {
            if (rank > 0 && rank <= 3) {
                imgRank.visible = true;
                labRank.visible = false;
                imgRank.source = format("Icon_List_NO{1}_png", rank);
            } else {
                imgRank.visible = false;
                labRank.visible = true;
                // if (type == BossEnum.Rank) {
                if (rank < 11) {
                    labRank.text = rank + '';
                } else {
                    labRank.text = '参与奖';
                }
                // } else {
                //     labRank.text = rank <= 0 ? GCode(CLEnum.RANK_NONE) : rank;
                // }

            }
        }
    }

}