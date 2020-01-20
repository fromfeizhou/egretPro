class SoundItem extends egret.HashObject {
	/**声音类型 */
	public type: string;
	public sound: egret.Sound;
	/**资源项 */
	public sourceItem: RES.ResourceItem;

	public loops: number;
	public isPlay: boolean;
	public position: number;
	public channel: egret.SoundChannel;
	public target: Object;
	public callback: Function;

	public isLoadRes = false;

	public isDestroy = false;

	public static create() {
		return new SoundItem();
	}
	public constructor() {
		super();
	}

	public BindCall(callback?: Function, target?: Object) {
		this.callback = callback;
		this.target = target;
	}

	public play(startTime?: number, loops?: number) {
		if(this.isDestroy){
			return ;
		}

		if(!this.isLoadRes){
			return ;
		}
		this.channel = this.sound.play(startTime, loops);
		this.sound.type = this.type;
		this.channel.once(egret.Event.SOUND_COMPLETE, this.onComplete, this);
		this.isPlay = true;
		this.loops = loops;
		startTime?this.position = startTime:this.position = 0;

		//设置音量
		if(this.type == egret.Sound.MUSIC){
			this.channel.volume = Sound.getBgValume();
		}else if(this.type == egret.Sound.EFFECT){
			this.channel.volume = Sound.getEffectVolume();
		}
	}

	public stop() {
		if (this.isPlay) {
			this.channel.stop();
			this.channel = null;
			this.isPlay = false;
		}
		this.loops = 1;
		this.callback = null;
		this.target = null;
	}

	public setValume(valume:number){
		if(this.isPlay){
			this.channel.volume = valume;
		}
	}

	private onComplete() {
		if(this.sound.type == egret.Sound.MUSIC){
			this.stop();
			this.play(0, 0);
		}
		if (this.callback && this.target) {
			this.callback.call(this.target);
		}
		this.stop();
	}

	//播放前要调用这个函数
	public startPlay(){
		this.isDestroy = false;
	}

	//停止播放
	public onDestroy(){
		this.stop();
		this.isDestroy = true;
	}

}