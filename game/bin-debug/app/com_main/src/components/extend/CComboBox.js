var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var com_main;
(function (com_main) {
    var SelectTagStyle = /** @class */ (function () {
        function SelectTagStyle() {
        }
        SelectTagStyle.style1 = "Style1";
        SelectTagStyle.style2 = "Style2";
        return SelectTagStyle;
    }());
    com_main.SelectTagStyle = SelectTagStyle;
    var SelectTagDirection = /** @class */ (function () {
        function SelectTagDirection() {
        }
        SelectTagDirection.up = "Up";
        SelectTagDirection.down = "Down";
        return SelectTagDirection;
    }());
    com_main.SelectTagDirection = SelectTagDirection;
    var CComboBox = /** @class */ (function (_super_1) {
        __extends(CComboBox, _super_1);
        function CComboBox(isAddSkin) {
            var _this = _super_1.call(this) || this;
            _this.m_pContentIsShow = false;
            _this.m_pTempIndex = 0;
            _this.m_pSkinName = "";
            _this.m_pMaxHeight = 305; //330;//415;  //280
            _this.topTextColor = 0xFFFFFF;
            if (isAddSkin) {
                _this.m_pIsNew = isAddSkin;
                // this.skinName = "resource/eui_skins/SelectTagSkin.exml";//Utils.getComExml("SelectTag", "SelectTagSkin.exml");
                _this.skinName = Utils.getComSkin("CComboBox.exml"); //"resource/skins/components/CComboBoxSkin.exml";
                //  this.skinName("resource/skins/components/CComboBoxSkin.exml");
            }
            _this.m_pDirection = SelectTagDirection.down;
            _this.m_pStyle = SelectTagStyle.style1;
            return _this;
        }
        CComboBox.prototype.createChildren = function () {
            _super_1.prototype.createChildren.call(this);
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTagClick, this);
        };
        CComboBox.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this); //lung17
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTagClick, this);
            this.m_pClickListener = null;
            this.m_pClickObj = null;
            this.m_pSelectListener = null;
            this.m_pSelectObj = null;
            if (this.list_SelecTags)
                this.list_SelecTags.dataProvider = null;
            this.list_SelecTags = null;
            this._item = null;
        };
        CComboBox.prototype.$onRemoveFromStage = function () {
            // debug('SelectTag onRemoveFromStage');
            this.onDestroy();
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        CComboBox.prototype.createCompleteEvent = function (event) {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            this.onCreate();
        };
        CComboBox.prototype.onCreate = function () {
            // debug('SelectTag onCreate');
            this.createItem();
            com_main.EventManager.addEventListener(this.list_SelecTags, eui.ItemTapEvent.ITEM_TAP, this, this.onTagChange);
            this.selectIndex = this.m_pTempIndex;
        };
        Object.defineProperty(CComboBox.prototype, "isShowContent", {
            get: function () {
                return this.m_pContentIsShow;
            },
            set: function (isShow) {
                this.m_pContentIsShow = isShow;
                this.group_Content.visible = this.m_pContentIsShow;
                var imgArrow = this.m_pContentIsShow ? "Cex_ComboDown_png" : "Cex_ComboUp_png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CComboBox.prototype, "selectIndex", {
            get: function () {
                if (this.list_SelecTags) {
                    return this.list_SelecTags.selectedIndex;
                }
                else {
                    return 0;
                }
            },
            set: function (index) {
                this.list_SelecTags.selectedIndex = index;
                this.m_pTempIndex = index;
                this.onTagChange(null);
            },
            enumerable: true,
            configurable: true
        });
        CComboBox.prototype.setSelectByIndex = function (index) {
            this.selectIndex = index;
        };
        CComboBox.prototype.getElementAt = function (index) {
            return this.list_SelecTags.getElementAt(index);
        };
        Object.defineProperty(CComboBox.prototype, "selectData", {
            get: function () {
                if (this.list_SelecTags) {
                    //debug("this.list_SelecTags.selectedItem",this.list_SelecTags.selectedItem);
                    return this.list_SelecTags.selectedItem;
                }
                //debug("return null");
                return null;
            },
            enumerable: true,
            configurable: true
        });
        CComboBox.prototype.onTagClick = function (e) {
            // debug("onTagClick");
            if (this.m_pClickObj) {
                this.m_pClickListener.call(this.m_pClickObj, this);
            }
            this.isShowContent = !this.m_pContentIsShow;
            e.stopImmediatePropagation();
        };
        Object.defineProperty(CComboBox.prototype, "dataSource", {
            set: function (datas) {
                this.refreshDataSource(datas);
                this.selectIndex = 0;
            },
            enumerable: true,
            configurable: true
        });
        CComboBox.prototype.refreshDataSource = function (datas) {
            this.currentState = this.getState();
            for (var i = 0; i < datas.length; i++) {
                var item = datas[i];
                if (!item.hasOwnProperty("value"))
                    item.value = i;
                if (!item.sort)
                    item.sort = 0;
                var img = null;
                if (item.sort == ArraySort.LOWER) //lung17 
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
        };
        //lung17------------
        CComboBox.prototype.copyDict = function (dict, isDeepCopy) {
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
                    newDict[i] = (typeof dict[i] == "object") ? this.copyDict(dict[i]) : dict[i]; //Utils.copyDict(dict[i]) : dict[i];
                }
                else {
                    newDict[i] = dict[i];
                }
            }
            return newDict;
        };
        //lung17------------
        CComboBox.prototype.onTagChange = function (event) {
            // debug("onTagChange -----   17");
            if (this.list_SelecTags.selectedItem && this._item) {
                // debug("this.list_SelecTags.selectedItem", this.list_SelecTags.selectedItem);
                var top_data = this.copyDict(this.list_SelecTags.selectedItem); //Utils.copyDict(this.list_SelecTags.selectedItem);
                top_data._textColor = this.topTextColor;
                this._item.data = top_data;
            }
            if (this.m_pSelectObj)
                this.m_pSelectListener.call(this.m_pSelectObj, this);
        };
        CComboBox.prototype.addSelectListener = function (obj, func) {
            this.m_pSelectObj = obj;
            this.m_pSelectListener = func;
        };
        CComboBox.prototype.addClickListener = function (obj, func) {
            this.m_pClickObj = obj;
            this.m_pClickListener = func;
        };
        Object.defineProperty(CComboBox.prototype, "itemRendererSkinName", {
            set: function (skinname) {
                this.m_pSkinName = skinname;
                this.removeChild(this._item);
                this.createItem();
            },
            enumerable: true,
            configurable: true
        });
        CComboBox.prototype.getState = function () {
            var state = this.m_pStyle + "_" + this.m_pDirection;
            return state;
        };
        Object.defineProperty(CComboBox.prototype, "style", {
            set: function (style) {
                this.m_pStyle = style;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CComboBox.prototype, "direction", {
            set: function (direction) {
                this.m_pDirection = direction;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CComboBox.prototype, "item", {
            get: function () {
                return this._item;
            },
            enumerable: true,
            configurable: true
        });
        CComboBox.prototype.createItem = function () {
            this._item = new com_main.ListItemRenderer(); //lung17
            this._item.skinName = this.getItemSkinExml(false);
            this._item.verticalCenter = 0;
            this._item.left = 15;
            //var rect = new eui.Rect(this._item.width,this._item.height,0x000000);
            //this._item.addChild(rect);
            //this._item.setChildIndex(rect,0);
            this.addChild(this._item);
        };
        CComboBox.prototype.getItemSkinExml = function (isLine) {
            if (isLine === void 0) { isLine = true; }
            var width = this.width - 48;
            var line = isLine ? "<e:Image source=\"FCommon_Split1_png\" width=\"100%\" horizontalCenter=\"0\" bottom=\"0\" visible=\"{data._isLine}\"/>" : "";
            var halign = isLine ? "center" : "left";
            var rect = "<e:Rect height=\"100%\" width=\"100%\" horizontalCenter=\"0\" verticalCenter=\"0\"/>";
            var exml = "<?xml version='1.0' encoding='utf-8'?>\n<e:Skin width=\"" + width + "\" height=\"52\" xmlns:e=\"http://ns.egret.com/eui\">\n\t<e:Group height=\"100%\" width=\"100%\" horizontalCenter=\"0\" verticalCenter=\"0\">\n\t\t<e:Label id=\"LblTitle\" text=\"{data.title}\" textColor=\"{data._textColor}\" size=\"26\"  stroke=\"2\" strokeColor=\"0x0d223c\"/>\n\t\t<e:Image source=\"{data._img}\"/>\n\t\t<e:layout>\n\t\t\t<e:HorizontalLayout verticalAlign=\"middle\" horizontalAlign=\"" + halign + "\"/>\n\t\t</e:layout>\n\t</e:Group>\n\t" + line + "\n</e:Skin>";
            return this.m_pSkinName == "" ? exml : this.m_pSkinName;
        };
        return CComboBox;
    }(com_main.CComponent));
    com_main.CComboBox = CComboBox;
})(com_main || (com_main = {}));
