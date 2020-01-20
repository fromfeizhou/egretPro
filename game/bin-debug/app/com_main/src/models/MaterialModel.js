var MaterialEnum;
(function (MaterialEnum) {
    /**银两副本 */
    MaterialEnum[MaterialEnum["Silver"] = 1] = "Silver";
    /**强化副本 */
    MaterialEnum[MaterialEnum["Streng"] = 2] = "Streng";
    /**升阶副本 */
    MaterialEnum[MaterialEnum["Lorder"] = 3] = "Lorder";
    /**精炼副本 */
    MaterialEnum[MaterialEnum["Refin"] = 4] = "Refin";
    /**天命副本 */
    MaterialEnum[MaterialEnum["Destiny"] = 5] = "Destiny";
    /**士兵升阶 */
    MaterialEnum[MaterialEnum["SoldRefin"] = 6] = "SoldRefin";
})(MaterialEnum || (MaterialEnum = {}));
var MaterialModel = /** @class */ (function () {
    function MaterialModel() {
    }
    MaterialModel.MaterialData = function (info) {
        this.materialInfoDic = {};
        for (var i = 0; i < info.metrialType.length; i++) {
            var data = info.metrialType[i];
            this.materialInfoDic[data.type] = data;
        }
        this.passed = info.passed;
        com_main.EventMgr.dispatchEvent(MaterialEvent.MATERIAL_INFO_UPDATE, null);
    };
    Object.defineProperty(MaterialModel, "materialList", {
        get: function () {
            if (!this._materialList) {
                this._materialList = [MaterialEnum.Silver, MaterialEnum.Streng, MaterialEnum.Lorder, MaterialEnum.Refin, MaterialEnum.SoldRefin];
            }
            return this._materialList;
        },
        enumerable: true,
        configurable: true
    });
    /**判断前面副本是否通关 */
    MaterialModel.ifMaterialpass = function (copyId) {
        var copycfg = C.MaterialConfig[copyId];
        if (copycfg.prev > 0) {
            if (this.passed.indexOf(copycfg.prev) >= 0)
                return true;
        }
        else {
            return true;
        }
        return false;
    };
    /**购买挑战次数数据更新 */
    MaterialModel.reBuyCountData = function (info) {
        if (info) {
            var data = MaterialModel.getMaterialItemInfo(info.materialType.type);
            if (!data)
                this.materialInfoDic[info.materialType.type] = info.materialType;
            this.materialInfoDic[info.materialType.type].bought = info.materialType.bought;
            this.materialInfoDic[info.materialType.type].used = info.materialType.used;
        }
        com_main.EventMgr.dispatchEvent(MaterialEvent.MATERIAL_INFO_UPDATE, null);
    };
    /**扫荡次数数据更新 */
    MaterialModel.reSDCountData = function (info) {
        if (info && info.type) {
            if (!this.materialInfoDic[info.type.type])
                return;
            this.materialInfoDic[info.type.type].bought = info.type.bought;
            this.materialInfoDic[info.type.type].used = info.type.used;
        }
        com_main.EventMgr.dispatchEvent(MaterialEvent.MATERIAL_INFO_UPDATE, null);
    };
    /**设置副本按钮数据状态 */
    MaterialModel.getCopyCfg = function (m_copyId) {
        if (this.passed.length > 0) {
            for (var k = 0; k <= this.passed.length; k++) {
                if (this.passed[k] == m_copyId) {
                    return true;
                }
            }
        }
        return false;
    };
    /**获取当前的挑战次数 */
    MaterialModel.getCurrCount = function (type) {
        var m_maxCount = C.MaterialTypeConfig[type].freeCount;
        var cfg = MaterialModel.getMaterialItemInfo(type);
        var m_num = 0;
        var m_bought = 0;
        if (cfg) {
            m_num = cfg.used;
            m_bought = cfg.bought;
        }
        return (m_maxCount - m_num + m_bought);
    };
    /**材料副本是否通关*/
    MaterialModel.ifMateialPass = function (copyId) {
        for (var i = 0; i < this.passed.length; i++) {
            if (this.passed[i] == copyId) {
                return true;
            }
        }
        return false;
    };
    /**材料副本类型*/
    MaterialModel.getMaterialItemInfo = function (copyType) {
        return this.materialInfoDic[copyType];
    };
    /**
     * 返回副本红点
     * 公用
     * */
    MaterialModel.getCopyBtnState = function (type) {
        if (!FunctionModel.isFunctionOpen(FunctionType.MATERIAL))
            return false;
        var cfg = C.MaterialTypeConfig[type];
        var info = MaterialModel.getMaterialItemInfo(type);
        if (info) {
            if (cfg.freeCount - info.used + info.bought > 0) {
                return true;
            }
        }
        else {
            var silverArr = this.getMaterialCfgByType(type);
            for (var i = 0; i < silverArr.length; i++) {
                if (silverArr[i].playerLevel <= RoleData.level) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * 材料副本
     * 根据tag标签页取对应类型材料副本配置信息列表
     */
    MaterialModel.getMaterialCfgByType = function (type) {
        var res = [];
        var materialCfg = C.MaterialConfig;
        for (var i in materialCfg) {
            if (unNull(materialCfg[i]) && Number(materialCfg[i].type) == type) {
                res.push(materialCfg[i]);
            }
        }
        return res;
    };
    /**显示购买面板 */
    MaterialModel.showMaterialBuyWnd = function (type) {
        var resideNum = 0;
        // let data = MaterialModel.getMaterialItemInfo(type);
        // if (!data) {
        //     EffectUtils.showTips(GCode(CLEnum.MAT_FIGHT_MAX), 1, true);
        //     return;
        // }
        var cfg = C.MaterialTypeConfig[type];
        var vipCfg = C.VipPrivillegesConfig[cfg.vipBuyPrivilege];
        var buyMax = Number(vipCfg['vip' + RoleData.vipLevel]); //最大购买数量
        var costItem = Utils.parseCommonItemJson(cfg.buyPrice)[0];
        var info = MaterialModel.getMaterialItemInfo(type);
        if (info) {
            resideNum = buyMax - info.bought; //剩余购买次数
        }
        else {
            resideNum = buyMax;
        }
        if (resideNum > 0) {
            var param = { type: type, itemId: costItem.itemId, price: costItem.count, maxNum: resideNum };
            Utils.open_view(TASK_UI.MATERIAL_INFO__BUY_DLG, param);
            return;
        }
        // EffectUtils.showTips(GCode(CLEnum.MAT_TIPS_GMCS), 1, true);
        Utils.showVipUpConfim();
    };
    MaterialModel.copyTypeinfo = null; // 挑战结束的材料副本信息
    return MaterialModel;
}());
