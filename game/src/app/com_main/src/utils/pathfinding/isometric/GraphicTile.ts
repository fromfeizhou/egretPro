// module com {
//     export module isometric {
//         export class GraphicTile extends com.isometric.IsoObject {

//             public constructor(size: number, classRef: any, xoffset: number, yoffset: number) {
//                 super(size);
//                 var _self__: any = this;
//                 var gfx: egret.DisplayObject = flash.As3As(new classRef(), egret.DisplayObject);
//                 gfx.x = -xoffset;
//                 gfx.y = -yoffset;
//                 _self__.addChild(gfx);
//             }

//         }
//     }
// }

// flash.extendsClass("com.isometric.GraphicTile","com.isometric.IsoObject")
