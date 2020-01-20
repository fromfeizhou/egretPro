module AGame {
	interface ILoaderFunc {
		call: Function;
		process: Function;
		target: any;
	}
	class ResLoader {
		private m_pGroups: { [name: string]: ILoaderFunc[] } = {};

		public constructor() {
			RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
			RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
			RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
			RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
		}

		public destroy() {
			RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
			RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
			RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
			RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);

			// var group;
			// for (var i: number = 0; i < this.m_pGroups.length; i++) {
			// 	group = this.m_pGroups[i];
			// 	group[0] = null;
			// 	group[1] = null;
			// 	group[2] = null;
			// }

			// this.m_pGroups.length = 0;
			// this.length = 0;
		}

		/**
		 * 加载资源组
		 * @param $groupName 资源组名称
		 * @param $onResourceLoadComplete 资源加载完成执行函数
		 * @param $onResourceLoadProgress 资源加载进度监听函数
		 * @param $onResourceLoadTarget 资源加载监听函数所属对象
		 */
		public loadGroup(groupName: string, onResourceLoadComplete: Function, onResourceLoadProgress: Function, target: any, priority?: number): void {
			if (!this.m_pGroups[groupName]) {
				this.m_pGroups[groupName] = [];
				RES.loadGroup(groupName, priority);
			}
			this.m_pGroups[groupName].push({ call: onResourceLoadComplete, process: onResourceLoadProgress, target: target });
		}

		/**
		 * 同时加载多个组
		 * @param $groups 自定义的组名称
		 * @param $onResourceLoadComplete 资源加载完成执行函数
		 * @param $onResourceLoadProgress 资源加载进度监听函数
		 * @param $onResourceLoadTarget 资源加载监听函数所属对象
		 */
		public loadGroups(groups: Array<string>, onResourceLoadComplete: Function, onResourceLoadProgress: Function, target: any): void {
			for (var i = 0; i < groups.length; i++) {
				let item = groups[i];
				this.loadGroup(item, onResourceLoadComplete, onResourceLoadProgress, target, i);
			}
		}

		private onResourceLoadComplete(event: RES.ResourceEvent): void {
			var group = this.m_pGroups[event.groupName];
			if (group) {
				for(let loaderFunc of group){
					var loadComplete: Function = loaderFunc.call;
					var loadCompleteTarget: any = loaderFunc.target;
					if (loadComplete != null)
						loadComplete.call(loadCompleteTarget, event.groupName);
				}
				
				delete this.m_pGroups[event.groupName];
			}

			// var keys = Object.keys(this.m_pGroups);

			// if (keys.length <= 0) {
			// 	this.destroy();
			// }
		}

		public getLoaderLength(){
			return Object.keys(this.m_pGroups);
		}

		private onResourceLoadError(event: RES.ResourceEvent): void {
			this.onResourceLoadComplete(event);
		}

		private onResourceProgress(event: RES.ResourceEvent): void {
			var group = this.m_pGroups[event.groupName];
			if (group) {
				for(let loaderFunc of group){
					var loadProgress: Function = loaderFunc.process;
					var loadProgressTarget: any = loaderFunc.target;
					if (loadProgress != null)
						loadProgress.call(loadProgressTarget, event.groupName, event.itemsLoaded, event.itemsTotal);
				}
			}
		}

		private onItemLoadError(event: RES.ResourceEvent): void {
			console.log("Url:" + event.resItem.url + " has failed to load");
		}
	}

	export class ResUtils {
		public static loader;
		public static loadConfig(url: string, resourceRoot?: string, type?: string): void {
			// RES.loadConfig(url, resourceRoot, type);
			RES.loadConfig(url, resourceRoot);
		}

		public static loadGroups(groups: Array<string>, onResourceLoadComplete: Function, onResourceLoadProgress: Function, target: any): number {
			if (!this.loader) {
				this.loader = new ResLoader();
			}
			this.loader.loadGroups(groups, onResourceLoadComplete, onResourceLoadProgress, target);

			return groups.length;
		}
	}
}