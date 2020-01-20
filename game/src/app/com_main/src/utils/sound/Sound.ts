
class Sound {

	private static currMusic: string;
	// private static soundLoad = new RES.SoundAnalyzer();
	private static soundDatas: SoundItem[] = [];
	private static lastClickTime: number = 0;

	public static effectVolume:number = 1;
	public static bgValume:number = 1;

	/**新手对话音频 */
	private static m_lastGuideDialogId = 0;

	public static init() {
		let soundDatas = RES.getGroupByName("sound");
		for (let i = 0; i < soundDatas.length; i++) {
			let soundItem = SoundItem.create();
			let sourceItem = soundDatas[i];
			let url = sourceItem.url;
			if (url.indexOf("/sound/music/") != -1) {
				soundItem.type = egret.Sound.MUSIC;
			} else if (url.indexOf("/sound/effect/") != -1) {
				soundItem.type = egret.Sound.EFFECT;
			} else if (url.indexOf("/sound/dialog/") != -1) {
				soundItem.type = egret.Sound.EFFECT;
			} else if(url.indexOf("/sound/GuideDialog/") != -1){
				soundItem.type = egret.Sound.EFFECT;
			}
			soundItem.sourceItem = sourceItem;
			this.soundDatas[sourceItem.name] = soundItem;
		}
		// RES.destroyRes("sound");
	}

	private static getItem(soundName: string): SoundItem {
		let soundItem = this.soundDatas[soundName];
		return soundItem;
	}

	/**根据ID立即播放 */
	public static playID(id: number, play: boolean = true, startTime?: number, loops?: number, callBack?: Function, target?: Object) {
		let filename = SoundData.getSoundName(id);
		this.playName(filename, play);
	}

	/**根据ID单个播放 */
	public static playID1(id: number) {
		let filename = SoundData.getSoundName(id);
		if (this.isPlay(filename)) return;
		this.playName(filename);
	}

	/**根据名字立即播放 */
	public static playName(soundName: string, play: boolean = true, startTime?: number, loops?: number, callBack?: Function, target?: Object) {
		let soundItem = this.getItem(soundName);
		if (!soundItem) {
			debug("unfind " + soundName);
			return;
		}
		soundItem.startPlay();
		this.loadSound(soundName, play, startTime, loops, callBack, target);
	}

	public static loadSound(soundName: string, play: boolean = false, startTime?: number, loops?: number, callBack?: Function, target?: Object) {
		let soundItem = this.getItem(soundName);
		if (soundItem.type === egret.Sound.EFFECT && !GameConfig.EffectIsPlay) {
				// debug("系统已经设置关闭声音");
			return;
		}

		if(soundItem.type === egret.Sound.MUSIC && !GameConfig.MusicIsPlay){
			this.currMusic = soundName;
			return;
		}

		if(soundItem.sound && play){
			this.play(soundName, startTime, loops);
		}else{
			var sound:egret.Sound = new egret.Sound();
			soundItem.sound = sound;
			sound.addEventListener(egret.Event.COMPLETE, function loadOver(event:egret.Event) {
				soundItem.isLoadRes = true;
				if (play) {
					Sound.play(soundName, startTime, loops,callBack,target);
				}
			},this);
			sound.addEventListener(egret.IOErrorEvent.IO_ERROR, function loadError(event:egret.IOErrorEvent) {
				console.log("loaded error!",event);
			}, this);
			sound.load( GameConfig.getResRemoteUrl() + this.soundDatas[soundName].sourceItem.url);
		}

		// var sound:egret.Sound = new egret.Sound();
		// // if(soundItem.type === egret.Sound.MUSIC)
		// // {
		// // 	this.playBg("resource/"+this.soundDatas[soundName].sourceItem.url);
		// // }else{
		// 	sound.addEventListener(egret.Event.COMPLETE, function loadOver(event:egret.Event) {
		// 		soundItem.sound = sound;
		// 		if (play) {
		// 			this.play(soundName, startTime, loops);
		// 		}
		// 		if (callBack) {
		// 			if (target) {
		// 				callBack.call(target);
		// 			} else {
		// 				callBack();
		// 			}
		// 		}
		// 	},this);
		// 	sound.addEventListener(egret.IOErrorEvent.IO_ERROR, function loadError(event:egret.IOErrorEvent) {
		// 		console.log("loaded error!");
		// 	}, this);
		// 	sound.load("resource/"+this.soundDatas[soundName].sourceItem.url);
		// // }
	}


