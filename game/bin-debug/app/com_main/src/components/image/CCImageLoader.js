/**
 *
 * @author
 *
 */
var com_main;
(function (com_main) {
    var CCImageLoader = /** @class */ (function () {
        function CCImageLoader() {
            this.name = "";
        }
        CCImageLoader.prototype.source = function (image, imageUrl) {
            this.m_pTarget = image;
            this.load(imageUrl);
        };
        CCImageLoader.prototype.load = function (imageUrl) {
            var imageLoader = new egret.ImageLoader();
            imageLoader.crossOrigin = "anonymous";
            imageLoader.once(egret.Event.COMPLETE, this.loadCompleteHandler, this);
            imageLoader.load(imageUrl);
        };
        CCImageLoader.prototype.loadCompleteHandler = function (event) {
            var imageLoader = event.currentTarget;
            if (ImageQLoader.count(this.m_pTarget) == 1) {
                //ImageLRUCache.add(this.name, imageLoader.data)
                var texture = new egret.Texture();
                texture._setBitmapData(imageLoader.data);
                this.m_pTarget.source = texture;
                //this.m_pTarget.source = imageLoader.data;
            }
            ImageQLoader.shift(this.m_pTarget);
        };
        return CCImageLoader;
    }());
    com_main.CCImageLoader = CCImageLoader;
    var ImageLRUCache = /** @class */ (function () {
        function ImageLRUCache() {
        }
        ImageLRUCache.update = function () {
            if (this.m_pQueue.length > this.MAX) {
                var rid = this.m_pQueue.shift();
                delete this.m_pLinkedHashMap[rid];
            }
        };
        ImageLRUCache.add = function (rid, image) {
            this.m_pQueue.push(rid);
            this.m_pLinkedHashMap[rid] = image;
            this.update();
        };
        ImageLRUCache.get = function (rid) {
            return this.m_pLinkedHashMap[rid];
        };
        ImageLRUCache.remove = function () {
            this.m_pLinkedHashMap = {};
            this.m_pQueue.length = 0;
        };
        ImageLRUCache.m_pLinkedHashMap = {};
        ImageLRUCache.m_pQueue = [];
        ImageLRUCache.MAX = 200;
        return ImageLRUCache;
    }());
    var ImageQLoader = /** @class */ (function () {
        function ImageQLoader() {
        }
        ImageQLoader.clean = function () {
            ImageLRUCache.remove();
            this.m_pLoaderQueue = {};
        };
        ImageQLoader.push = function (image) {
            if (!this.m_pLoaderQueue[image.hashCode]) {
                this.m_pLoaderQueue[image.hashCode] = [];
            }
            this.m_pLoaderQueue[image.hashCode].push(1);
        };
        ImageQLoader.remove = function (image) {
            if (this.m_pLoaderQueue[image.hashCode]) {
                delete this.m_pLoaderQueue[image.hashCode];
            }
        };
        ImageQLoader.shift = function (image) {
            var queue = this.m_pLoaderQueue[image.hashCode];
            if (queue) {
                queue.shift();
            }
        };
        ImageQLoader.count = function (image) {
            if (this.m_pLoaderQueue[image.hashCode]) {
                return this.m_pLoaderQueue[image.hashCode].length;
            }
            return 0;
        };
        ImageQLoader.source = function (image, urlName) {
            var data = ImageLRUCache.get(urlName);
            if (data) {
                this.remove(image);
                image.source = data;
            }
            else {
                this.push(image);
                var loader = new CCImageLoader();
                loader.name = urlName;
                loader.source(image, this.imageUrl(urlName));
            }
        };
        ImageQLoader.imageUrl = function (headUrl) {
            var imgUrl = LoginConst.getResUrl(headUrl, 'head');
            return imgUrl;
        };
        ImageQLoader.m_pLoaderQueue = {};
        return ImageQLoader;
    }());
    com_main.ImageQLoader = ImageQLoader;
})(com_main || (com_main = {}));
