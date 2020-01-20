class LoginConst {

    public static getResUrl(name: string, root: string = 'login') {
        if (!name || name == '') return '';
        let url = $Platform == 0 ? 'http://192.168.0.18:7979/' : $PlatformSrc;
        return root == '' ? `${url}${name}` : `${url}${root}/${name}`+ "?v=" + GameConfig.version;;
    }

    /**获得浏览器类型 */
    public static systemType(): string {
        var ua = window.navigator.userAgent.toLowerCase();
        var microStr = "" + ua.match(/MicroMessenger/i);
        if (("" + ua.match(/windows nt/i)) == "windows nt") {
            return "windows";
        } else if (("" + ua.match(/iphone/i)) == "iphone") {
            return "ios";
        } else if (("" + ua.match(/android/i)) == "android") {
            return "android";
        } else if (("" + ua.match(/ipad/i)) == "ipad") {
            return "ipad";
        } else if (("" + ua.match(/linux/i)) == "linux") {
            return "linux";
        } else if (("" + ua.match(/mac/i)) == "mac") {
            return "mac";
        } else if (("" + ua.match(/ucbrower/i)) == "ucbrower") {
            return "ucbrower";
        } else {
            console.log("未知系统类型");
        }
    }

    //是不是微信浏览
    public static isWeiXin(): boolean {
        var ua = window.navigator.userAgent.toLowerCase();
        var microStr = "" + ua.match(/MicroMessenger/i);
        if (microStr == "null") {
            return false;
        } else if (microStr == "micromessenger") {
            return true;
        }
    }

    //获得平台类型 如 微信、qqzone、qq、微博、校内、facebook
    public static platformType(): string {
        var ua = window.navigator.userAgent.toLowerCase();
        if (("" + ua.match(/micromessenger/i)) == "micromessenger") {
            return "micromessenger";
        } else if (("" + ua.match(/qzone/i)) == "qzone") {
            return "qzone";
        } else if (("" + ua.match(/weibo/i)) == "weibo") {
            return "weibo";
        } else if (("" + ua.match(/qq/i)) == "qq") {
            return "qq";
        } else if (("" + ua.match(/renren/i)) == "renren") {
            return "renren";
        } else if (("" + ua.match(/txmicroblog/i)) == "txmicroblog") {
            return "txmicroblog";
        } else if (("" + ua.match(/douban/i)) == "douban") {
            return "douban";
        } else {
            return "other";
        }
    }

    /**低画质平台 */
    public static isLowMcMachine() {
        return PlatConst.isLowMcMachine();
    }

    /**服务器列表 文字颜色(中文不要塞语言包 没读取) */
    public static getSerStateLab(status: number) {
        if (status == 1) {
            return `<font color=#FF0000>[爆满]</font>`;
        } else if (status == 2) {
            return `<font color=#90FC5B>[流畅]</font>`;
        } else if (status == 3) {
            return `<font color=#8A8A9E>[维护]</font>`;
        } else if (status == 4){
            return `<font color=#90FC5B>[推荐]</font>`;
        }
        return `<font color=#8A8A9E>[维护]</font>`;
    }



    /**=====================================================================================
    * 简单ui类库 begin
    * =====================================================================================
    */
    public static addTouchEvent(target: egret.DisplayObject, callBack: Function, thisObj: any) {
        target.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onScaleTouch, thisObj);
        target.addEventListener(egret.TouchEvent.TOUCH_END, this.onScaleTouch, thisObj);
        target.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onScaleTouch, thisObj);
        target.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onScaleTouch, thisObj);
        target['$touchFunc'] = callBack;
        target['$touchTaget'] = thisObj;
    }

    public static removeTouchEvent(target: egret.DisplayObject, callBack: Function, thisObj: any) {
        target.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onScaleTouch, thisObj);
        target.removeEventListener(egret.TouchEvent.TOUCH_END, this.onScaleTouch, thisObj);
        target.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onScaleTouch, thisObj);
        target.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onScaleTouch, thisObj);
        delete target['$touchFunc'];
        delete target['$touchTaget'];
    }

    public static onScaleTouch(event: egret.Event) {
        var object: egret.DisplayObject = <egret.DisplayObject>event.currentTarget;
        event.stopImmediatePropagation();
        egret.Tween.removeTweens(object);
        var tw = egret.Tween.get(object);
        switch (event.type) {
            case egret.TouchEvent.TOUCH_BEGIN:
                tw.to({ scaleX: TOUCH_SCALE_XY, scaleY: TOUCH_SCALE_XY }, TOUCH_SCALE_DEALY);
                break;
            case egret.TouchEvent.TOUCH_END: {
                tw.to({ scaleX: 1, scaleY: 1 }, TOUCH_SCALE_DEALY);
                if (object['$touchFunc'] && object['$touchTaget']) {
                    object['$touchFunc'].call(object['$touchTaget']);
                }
                break;
            }
            case egret.TouchEvent.TOUCH_RELEASE_OUTSIDE:
            case egret.TouchEvent.TOUCH_CANCEL:
                var tw = egret.Tween.get(object);
                tw.to({ scaleX: 1, scaleY: 1 }, TOUCH_SCALE_DEALY);
                break;
        }
    }

    /**创建图片 */
    public static createImage(name: string, x: number = 0, y: number = 0, width: number = 0, height: number = 0, touch: boolean = false) {
        let image = new eui.Image(LoginConst.getResUrl(name))
        image.x = x;
        image.y = y;
        if (width > 0) image.width = width;
        if (height > 0) image.height = height;
        image.touchEnabled = touch;
        return image;
    }

    /**创建文本 */
    public static createLabel(text: string, x: number = 0, y: number = 0, size: number = 20, color: number = 0xe9e9e6, touch: boolean = false) {
        let label = new eui.Label(text);
        label.x = x;
        label.y = y;
        label.size = size;
        label.textColor = color;
        label.touchEnabled = touch;
        return label;
    }
    /**=====================================================================================
    * 简单ui类库 end
    * =====================================================================================
    */

}