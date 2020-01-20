/**聊天数据结构 */
class ChatVo extends egret.HashObject implements IFObject {
    /**属性值 */
    public static AttriKey: Array<string> = ["headPortrait", "msg", "time", "msgType"];

    public type: ChatType; //4世界 3国家 2公会 1私聊 
    public headPortrait: gameProto.IHeadPortrait; //头像 
    public msg: string;
    public time: number;
    public msgType: number;  //数据类型

    public isOwnerMsg: boolean;     //是否是自己发送消息
    private m_bIsRead: boolean;      //是否阅读

    public static create(type: ChatType, body?: gameProto.IMsgData) {
        var obj: ChatVo = ObjectPool.pop(ChatVo, 'ChatVo', type, body);
        return obj;
    }

    public constructor(type: ChatType, body?: gameProto.IMsgData) {
        super();
        this.init(type, body);
    }

    public init(type: ChatType, body?: gameProto.IMsgData) {
        this.type = type;
        this.m_bIsRead = false;
        this.parseKeys(body);
        this.setOwnerMsgState();
    }

    public onDestroy() {
        ObjectPool.push(this);
    }

    /**更新数据 */
    public update(body?: gameProto.IMsgData) {
        this.parseKeys(body);
        this.msg = this.msg.replace(/(\\)/g, '');
    }
    /**解析服务器协议 */
    private parseKeys(body: any) {
        Utils.voParsePbData(this, body, ChatVo.AttriKey);
        
        if(this.msgType == ChatMsgType.INVITE){
            this.msg = ChatModel.parseInviteMsg(this.msg,this.headPortrait);
        }
    }

    /**消息发送者id */
    public set isRead(val: boolean) {
        if (this.m_bIsRead == val) return;
        this.m_bIsRead = val;
        com_main.EventMgr.dispatchEvent(ChatEvent.MSG_STATE_UPDATE, null);
    }

    /**消息发送者id */
    public get isRead(): boolean {
        return this.m_bIsRead;
    }

    /**消息发送者id */
    public get playerId(): number {
        return this.headPortrait ?this.headPortrait.playerId : 0;
    }

    /**消息发送者id */
    public get playerName(): string {
        return this.headPortrait.playerName;
    }

    /**消息发送者标题 */
    public getTitle(type: ChatType): string {
        if (type == ChatType.WORLD) {
            return this.headPortrait.playerName;
        }
        if (type == ChatType.LEGION) {
            return `【${LegionModel.getPosNameById(this.headPortrait.playerId)}】${this.headPortrait.playerName}`;
        }
        if (this.hasLegion()) return `【${this.headPortrait.labourUnionName}】${this.headPortrait.playerName}`;
        return this.headPortrait.playerName;
    }

    /**消息发送者国家 */
    public get stateId(): number {
        return this.headPortrait.countryId;
    }

    /**消息发送者时间描述 */
    public getTimeFormat(): string {
        return ChatModel.timeFormat(this.time);
    }

    /**是否是自己发送消息 */
    private setOwnerMsgState() {
        if(!this.headPortrait) return;
        this.isOwnerMsg = this.headPortrait.playerId == RoleData.playerId;
    }

    /**是否有工会 */
    public hasLegion() {
        return this.headPortrait.labourUnionId > 0;
    }
}