var NodeUtils = /** @class */ (function () {
    function NodeUtils() {
    }
    /**
     * 设置节点坐标
     * @static
     * @param  {egret.DisplayObject} node
     * @param  {number} x
     * @param  {number} y
     * @return
     * @memberof Utils
     */
    NodeUtils.setPosition = function (node, x, y) {
        if (!node)
            return;
        node.x = x;
        node.y = y;
    };
    /**
     * 设置节点缩放
     * @static
     * @param  {egret.DisplayObject} node
     * @param  {number} scale
     * @return
     * @memberof Utils
     */
    NodeUtils.setScale = function (node, scale) {
        if (!node)
            return;
        node.scaleX = scale;
        node.scaleY = scale;
    };
    /**
     * 重置起始属性
     * PImage 重置锚点
     * */
    NodeUtils.reset = function (node, isAnchor) {
        if (isAnchor === void 0) { isAnchor = false; }
        if (!node)
            return;
        node.scaleX = 1;
        node.scaleY = 1;
        node.alpha = 1;
        node.x = 0;
        node.y = 0;
        node.anchorOffsetX = 0;
        node.anchorOffsetY = 0;
        node.rotation = 0;
        node.width = node.height = undefined;
        if (isAnchor)
            node['anchorX'] = node['anchorY'] = 0;
        node.visible = true;
    };
    /**
 * 设置节点大小
 * @static
 * @param  {egret.DisplayObject} node
 * @return
 * @memberof Utils
 */
    NodeUtils.setSize = function (node, size) {
        if (!node)
            return;
        node.width = size.width;
        node.height = size.height;
    };
    /**
     * 设置节点坐标和缩放
     * @static
     * @param  {egret.DisplayObject} node
     * @param  {number} x
     * @param  {number} y
     * @param  {number} scale
     * @return
     * @memberof Utils
     */
    NodeUtils.setPosAndScale = function (node, x, y, scale) {
        if (!node)
            return;
        node.scaleX = scale;
        node.scaleY = scale;
        node.x = x;
        node.y = y;
    };
    /**
     * 添加并设置节点坐标和缩放
     * @static
     * @param  {egret.DisplayObjectContainer} parent
     * @param  {egret.DisplayObject} node
     * @param  {number} x
     * @param  {number} y
     * @param  {number} [scale]
     * @return
     * @memberof NodeUtils
     */
    NodeUtils.addPosAndScale = function (parent, node, x, y, scale) {
        if (!node || node.$parent)
            return;
        parent.addChild(node);
        if (scale != undefined)
            this.setPosAndScale(node, x, y, scale);
        else
            this.setPosition(node, x, y);
    };
    /**添加到别的图层 */
    NodeUtils.addOtherParent = function (obj, parent, container) {
        if (obj && parent && container) {
            var pos = parent.localToGlobal(obj.x, obj.y);
            container.globalToLocal(pos.x, pos.y, pos);
            this.setPosition(obj, pos.x, pos.y);
            container.addChild(obj);
        }
    };
    return NodeUtils;
}());