	// //bg-----------------------------------------
	// private static soundChannel: egret.SoundChannel;
	// private static _bgValume = 1;
    // private static playBg(path) {
    //     //创建 URLLoader 对象
    //     var loader: egret.URLLoader = new egret.URLLoader();
    //     //设置加载方式为声音
    //     loader.dataFormat = egret.URLLoaderDataFormat.SOUND;
    //     //添加加载完成侦听
    //     loader.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
    //     //音频资源放在resource文件夹下
    //     // var url: string = this.path + type + ".mp3";
    //     var request: egret.URLRequest = new egret.URLRequest(path);
    //     //开始加载
    //     loader.load(request);
    // }

	// private static onLoadComplete(event: egret.Event): void {
    //     var loader: egret.URLLoader = <egret.URLLoader>event.target;
    //     //获取加载到的 Sound 对象
    //     var sound: egret.Sound = <egret.Sound>loader.data;
    //     var channel: egret.SoundChannel = this.soundChannel;
    //     if (channel) {                     
    //         channel.stop();
    //         this.soundChannel = null;
    //     }
    //     //使用SoundChannel播放音频
    //     channel = sound.play(0, 0);
    //     channel.volume = this._bgValume;
    //     this.soundChannel = channel;
    // }

	// private static setBgValume(volume: number) {
    //     this._bgValume = volume;
    //     if(this.soundChannel){
    //         this.soundChannel.volume = this._bgValume;
    //     }
    // }

	private static play(soundName: string = this.currMusic, startTime?: number, loops?: number, callback?: Function, target?: Object) {
		// debug("Sound:play--->>", soundName);
		// if (!this.isLoad(soundName)) return;

		if (soundName == "dianji_mp3") {
			let nowTime = egret.getTimer();
			if (nowTime - this.lastClickTime < 100) {
				return;
			}
			this.lastClickTime = nowTime;
		}

		let soundItem = this.getItem(soundName);
		if (!soundItem || !soundItem.sound) return;

		if (soundItem.type === egret.Sound.MUSIC) {
			Sound.stop(this.currMusic);
			this.currMusic = soundName;
		}

		if (soundItem.type === egret.Sound.EFFECT && !GameConfig.EffectIsPlay
			|| soundItem.type === egret.Sound.MUSIC && !GameConfig.MusicIsPlay) {
			return;
		}

		//默认设置一次
		if (soundItem.type === egret.Sound.EFFECT) {
			if (loops == undefined) {
				loops = 1;
			} else {
				loops = loops;
			}
		}else if(soundItem.type === egret.Sound.MUSIC){
			if (loops == undefined) {
				loops = 0;
			}
		}

		if (soundItem.isPlay) soundItem.stop();
		soundItem.BindCall(callback, target);
		soundItem.play(startTime, loops);
	}

	public static isPlay(soundName: string = this.currMusic) {
		if(!this.getItem(soundName)) error("soundName = ",soundName)
		//error("soundName = ",this.getItem(soundName))
		return this.getItem(soundName).isPlay;
	}

	public static stop(soundName: string = this.currMusic) {
		debug("Sound:stop--->>", soundName);
		let soundItem = this.getItem(soundName);
		if (soundItem) {
			soundItem.stop();
		}
	}

	public static stopAndDestoryById(id: number) {
		let filename = SoundData.getSoundName(id);
		let soundItem = this.getItem(filename);
		if (soundItem) {
			soundItem.onDestroy();
		}
	}

	public static stopAllEffect() {
		debug("stop all effect");
		for (let i in this.soundDatas) {
			let soundItem = this.soundDatas[i];
			if (soundItem.sound && soundItem.type === egret.Sound.EFFECT) {
				// let soundName = soundItem.sourceItem.name.slice(0, -4);
				Sound.stop(soundItem.sourceItem.name);
			}
		}
	}

	public static pauseBgMusic(soundName: string = this.currMusic) {
		let soundItem = this.getItem(soundName);
		if (!soundItem || !soundItem.isPlay) {
			return;
		}
		soundItem.position = soundItem.channel.position;
		Sound.stop(soundName);
	}

	public static resumeBgMusic(soundName: string = this.currMusic) {
		let soundItem = this.getItem(soundName);

		if (!soundItem) return;

		let loops = soundItem.loops, position = soundItem.position;

		this.playName(soundName,true,position,loops);
		// this.play(soundName, position, loops);
	}

	public static position(soundName: string) {
		let soundItem = this.getItem(soundName);
		return soundItem.channel.position;
	}

	/**
     * 设置音效音量大小  范围0 - 1
     */
	public static setEffectVolume(num: number = 1) {
		this.effectVolume = num;
	}

