module com_main {
  export class MaterialItem extends CComponent {

    public m_imgCard: eui.Image;
    public m_mask: eui.Rect;
    public m_labLevel: com_main.CLabel;
    public m_labTile: com_main.CLabel;
    public m_comFightItem: com_main.ComFightItem;
    public m_pItemsRoot: eui.Group;
    public m_imgLocked: eui.Image;
    public m_btnFight: com_main.ComButton;
    public m_labPass: eui.Label;
    public m_pRoot: eui.Group;
    public m_black: com_main.CImage;


    public m_copyId = 0;
    public copyCfg: MaterialConfig;
    private m_nType: MaterialEnum;
    private m_btnState: number;//按钮状态
    private m_copyInfo: gameProto.IMaterialType = null;
    private m_sAwards: string;   //奖励串
    private m_bIsGary: boolean = false;
    private openLv: number;     //开启等级
    public constructor() {
      super();
      this.skinName = Utils.getSkinName("app/material/MaterialItemSkin.exml");
    }

    $onRemoveFromStage(isclear = true): void {
      this.onDestroy();
      super.$onRemoveFromStage(isclear);
    }
    public onDestroy(): void {
      this.removeEvent();
      super.onDestroy();
    }
    protected createChildren(): void {
      super.createChildren();
      this.m_imgCard.mask = this.m_mask;
      this.initEvent()
    }
    private initEvent() {
      EventManager.addTouchScaleListener(this.m_btnFight, this, this.onBtnFight);
      EventManager.addTouchScaleListener(this.m_imgLocked, this, this.onImgLock);
    }

    private removeEvent() {
      EventManager.removeEventListeners(this);
    }
    /**设置材料副本信息 */
    public setItemInfo(type: MaterialEnum, id: number) {
      this.m_nType = type;
      this.m_copyId = id;
      this.copyCfg = C.MaterialConfig[this.m_copyId];
      this.refreshMaterialView();
      this.rewardShow();
    }

