
enum MaterialEnum {
    /**银两副本 */
    Silver = 1,
    /**强化副本 */
    Streng = 2,
    /**升阶副本 */
    Lorder = 3,
    /**精炼副本 */
    Refin = 4,
    /**天命副本 */
    Destiny = 5,
    /**士兵升阶 */
    SoldRefin = 6,
}
class MaterialModel {
    public static materialInfoDic: { [key: number]: gameProto.IMaterialType }; // 副本信息	
    public static copyTypeinfo: gameProto.IMaterialType = null; // 挑战结束的材料副本信息
    public static copyType: number; // 挑战结束的材料副本类型
    public static passed: number[]; // 已经挑战通过的id	
    public static _materialList;
    public static isSweep: boolean; // 是否扫荡

    public static MaterialData(info: gameProto.IS2C_MATERIAL_INFO) {
        this.materialInfoDic = {};
        for (let i = 0; i < info.metrialType.length; i++) {
            let data = info.metrialType[i];
            this.materialInfoDic[data.type] = data;
        }
        this.passed = info.passed;
        com_main.EventMgr.dispatchEvent(MaterialEvent.MATERIAL_INFO_UPDATE, null);
    }

    public static get materialList(): MaterialEnum[] {
        if (!this._materialList) {
            this._materialList = [MaterialEnum.Silver, MaterialEnum.Streng, MaterialEnum.Lorder, MaterialEnum.Refin, MaterialEnum.SoldRefin];
        }
        return this._materialList;
    }

    /**判断前面副本是否通关 */
    public static ifMaterialpass(copyId: number) {
        let copycfg = C.MaterialConfig[copyId];
        if (copycfg.prev > 0) {
            if(this.passed.indexOf(copycfg.prev) >= 0) return true;
        } else {
            return true;
        }
        return false;
    }
    /**购买挑战次数数据更新 */
    public static reBuyCountData(info: gameProto.S2C_MATERIAL_BUY) {
        if (info) {
            let data = MaterialModel.getMaterialItemInfo(info.materialType.type);
            if (!data) this.materialInfoDic[info.materialType.type] = info.materialType;
            this.materialInfoDic[info.materialType.type].bought = info.materialType.bought;
            this.materialInfoDic[info.materialType.type].used = info.materialType.used;
        }
        com_main.EventMgr.dispatchEvent(MaterialEvent.MATERIAL_INFO_UPDATE, null);
    }
    /**扫荡次数数据更新 */
    public static reSDCountData(info: gameProto.S2C_MATERIAL_CHALLENGE) {
        if (info && info.type) {
            if (!this.materialInfoDic[info.type.type])
                return;
            this.materialInfoDic[info.type.type].bought = info.type.bought;
            this.materialInfoDic[info.type.type].used = info.type.used;
        }
        com_main.EventMgr.dispatchEvent(MaterialEvent.MATERIAL_INFO_UPDATE, null);
    }
    /**设置副本按钮数据状态 */
    public static getCopyCfg(m_copyId: number) {
        if (this.passed.length > 0) {
            for (let k = 0; k <= this.passed.length; k++) {
                if (this.passed[k] == m_copyId) {
                    return true;
                }
            }
        }
        return false;
    }
    /**获取当前的挑战次数 */
    public static getCurrCount(type: number) {
        let m_maxCount = C.MaterialTypeConfig[type].freeCount;
        let cfg = MaterialModel.getMaterialItemInfo(type);
        let m_num = 0;
        let m_bought = 0;
        if (cfg) {
            m_num = cfg.used;
            m_bought = cfg.bought;
        }
        return (m_maxCount - m_num + m_bought);
    }

    /**材料副本是否通关*/
    public static ifMateialPass(copyId: number) {
        for (let i = 0; i < this.passed.length; i++) {
            if (this.passed[i] == copyId) {
                return true;
            }
        }
        return false;
    }

    /**材料副本类型*/
    public static getMaterialItemInfo(copyType: number) {
        return this.materialInfoDic[copyType];
    }
    /**
     * 返回副本红点 
     * 公用
     * */
    public static getCopyBtnState(type?: MaterialEnum) {
        if (!FunctionModel.isFunctionOpen(FunctionType.MATERIAL)) return false;

        let cfg = C.MaterialTypeConfig[type];
        let info = MaterialModel.getMaterialItemInfo(type);
        if (info) {

            if (cfg.freeCount - info.used + info.bought > 0) {
                return true;
            }
        } else {
            let silverArr = this.getMaterialCfgByType(type);
            for (let i = 0; i < silverArr.length; i++) {
                if (silverArr[i].playerLevel <= RoleData.level) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * 材料副本
     * 根据tag标签页取对应类型材料副本配置信息列表
     */
    public static getMaterialCfgByType(type: MaterialEnum) {
        let res: MaterialConfig[] = [];
        let materialCfg = C.MaterialConfig;
        for (let i in materialCfg) {
            if (unNull(materialCfg[i]) && Number(materialCfg[i].type) == type) {
                res.push(materialCfg[i]);
            }
        }
        return res;
    }

    /**显示购买面板 */
    public static showMaterialBuyWnd(type:number){
        let resideNum = 0;
        // let data = MaterialModel.getMaterialItemInfo(type);
        // if (!data) {
        //     EffectUtils.showTips(GCode(CLEnum.MAT_FIGHT_MAX), 1, true);
        //     return;
        // }

        let cfg = C.MaterialTypeConfig[type];
        let vipCfg = C.VipPrivillegesConfig[cfg.vipBuyPrivilege];
        let buyMax = Number(vipCfg['vip' + RoleData.vipLevel]);//最大购买数量

        let costItem = Utils.parseCommonItemJson(cfg.buyPrice)[0];
        let info = MaterialModel.getMaterialItemInfo(type);
        if (info) {
            resideNum = buyMax - info.bought;    //剩余购买次数
        } else {
            resideNum = buyMax;
        }

        if (resideNum > 0) {
            let param: com_main.IMaterBuyInfo = { type: type, itemId: costItem.itemId, price: costItem.count, maxNum: resideNum };
            Utils.open_view(TASK_UI.MATERIAL_INFO__BUY_DLG, param);
            return;
        }
        // EffectUtils.showTips(GCode(CLEnum.MAT_TIPS_GMCS), 1, true);
        Utils.showVipUpConfim();
    }
}