/**
 * Created by yaowan on 2016/11/28.
 */
module AGame {
    export class AImage extends eui.Image{
        $hitTest(stageX: number, stageY: number): egret.DisplayObject {
            if (this.touchEnabled){
                return super.$hitTest(stageX,stageY);
            }else{
                return null;
            }
        }
    }
}