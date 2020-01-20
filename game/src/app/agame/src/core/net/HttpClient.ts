/**
 *
 * @author 
 *
 */
module AGame {
    export class HttpClient {
        public responseType: string;
        public returnFunc: Function;
        public target: any;
        public request: egret.HttpRequest;

        // public static serverUrl: string;

        public constructor() {
        }

        private paramsBuilder(data: any): string {
            var params = [];
            if (typeof (data) == 'object') {
                var key;
                for (key in data) {
                    params.push(key + '=' + data[key])
                }
                return params.join('&');
            } else if (typeof (data) == 'string') {
                return data;
            }
            return '';
        }

        public send(method: string, callback: Function, target: any, data: any, url:string) {
            //zb
            this.returnFunc = callback;
            this.target = target;
            this.request = new egret.HttpRequest();

            var req = this.request;
            var params = this.paramsBuilder(data);

            let server_url = url
            if (method == egret.HttpMethod.POST) {
                req.setRequestHeader("Content-Type", "application/json");
            } else {
                // req.setRequestHeader("Content-Type", "application/json");
                server_url += '?' + params;//'?' + 
                params = '';
            }

            console.log(server_url);

            req.responseType = egret.HttpResponseType.TEXT;
            req.open(server_url, method);
            req.send(data);

            req.addEventListener(egret.Event.COMPLETE, this.onGetComplete, this);
            req.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
            req.addEventListener(egret.ProgressEvent.PROGRESS, this.onGetProgress, this);
        }

        private onGetComplete(event: egret.Event): void {
            var request = <egret.HttpRequest>event.currentTarget;
            var data: any = this.responseType == 'JSON' ? JSON.parse(request.response) : request.response;
            if (this.returnFunc != null) {
                this.returnFunc.call(this.target, data);
            }
            this.destory();
        }

        private onGetIOError(event: egret.IOErrorEvent): void {
            console.log("get error : " + event);
            this.destory();
        }

        private onGetProgress(event: egret.ProgressEvent): void {
            console.log("get progress : " + Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%");
        }

        private destory(): void {
            var req = this.request;

            req.removeEventListener(egret.Event.COMPLETE, this.onGetComplete, this);
            req.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
            req.removeEventListener(egret.ProgressEvent.PROGRESS, this.onGetProgress, this);

            this.returnFunc = null;
            this.request = null;
        }

        public static get(callback: Function, target: any, data: any, url :string): void {
            var client = new HttpClient();

            // client.responseType = responseType;
            client.send(egret.HttpMethod.GET, callback, target, data,url);
            // console.log(data);
        }

        public static post(callback: Function, target: any, data: any, url:string): void {
            var client = new HttpClient();

            // client.responseType = responseType;
            client.send(egret.HttpMethod.POST, callback, target, data,url);
        }
    }
}