    /**刷新 */
    private refreshMaterialView() {
      this.refreshCard();
      this.openLv = this.copyCfg.playerLevel;
      let isOpen = RoleData.level >= this.openLv;
      // this.m_pSingleAward.visible = isOpen;
      this.m_labPass.text = "";
      let isPass = MaterialModel.ifMaterialpass(this.m_copyId);
      this.m_imgLocked.visible = !isOpen;
      if (isOpen && isPass) {
        Utils.isGray(false, this.m_imgCard);
        this.m_black.visible = false;
      } else {
        this.m_black.visible = true;
      }

      this.m_btnFight.visible = true;
      let boo = MaterialModel.ifMateialPass(this.m_copyId);
      this.m_copyInfo = MaterialModel.getMaterialItemInfo(this.copyCfg.type);
      if (this.m_copyInfo && boo) {
        this.m_btnFight.currentState = 'style6';
        this.m_btnState = BtnState.SWEEPING;
        this.m_btnFight.setTitleLabel(GCode(CLEnum.MAT_SWEEP_FREE));
      } else {
        this.m_btnFight.currentState = 'style1';
        this.m_btnState = BtnState.CHALLANGE;
        if (!isOpen) {
          this.m_pRoot.touchChildren = false;
          this.m_btnFight.visible = false;
          this.m_labPass.text = GCodeFromat(CLEnum.FUNC_OPEN_LIMIT, this.openLv);
        } else {
          if (!isPass) {
            let lastCfg = C.MaterialConfig[this.copyCfg.prev];
            this.m_labPass.text = GCodeFromat(CLEnum.MAT_TIPS_TGKQ, lastCfg.name);
            this.m_pRoot.touchChildren = false;
            this.m_btnFight.visible = false;
            return;
          }
          this.m_btnFight.setTitleLabel(GCode(CLEnum.CAMP_FIGHT));
          this.m_pRoot.touchChildren = true;
        }
      }
      // RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_btnFight, { x: 116, y: -3, scale: 0.78 }, [ MaterialModel.redTpye[this.copycfg.type]], 2, { id: this.m_copyId })
    }
    /**刷新卡片 */
    private refreshCard() {
      if (!this.copyCfg) return;
      this.m_labTile.text = GLan(this.copyCfg.name);
      this.m_comFightItem.setFight(this.copyCfg.power);
      if (this.copyCfg.scenetype == 1) {
        let cfg = GeneralModel.getGeneralConfig(this.copyCfg.model);
        this.m_imgCard.source = GeneralModel.getSoldierBigLogo(cfg.role);
      } else {
        this.m_imgCard.source = `arena_item_stage_${this.copyCfg.model}_jpg`;
      }
      this.m_imgCard.width = this.copyCfg.scenetype == 1 ? 580 : 314;
      this.m_imgCard.height = this.copyCfg.scenetype == 1 ? 755 : 529;
      this.m_imgCard.scaleX = this.copyCfg.scenetype == 1 ? 0.7 : 1;
      this.m_imgCard.scaleY = this.copyCfg.scenetype == 1 ? 0.7 : 1;


      this.m_labLevel.text = GCodeFromat(CLEnum.LEVEL1, this.copyCfg.grade);


    }
    /**奖励显示 */
    private rewardShow() {
      Utils.removeAllChild(this.m_pItemsRoot);
      let awardInfos = Utils.parseCommonItemJson(this.copyCfg.reward);
      for (let i = 0; i < awardInfos.length; i++) {
        let info = awardInfos[i];
        let itemView = ComItemNew.create('count');
        itemView.setItemInfo(info.itemId, info.count);
        itemView.scaleX = 0.75;
        itemView.scaleY = 0.75;
        this.m_pItemsRoot.addChild(itemView);
      }
    }
    public setViewState(state: string) {
      if (this.currentState != state)
        this.currentState = state;
    }
    /**当前挑战为0是按钮判断*/
    public getBtnAddState(type: number) {
      let resideNum = 0;
      let cfg = C.MaterialTypeConfig[type];
      let vipCfg = C.VipPrivillegesConfig[cfg.vipBuyPrivilege];
      let buyMax = Number(vipCfg['vip' + RoleData.vipLevel]);//最大购买数量
      let currCfg = MaterialModel.getMaterialItemInfo(type);
      let m_maxCount = C.MaterialTypeConfig[type].freeCount;
      let m_num = 0;     //已使用次数
      let m_buyNum = 0;      //已购买次数
      if (cfg) {
        m_num = currCfg.used;
        m_buyNum = currCfg.bought;
      }

      let m_coinPrice = Utils.parseCommonItemJson(cfg.buyPrice)[0];
      let info = MaterialModel.getMaterialItemInfo(type);
      if (info) {
        resideNum = buyMax - info.bought;    //剩余购买次数
      } else {
        resideNum = buyMax;
      }
      if ((m_maxCount - m_num + m_buyNum) >= m_maxCount) {
        EffectUtils.showTips(GCode(CLEnum.MAT_FIGHT_MAX), 1, true);
        return;
      }
      if (resideNum > 0) {
        Utils.open_view(TASK_UI.MATERIAL_INFO__BUY_DLG, { synum: resideNum, useNum: m_num, maxCount: m_maxCount, itemId: m_coinPrice.itemId, price: m_coinPrice.count, type: type });
      } else
        EffectUtils.showTips(GCode(CLEnum.MAT_TIPS_GMCS), 1, true);
    }
    private onImgLock() {
      EffectUtils.showTips(GCodeFromat(CLEnum.FUNC_OPEN_LIMIT, this.openLv), 1, true);
    }
    /**
   * 挑战事件
   */
    private onBtnFight(e: any) {
      let currCount = MaterialModel.getCurrCount(this.m_nType);
      if (currCount <= 0) {
        if (platform.isHidePayFunc()) {
          EffectUtils.showTips("挑战次数不足");
        } else {
          MaterialModel.showMaterialBuyWnd(this.m_nType);
        }
        return;
      }
      switch (this.m_btnState) {
        case BtnState.CHALLANGE:
          Utils.open_view(TASK_UI.POS_CAMP_VIEW, { type: CheckPointType.MATERIAL, battleId: this.m_copyId, copyType: this.m_nType });
          break;
        case BtnState.SWEEPING:
          MaterialProxy.C2S_MATERIAL_CHALLENGE(this.m_copyId, true);//扫荡
          break;
      }
    }

  }
}