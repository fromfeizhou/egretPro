var RankModel = /** @class */ (function () {
    function RankModel() {
    }
    RankModel.init = function () {
        this.rankList = {};
        this.ownerList = {};
    };
    RankModel.clear = function () {
        this.rankList = {};
        this.ownerList = {};
    };
    /**解析服务器数据 */
    RankModel.parseRankData = function (type, list, user) {
        this.rankList[type] = [];
        for (var i = 0; i < list.length; i++) {
            this.rankList[type].push(this.parseSingleData(type, list[i]));
        }
        if (user && user.length > 0) {
            this.ownerList[type] = this.parseSingleData(type, user);
        }
    };
    /**解析单调榜单数据 */
    RankModel.parseSingleData = function (type, data) {
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
    };
    /**获得排行榜数据 */
    RankModel.getNormalData = function (type) {
        return [this.rankList[type], this.ownerList[type]];
    };
    /**获得武将排行榜数据 */
    RankModel.getGenRankData = function () {
        return this.rankList[RankType.GENREAL];
    };
    /**获得单武将排行榜数据 */
    RankModel.getGenSingleRankData = function () {
        return this.rankList[RankType.ONEHERO];
    };
    /**获得国家城池排行榜数据 */
    RankModel.getCountryRankData = function () {
        return this.rankList[RankType.COUNTRY];
    };
    /**获得联盟排行榜数据 */
    RankModel.getLegionRankData = function () {
        return [this.rankList[RankType.LEGION], this.ownerList[RankType.LEGION]];
    };
    /**获得跨服联盟排行榜数据 */
    RankModel.getCrossLegionRankData = function () {
        return [this.rankList[RankType.CROSS_SERVER_UNION_RANK], this.ownerList[RankType.CROSS_SERVER_UNION_RANK]];
    };
    /**存在缓存 */
    RankModel.hasCache = function (type) {
        return this.rankList[type] != null;
    };
    /**
     * 刷新排名图标
     * 添加一种排行方式如：1,2,3,(4-5)  4:rank,5:maxRank
     **/
    RankModel.refreshRankIcon = function (imgRank, labRank, rank, maxRank) {
        if (imgRank && labRank) {
            if (rank > 0 && rank <= 3) {
                imgRank.visible = true;
                labRank.visible = false;
                imgRank.source = format("Icon_List_NO{1}_png", rank);
            }
            else {
                imgRank.visible = false;
                labRank.visible = true;
                if (maxRank && rank != maxRank) {
                    labRank.text = rank + "-" + maxRank;
                }
                else {
                    labRank.text = rank <= 0 ? GCode(CLEnum.RANK_NONE) : rank;
                }
            }
        }
    };
    /**
 * 刷新boss排名图标
 * 添加一种排行方式如：1,2,3,4  rank为等级 type boss类型
 **/
    RankModel.refreshBossRankIcon = function (imgRank, labRank, rank, type) {
        if (imgRank && labRank) {
            if (rank > 0 && rank <= 3) {
                imgRank.visible = true;
                labRank.visible = false;
                imgRank.source = format("Icon_List_NO{1}_png", rank);
            }
            else {
                imgRank.visible = false;
                labRank.visible = true;
                // if (type == BossEnum.Rank) {
                if (rank < 11) {
                    labRank.text = rank + '';
                }
                else {
                    labRank.text = '参与奖';
                }
                // } else {
                //     labRank.text = rank <= 0 ? GCode(CLEnum.RANK_NONE) : rank;
                // }
            }
        }
    };
    RankModel.rankList = {};
    RankModel.ownerList = {};
    return RankModel;
}());
