module com_main {
  export class BossChallItem extends CComponent {
    /*================================================================================================*/
    private static PRO_WIDTH = 312;
    /*================================================================================================*/

    public m_imgPro: eui.Image;
    public m_labPro: com_main.CLabel;
    public m_imgCard: eui.Image;
    public m_mask: eui.Rect;
    public m_labLevel: com_main.CLabel;
    public m_labTile: com_main.CLabel;
    public m_comFightItem: com_main.ComFightItem;
    public m_imgLocked: eui.Image;
    public m_btnFight: com_main.ComButton;
    public m_pSingleAward: eui.Group;
    public m_btnSingle: eui.Image;
    public m_pMultiAward: eui.Group;
    public m_btnKill: eui.Image;
    public m_btnRank: eui.Image;
    public m_labTips: eui.Label;
    public m_rankGroup: eui.Group;
    public m_wsbtxt: com_main.CLabel;
    public m_rankCunt: eui.BitmapLabel;
    public m_pBlood: eui.Group;
    public m_black: com_main.CImage;
    public m_pRoot: eui.Group;


    public m_nBossId = 0;
    public m_bossCfg: PersonalBossConfig;
    private m_nType: BossEnum;
    private m_btnState: number;//按钮状态
    private m_singleInfo: gameProto.IPersonalBossInfo = null; // 个人boss信息	
    private rankBossInfo: gameProto.IRankBossInfo = null; // 排名boss信息	
    private worldBossInfo: gameProto.IWorldBossInfo = null; // 世界boss信息	

    private m_nRemainTime = 0;/**倒计时 */
    private m_bIsGary: boolean = false;
    public constructor() {
      super();
      this.skinName = Utils.getSkinName("app/boss/BossChallItemSkin.exml");
    }
    $onRemoveFromStage(isclear = true): void {
      this.onDestroy();
      super.$onRemoveFromStage(isclear);
    }
    public onDestroy(): void {
      this.removeEvent();
      Utils.TimerManager.remove(this.updateRemainTime, this);
      super.onDestroy();
    }

    protected createChildren(): void {
      super.createChildren();
      this.m_imgCard.mask = this.m_mask;
      this.initEvent();
      // Utils.TimerManager.doTimer(1000, 0, this.updateTime, this);
    }
    /**设置boss信息 */
    public setItemInfo(type: BossEnum, bossId: number) {
      Utils.TimerManager.remove(this.updateRemainTime, this);

      this.m_nType = type;
      this.m_nBossId = bossId;
      this.m_bossCfg = C.PersonalBossConfig[this.m_nBossId];
      switch (this.m_nType) {
        case BossEnum.Single: {
          this.reFreshSingleView();
          break;
        }
        case BossEnum.Rank: {
          this.reFreshRankView();
          break;
        }
        case BossEnum.World: {
          this.reFreshWorldView();
          break;
        }
      }
    }
    /**刷新个人boss */
    private reFreshSingleView() {
      this.reFreshCard();
      let openLv = this.m_bossCfg.openLevel;
      let isOpen = RoleData.level >= openLv;
      this.m_pSingleAward.visible = isOpen;
      this.m_imgLocked.visible = !isOpen;
      this.m_btnFight.visible = true;
      this.m_labTips.text = '';
      if (isOpen) {
        Utils.isGray(false, this.m_imgCard);
        this.m_black.visible = false;
      } else {
        this.m_black.visible = true;
      }
      this.m_singleInfo = BossModel.getSingleItemInfo(this.m_nBossId);
      if (this.m_singleInfo) {
        this.m_btnFight.currentState = 'style6';
        this.m_btnState = BtnState.SWEEPING;
        this.m_btnFight.setTitleLabel(GCode(CLEnum.CAMP_SWEEP));
      } else {
        this.m_btnFight.currentState = 'style1';
        this.m_btnState = BtnState.CHALLANGE;
        if (!isOpen) {
          this.m_pRoot.touchChildren = false;
          this.m_btnFight.visible = false;
          this.m_labTips.text = GCodeFromat(CLEnum.FUNC_OPEN_LIMIT, openLv);
        } else {
          this.m_btnFight.setTitleLabel(GCode(CLEnum.CAMP_FIGHT));
          this.m_pRoot.touchChildren = true;
        }
      }
      RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_btnFight, { x: 116, y: -3, scale: 0.78 }, [RedEvtType.BOSS_SINGLE], 2, { bossId: this.m_nBossId })
    }

