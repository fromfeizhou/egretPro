
class ScrollEvent extends egret.Event{

    // 到达终点
    public static REACH_END:string = "reach_end";

    // 中间
    public static REACH_RANGE:string = "reach_range";

    // 到达起点
    public static REACH_START:string = "reach_start";


    constructor(type:string, bubbles?:boolean, cancelable?:boolean, data?:any) {
        super(type, bubbles, cancelable, data);
    }
}