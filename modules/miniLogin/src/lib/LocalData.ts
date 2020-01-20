class LocalData {
	private static OPEN_ID: string = "h5sdk.openid";
	

	/**本地文件保存数据 */
	public static setData(key: string, data: any): void {
		egret.localStorage.setItem(key, data);
	}
	
	/**通过本地文件获取数据 */
	public static getData(key: string, def: string = ''): any {
		var data: any;
		data = egret.localStorage.getItem(key);
		return data ? data : def;
	}

	/**移除本地文件数据 */
	public static removeData(key: string) {
		egret.localStorage.removeItem(key);
	}

	public static setOpenId(openId: any): void {
		this.setData(this.OPEN_ID, openId);
	}

	public static getOpenId(): any {
		return this.getData(this.OPEN_ID) || 'huanggj';
	}
}