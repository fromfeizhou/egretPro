module com_main {
	export	class SelectTagStyle {
		public static style1: string = "Style1";
		public static style2: string = "Style2";
	}

	export class SelectTagDirection {
		public static up: string = "Up";
		public static down: string = "Down";
	}

	export class CComboBox extends CComponent {
		public constructor(isAddSkin?: boolean) {
			super();
            if (isAddSkin) {
				this.m_pIsNew = isAddSkin;
                // this.skinName = "resource/eui_skins/SelectTagSkin.exml";//Utils.getComExml("SelectTag", "SelectTagSkin.exml");
				 this.skinName = Utils.getComSkin("CComboBox.exml");//"resource/skins/components/CComboBoxSkin.exml";
				//  this.skinName("resource/skins/components/CComboBoxSkin.exml");
            }

			this.m_pDirection = SelectTagDirection.down;
			this.m_pStyle = SelectTagStyle.style1;
		}

        protected createChildren(): void {
            super.createChildren();
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTagClick, this);
        }

		private group_Content: eui.Group;
		private list_SelecTags: eui.List;
		private img_Arrow: eui.Image;
		private _item: eui.ItemRenderer;

        private m_pClickListener: Function;
        private m_pClickObj: any;
		private m_pSelectListener: Function;
		private m_pSelectObj: any;

		private m_pIsNew;

		private m_pContentIsShow: boolean = false;

		private m_pTempIndex: number = 0;
		private m_pSkinName: string = "";

		private m_pMaxHeight: number = 305;//330;//415;  //280
		private m_pStyle: string;
		private m_pDirection: string;

		public topTextColor = 0xFFFFFF;

        public onDestroy(): void {
            EventManager.removeEventListeners(this);//lung17
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTagClick, this);
            this.m_pClickListener = null;
            this.m_pClickObj = null;
			this.m_pSelectListener = null;
			this.m_pSelectObj = null;
			if (this.list_SelecTags) this.list_SelecTags.dataProvider = null;
			this.list_SelecTags = null;
			this._item = null;
        }

        $onRemoveFromStage(): void {
            // debug('SelectTag onRemoveFromStage');
            this.onDestroy();
			EventManager.removeEventListeners(this);
			super.$onRemoveFromStage();
        }

		private createCompleteEvent(event: egret.Event): void {
			this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
			this.onCreate();
		}

		private onCreate(): void {
            // debug('SelectTag onCreate');
			this.createItem();
			EventManager.addEventListener(this.list_SelecTags, eui.ItemTapEvent.ITEM_TAP, this, this.onTagChange);

			this.selectIndex = this.m_pTempIndex;
		}

		public set isShowContent(isShow: boolean) {
			this.m_pContentIsShow = isShow;
			this.group_Content.visible = this.m_pContentIsShow;
			var imgArrow = this.m_pContentIsShow ? 　"Cex_ComboDown_png" : "Cex_ComboUp_png";
		}

        public get isShowContent(): boolean {
            return this.m_pContentIsShow;
        }

		public set selectIndex(index: number) {
			this.list_SelecTags.selectedIndex = index;
			this.m_pTempIndex = index;
			this.onTagChange(null);
		}

		public setSelectByIndex(index: number) {
			this.selectIndex = index;
		}

		public getElementAt(index) {
			return this.list_SelecTags.getElementAt(index);
		}

		public get selectIndex(): number {
			if (this.list_SelecTags) {
				return this.list_SelecTags.selectedIndex;
			} else {
				return 0;
			}
		}

		public get selectData() {
            if (this.list_SelecTags) {
				//debug("this.list_SelecTags.selectedItem",this.list_SelecTags.selectedItem);
				return this.list_SelecTags.selectedItem;
			}
			//debug("return null");
			return null;
		}

		private onTagClick(e: egret.TouchEvent) {
			// debug("onTagClick");
			if (this.m_pClickObj) {
				this.m_pClickListener.call(this.m_pClickObj, this);
			}

			this.isShowContent = !this.m_pContentIsShow;
			e.stopImmediatePropagation();
		}


		public set dataSource(datas: Array<any>) {
			this.refreshDataSource(datas);
			this.selectIndex = 0;
		}

		public refreshDataSource(datas) {
			this.currentState = this.getState();
			for (var i = 0; i < datas.length; i++) {
				var item = datas[i];
                if (!item.hasOwnProperty("value"))
                    item.value = i;
				if (!item.sort)
					item.sort = 0;
				var img = null;
				if (item.sort == ArraySort.LOWER)//lung17 
					img = "FCommon_ArrowDown_png";
				if (item.sort == ArraySort.UPPER)
					img = "FCommon_ArrowUp_png";
				item._img = img;
				item._isLine = true;
				item._textColor = item._textColor ? item._textColor : 0xFFFFFF;
				if (i == datas.length - 1)
					item._isLine = false;
			}

			var group_height = 75 + 52 * datas.length;
			group_height = Math.min(group_height, this.m_pMaxHeight);
			this.group_Content.height = group_height;
			this.list_SelecTags.itemRendererSkinName = this.getItemSkinExml();
			this.list_SelecTags.dataProvider = new eui.ArrayCollection(datas);
		}

		//lung17------------
        public  copyDict(dict, isDeepCopy?) {
            if (!dict) {
                return dict;
            }
            var newDict = (dict instanceof Array) ? [] : {};
            for (var i in dict) {
                if (typeof dict[i] == "function") {
                    continue;
                }
                // newDict[i] = dict[i];
                if (isDeepCopy) {
                    newDict[i] = (typeof dict[i] == "object") ? this.copyDict(dict[i]) : dict[i];//Utils.copyDict(dict[i]) : dict[i];
                } else {
                    newDict[i] = dict[i];
                }
            }
            return newDict;
        }
		//lung17------------

		private onTagChange(event: eui.PropertyEvent): void {
			// debug("onTagChange -----   17");
            if (this.list_SelecTags.selectedItem && this._item) {
				// debug("this.list_SelecTags.selectedItem", this.list_SelecTags.selectedItem);
				var top_data = this.copyDict(this.list_SelecTags.selectedItem);//Utils.copyDict(this.list_SelecTags.selectedItem);
				top_data._textColor = this.topTextColor;
				this._item.data = top_data;
			}

			if (this.m_pSelectObj)
				this.m_pSelectListener.call(this.m_pSelectObj, this);
		}

        public addSelectListener(obj: any, func: Function) {
            this.m_pSelectObj = obj;
            this.m_pSelectListener = func;
        }

		public addClickListener(obj: any, func: Function) {
			this.m_pClickObj = obj;
			this.m_pClickListener = func;
		}

		public set itemRendererSkinName(skinname) {
			this.m_pSkinName = skinname;
			this.removeChild(this._item);
			this.createItem();
		}

		private getState() {
			var state = this.m_pStyle + "_" + this.m_pDirection;
			return state;
		}

		public set style(style) {
			this.m_pStyle = style;
		}

		public set direction(direction) {
			this.m_pDirection = direction;
		}

		public get item(): eui.ItemRenderer {
			return this._item;
		}

		private createItem() {
			this._item = new ListItemRenderer(); //lung17
			this._item.skinName = this.getItemSkinExml(false);
			this._item.verticalCenter = 0;
			this._item.left = 15;
			//var rect = new eui.Rect(this._item.width,this._item.height,0x000000);
			//this._item.addChild(rect);
			//this._item.setChildIndex(rect,0);

			this.addChild(this._item);
		}

		private getItemSkinExml(isLine: boolean = true) {
			var width = this.width - 48;
			var line = isLine ? `<e:Image source="FCommon_Split1_png" width="100%" horizontalCenter="0" bottom="0" visible="{data._isLine}"/>` : "";
			var halign = isLine ? "center" : "left";
			var rect = `<e:Rect height="100%" width="100%" horizontalCenter="0" verticalCenter="0"/>`;
			var exml = `<?xml version='1.0' encoding='utf-8'?>
<e:Skin width="${width}" height="52" xmlns:e="http://ns.egret.com/eui">
	<e:Group height="100%" width="100%" horizontalCenter="0" verticalCenter="0">
		<e:Label id="LblTitle" text="{data.title}" textColor="{data._textColor}" size="26"  stroke="2" strokeColor="0x0d223c"/>
		<e:Image source="{data._img}"/>
		<e:layout>
			<e:HorizontalLayout verticalAlign="middle" horizontalAlign="${halign}"/>
		</e:layout>
	</e:Group>
	${line}
</e:Skin>`;
			return this.m_pSkinName == "" ? exml : this.m_pSkinName;
		}
	}
}


