/**
 *
 * @author 
 *
 */
module com_main {
    export class CCImageLoader{
        private m_pTarget:any;

        public name:string = "";

        public source(image:any, imageUrl:string){
            this.m_pTarget = image;
            this.load(imageUrl);
        }

        private load(imageUrl:string){
            var imageLoader: egret.ImageLoader = new egret.ImageLoader();

            imageLoader.crossOrigin = "anonymous";
            imageLoader.once(egret.Event.COMPLETE, this.loadCompleteHandler, this);
            imageLoader.load(imageUrl);
        }

        private loadCompleteHandler(event: egret.Event): void {
            var imageLoader = <egret.ImageLoader>event.currentTarget;

            if(ImageQLoader.count(this.m_pTarget) == 1){
                //ImageLRUCache.add(this.name, imageLoader.data)
                let texture = new egret.Texture();
                texture._setBitmapData(imageLoader.data);

                this.m_pTarget.source = texture;

                //this.m_pTarget.source = imageLoader.data;
            }
            ImageQLoader.shift(this.m_pTarget);
        }
    }

     class ImageLRUCache{
        private static m_pLinkedHashMap:any = {};
        private static m_pQueue:any[] = [];
        private static MAX = 200;

        private static update(){
            if(this.m_pQueue.length > this.MAX){
                var rid = this.m_pQueue.shift();
                delete this.m_pLinkedHashMap[rid];
            }
        }

        public static add(rid:any, image:any){
            this.m_pQueue.push(rid);
            this.m_pLinkedHashMap[rid] = image;

            this.update();
        }

        public static get(rid:any){
            return this.m_pLinkedHashMap[rid];
        }

        public static remove(){
            this.m_pLinkedHashMap = {};
            this.m_pQueue.length = 0;
        }
    }

    export class ImageQLoader{
        private static m_pLoaderQueue:any = {};

        public static clean(){
            ImageLRUCache.remove();
            this.m_pLoaderQueue = {};
        }

        public static push(image:egret.Bitmap)
        {
            if(!this.m_pLoaderQueue[image.hashCode]){
                this.m_pLoaderQueue[image.hashCode] = [];
            }

            this.m_pLoaderQueue[image.hashCode].push(1);
        }

        public static remove(image:egret.Bitmap)
        {
            if(this.m_pLoaderQueue[image.hashCode])
            {
                delete this.m_pLoaderQueue[image.hashCode];
            }
        }

        public static shift(image:egret.Bitmap)
        {
            var queue:any[] = this.m_pLoaderQueue[image.hashCode];
            if(queue)
            {
                queue.shift();
            }
        }

        public static count(image:egret.Bitmap)
        {
            if(this.m_pLoaderQueue[image.hashCode])
            {
                return this.m_pLoaderQueue[image.hashCode].length;
            } 
            return 0;
        }

        public static source(image: eui.Image, urlName ) {
             var data = ImageLRUCache.get( urlName );
                if( data ){
                    this.remove( image );
                    image.source = data;
                }else{
                    this.push(image);
                    var loader = new CCImageLoader();
                    loader.name = urlName;
                    loader.source(image, this.imageUrl( urlName ));
                }
        }

        public static imageUrl( headUrl ):string{
            let imgUrl = LoginConst.getResUrl(headUrl,'head');
            return imgUrl;
        }
    }
}