	public static getEffectVolume() {
		return this.effectVolume;
	}

	/**
     * 设置背景音量大小  范围0 - 1
     */
	public static setbgValume(num: number = 1){
		this.bgValume = num;

		let soundItem = this.getItem(this.currMusic);
		if(soundItem){
			soundItem.setValume(num)
		}
	}

	public static getBgValume(){
		return this.bgValume;
	}

	public static removeSound(soundName: string) {
		let soundItem = this.getItem(soundName);
		soundItem.sound.close();
		Sound.stop(soundName);
		// this.soundLoad.destroyRes(soundName);
	}

    //////////////////////////////////////////////////////////////////////

    /**点击声音 */
    public static playTap() {
        this.playName(SoundData.getTapSound());
    }

    public static playSceneBG(scene: SceneEnums) {
        switch (scene) {
            case SceneEnums.NONE_MAP: {
                break;
            }
			case SceneEnums.AUTO_BATTLE_MAP: {
				Sound.playName(SoundData.getMainSound());
                break;
            }
            case SceneEnums.MAIN_CITY: {
                Sound.playName(SoundData.getMainSound());
                break;
            }
            case SceneEnums.WORLD_CITY: {
                Sound.playName(SoundData.getWorldSound());
                break;
            }
            case SceneEnums.BATTLE_MAP: {
                Sound.playName(SoundData.getBattleSound());
                break;
            }
            case SceneEnums.NOVICE_MAP: {//新手地图
                Sound.playName(SoundData.getWorldSound());
                break;
            }
            case SceneEnums.TEST_MAP: {//测试地图
                break;
            }
            case SceneEnums.ALL: {
                break;
            }
        }
    }
	/**战斗开始 */
    public static playStartFight() {
        this.playName(SoundData.getFightStart());
    }
	/**建筑建造 */
    public static playBuildCreate() {
		let sound = SoundData.getSoundName(111);
        this.playName( sound != "" ? sound : "jianzhujianzao_mp3");
    }
	/**建筑竣工 */
    public static playBuildFinish() {
		let sound = SoundData.getSoundName(230);
        this.playName( sound != "" ? sound : "jungong_mp3");
    }
	/**武将音效 */
    public static playGeneralSoundByID(id) {
		let sound = SoundData.getSoundName(id);
        this.playName( sound != "" ? sound : "jungong_mp3");
    }
	/**暂停武将音效 */
    public static stopGeneralSoundByID(id) {
		let sound = SoundData.getSoundName(id);
        this.stop( sound != "" ? sound : "jungong_mp3");
    }

    public static playSoldierStatus(mainType: SoldierMainType, status: CSquare_Status) {
        if (status == CSquare_Status.STATUS_ATTACK) { //战斗音效
            switch (mainType) {
                case SoldierMainType.FOOTSOLDIER: //步兵
					Sound.playID1(210);//刀剑攻击
                    break;
                case SoldierMainType.RIDESOLDIER: //骑兵
					Sound.playID1(210);
                    break;
                case SoldierMainType.ARROWSOLDIER://弓箭
					Sound.playID1(208);//弓箭释放
                    break;
				case SoldierMainType.PIKEMAN: //枪兵
					Sound.playID1(209);//长矛攻击
                    break;
                default:
                    break;
            }
        }
    }

	public static playSoldierRun(mainType: SoldierMainType) {
		switch (mainType) {
			case SoldierMainType.FOOTSOLDIER: //步兵
				Sound.playID1(205);//刀剑攻击
				break;
			case SoldierMainType.RIDESOLDIER: //骑兵
				Sound.playID1(204);
				break;
			case SoldierMainType.ARROWSOLDIER://弓箭
				Sound.playID1(205);//弓箭释放
				break;
			case SoldierMainType.PIKEMAN: //枪兵
				Sound.playID1(205);//长矛攻击
				break;
			case SoldierMainType.HITWALLSOLDIER: //投石车
				Sound.playID1(206);//长矛攻击
				break;
			default:
				break;
		}
    }

	
	/**新手对话音频 */
	public static playGialogById(id: number,callBack: Function, obj: any){
		if(this.m_lastGuideDialogId){
			this.stopAndDestoryById(this.m_lastGuideDialogId);
		}
		
		// Sound.playID1(id);
		let filename = SoundData.getSoundName(id);
		if(!this.getItem(filename)) return;
		if (this.isPlay(filename)) return;
		Sound.playName(filename,true, 0,1,callBack,obj)
		this.m_lastGuideDialogId = id;
	}
}