    /**刷新排行boss */
    private reFreshRankView() {
      this.rankBossInfo = BossModel.getRandItemInfo(this.m_nBossId);
      this.reFreshCard();
      if (this.rankBossInfo) {
        this.reFreshHp(this.rankBossInfo.bossHp);
      }
      this.m_btnState = BtnState.CHALLANGE;
      let openLv = this.m_bossCfg.openLevel;
      let isOpen = RoleData.level >= openLv;
      this.m_pMultiAward.visible = isOpen;
      this.m_pBlood.visible = isOpen;
      this.m_imgLocked.visible = !isOpen;
      this.m_btnFight.visible = true;
      this.m_labTips.visible = false;
      this.m_rankGroup.visible = true;
      if (isOpen) {
        Utils.isGray(false, this.m_imgCard);
        this.m_black.visible = false;
      } else {
        this.m_black.visible = true;
      }
      this.m_labTips.visible = false;
      this.m_wsbtxt.visible = true;
      this.m_rankCunt.text = '';
      if (!isOpen) {
        this.m_rankGroup.visible = false;
        this.m_labTips.visible = true;
        this.m_labTips.text = GCodeFromat(CLEnum.FUNC_OPEN_LIMIT, openLv);
        this.m_pRoot.touchChildren = false;
        this.m_btnFight.visible = false;
        return;
      } else {
        this.m_pRoot.touchChildren = true;
        this.m_btnFight.setTitleLabel(GCode(CLEnum.CAMP_FIGHT));
      }
      if (this.rankBossInfo) {
        //复活时间
        let reviveTime = this.rankBossInfo.bossReviveTime;
        if (reviveTime > 0) {
          this.m_btnFight.visible = false;
          this.m_labTips.visible = true;
          this.reFreshCardTime(reviveTime);

        }
        let rankLv = BossModel.getPlayerLvInRankBoss(this.m_nBossId);
        if (rankLv > 0) {
          this.m_wsbtxt.visible = false;
          this.m_rankCunt.text = rankLv + '';
        } else {
          this.m_rankCunt.text = '';
          this.m_wsbtxt.visible = true;
        }
      }
      RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_btnFight, { x: 116, y: -3, scale: 0.78 }, [RedEvtType.BOSS_RANK], 2, { bossId: this.m_nBossId });
    }

    /**刷新世界boss */
    private reFreshWorldView() {
      this.worldBossInfo = BossModel.getWorldItemInfo(this.m_nBossId);
      this.reFreshCard();
      this.m_btnState = BtnState.CHALLANGE;
      if (this.worldBossInfo) {
        this.reFreshHp(this.worldBossInfo.bossHp);
      } else {
        this.reFreshHp(1);
      }
      let openTime = this.m_bossCfg.time;
      openTime = openTime.replace('[', '');
      openTime = openTime.replace(']', '');
      let times = openTime.split(',');
      let startTime = TimerUtils.getTimeByFormatA(times[0]);
      let endTime = TimerUtils.getTimeByFormatA(times[1]);
      let curTime = TimerUtils.getServerTime();
      let curweek = TimerUtils.getTimeWeek();
      let isOpen = (curTime >= startTime && curTime <= endTime);
      let weekOpeen = (curweek == this.m_bossCfg.week)
      if (isOpen && weekOpeen) {
        this.m_btnFight.visible = true;
        this.m_pBlood.visible = true;
        this.m_btnFight.setTitleLabel(GCode(CLEnum.CAMP_FIGHT));
        this.m_labTips.textFlow = [];
      } else {
        this.m_btnFight.visible = false;
        this.m_pBlood.visible = false;
        let dayDes = [GCode(CLEnum.BOSS_DAY7), GCode(CLEnum.BOSS_DAY1), GCode(CLEnum.BOSS_DAY2), GCode(CLEnum.BOSS_DAY3),
        GCode(CLEnum.BOSS_DAY4), GCode(CLEnum.BOSS_DAY5), GCode(CLEnum.BOSS_DAY6)];
        let dateStr = `${dayDes[this.m_bossCfg.week] + "： "}<font color=#e9e9e6>${times[0].slice(0, 5)}-${times[1].slice(0, 5)}</font>`
        this.m_labTips.textFlow = Utils.htmlParser(dateStr);
      }
      let rankLv = BossModel.getPlayerLvInWorldBoss(this.m_nBossId);
      if (rankLv > 0) {
        this.m_wsbtxt.visible = false;
        this.m_rankCunt.text = rankLv + '';
      } else {
        this.m_rankCunt.text = '';
        this.m_wsbtxt.visible = true;
      }
      RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_btnFight, { x: 116, y: -3, scale: 0.78 }, [RedEvtType.BOSS_WORLD], 2, { bossId: this.m_nBossId });
    }

    /**刷新卡片 */
    private reFreshCard() {
      if (!this.m_bossCfg) return;
      this.m_labTile.text = GLan(this.m_bossCfg.bossName);
      this.m_comFightItem.setFight(this.m_bossCfg.power);
      let cfg = GeneralModel.getGeneralConfig(this.m_bossCfg.model);
      this.m_imgCard.source = GeneralModel.getSoldierBigLogo(cfg.role);
      this.m_labLevel.text = GCodeFromat(CLEnum.LEVEL1, this.m_bossCfg.openLevel);
    }

    /**设置boss血量 */
    public reFreshHp(percent: number) {
      this.m_labPro.text = Math.ceil(percent * 100) + "%";
      this.m_imgPro.width = BossChallItem.PRO_WIDTH * percent;
    }


    /**刷新卡片倒计时显示 */
    private reFreshCardTime(time: number) {
      Utils.TimerManager.remove(this.updateRemainTime, this);
      this.m_nRemainTime = time;
      Utils.TimerManager.doTimer(1000, 0, this.updateRemainTime, this);
      this.m_labTips.text = Utils.DateUtils.getCountdownStrByTimestamp(this.m_nRemainTime);
    }

    /**刷新倒计时 */
    private updateRemainTime() {
      let curtime = TimerUtils.getServerTimeMill();
      let remaiTime = this.m_nRemainTime - curtime;
      if (remaiTime > 0) {
        if (--remaiTime > 0) {
          this.m_labTips.text = Utils.DateUtils.getCountdownStrByTimestamp(this.m_nRemainTime);
        }
      } else {
        Utils.TimerManager.remove(this.updateRemainTime, this);
        BossProxy.C2S_GET_BOSS();
      }
    }

    public setViewState(state: string) {
      if (this.currentState != state)
        this.currentState = state;
      this.commitProperties();
    }

    /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
    private initEvent() {
      EventManager.addTouchScaleListener(this.m_btnFight, this, this.onBtnFight);
      EventManager.addTouchScaleListener(this.m_btnSingle, this, this.onCheckBox);
      EventManager.addTouchScaleListener(this.m_btnKill, this, this.onCheckBox);
      EventManager.addTouchScaleListener(this.m_btnRank, this, this.onRankReward);
      EventManager.addTouchScaleListener(this.m_rankGroup, this, this.onRankGroup);
      EventManager.addTouchScaleListener(this.m_imgLocked, this, this.onImgLock);
    }
    private removeEvent() {
      EventManager.removeEventListeners(this);
    }
    /**
   * 挑战事件
   */
    private onBtnFight(e: any) {
      switch (this.m_btnState) {
        case BtnState.CHALLANGE: {
          this.onChallange();
          break;
        }
        case BtnState.SWEEPING: {
          this.onSweep();
          break;
        }
      }
    }
    private onImgLock() {
      EffectUtils.showTips(GCodeFromat(CLEnum.FUNC_OPEN_LIMIT, this.m_bossCfg.openLevel), 1, true);
    }
    /**boss挑战 */
    private onChallange() {
      let info = this.getFuncInfo();
      if (info.reCount <= 0) {
        EffectUtils.showTips(GCode(CLEnum.MAT_NO_NUMBER), 1, true);
        return;
      }
      if (TeamModel.isEmptyTeamPVE()) {
        Utils.open_view(TASK_UI.POS_CAMP_VIEW, { type: CheckPointType.BOSS, battleId: this.m_nBossId });
        return;
      }
      BossProxy.C2S_CHALLENGE_BOSS(this.m_nBossId);
    }

    /**boss扫荡 */
    private onSweep() {
      let info = this.getFuncInfo();
      if (info.reCount > 0) {
        BossProxy.C2S_CLEAR_BOSS(this.m_nBossId, 1);
      } else {
        if (info.reBuyAmountCount > 0) {
          let totalPrice = NormalModel.getFunCostByData(info);
          let content = GCodeFromat(CLEnum.ARENA_NUM_TIPS, totalPrice) + '\n' + GCodeFromat(CLEnum.VIP_MAX_BUY, info.reBuyAmountCount);
          Utils.showConfirmPop(content, () => {
            BossProxy.C2S_BUY_BOSS_CHALLENGE_COUNT(this.m_nType);
          }, this);
        } else {
          EffectUtils.showTips(GCode(CLEnum.BOSS_BUY_FAL), 1, true);
        }
      }
    }


    /**boss伤害榜单 */
    private onRankGroup() {
      switch (this.m_nType) {
        case BossEnum.Rank:
          if (this.rankBossInfo) {
            Utils.open_view(TASK_UI.BOSS_HURT_RANK, { list: this.rankBossInfo });
          }
          break;
        case BossEnum.World:
          if (this.worldBossInfo) {
            Utils.open_view(TASK_UI.BOSS_HURT_RANK, { list: this.worldBossInfo });
          }
      }
    }
    /**
    * 查看击杀奖励
    */
    private onCheckBox(e: any) {
      let awards: IItemInfo[];
      if (this.m_bossCfg.bossType == BossEnum.Single) {
        awards = Utils.parseCommonItemJsonInDrop(JSON.stringify([this.m_bossCfg.killReward]));
      } else if (this.m_bossCfg.bossType) {
        let rawardList = BossModel.getAwardBybossId(this.m_bossCfg.id, this.m_bossCfg.bossType);
        awards = rawardList[0].reward;
      }
      Utils.open_view(TASK_UI.NOR_REWARD__PANEL, { awards: awards });
    }
    /**
  * 查看排名奖励
  */
    private onRankReward(e: any) {
      let rawardList = BossModel.getAwardBybossId(this.m_bossCfg.id, this.m_bossCfg.bossType);
      let List = [];
      for (let i = 0; i < rawardList.length; i++) {
        let raward = rawardList[i];
        if (raward.rank != 0) {
          List.push(raward);
        }
      }
      Utils.open_view(TASK_UI.BOSS_BOX_RANKREWARD, { awards: List, bossType: this.m_bossCfg.bossType });
    }


    /**获得功能次数 */
    private getFuncInfo() {
      switch (this.m_nType) {
        case BossEnum.Single:
          return NormalModel.getFunCountById(IFunCountEnum.PERSONAL_BOSS);
        case BossEnum.Rank:
          return NormalModel.getFunCountById(IFunCountEnum.RANK_BOSS);
      }
      return NormalModel.getFunCountById(IFunCountEnum.WORLD_BOSS);
    }
  }
}