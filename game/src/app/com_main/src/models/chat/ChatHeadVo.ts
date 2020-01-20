/**聊天头像结构 */
class ChatHeadVo extends egret.HashObject implements IFObject {
    /**属性值 */
    public static AttriKey: Array<string> = ["headPortrait", "lastTime"];
    public headPortrait: gameProto.IHeadPortrait; //头像 
    public lastTime: number;

    public static create(body?: gameProto.IPlayerHeadPortrait) {
        var obj: ChatHeadVo = ObjectPool.pop(ChatHeadVo, 'ChatHeadVo', body);
        return obj;
    }

    public constructor(body?: gameProto.IPlayerHeadPortrait) {
        super();
        this.init(body);
    }

    public init(body?: gameProto.IPlayerHeadPortrait) {
        this.parseKeys(body);
    }

    public onDestroy() {
        ObjectPool.push(this);
    }

    /**更新数据 */
    public update(body?: gameProto.IPlayerHeadPortrait) {
        this.parseKeys(body);
    }
    /**解析服务器协议 */
    private parseKeys(body: any) {
        Utils.voParsePbData(this, body, ChatHeadVo.AttriKey);
    }

    
}