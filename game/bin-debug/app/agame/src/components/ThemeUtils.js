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
var AGame;
(function (AGame) {
    var CCSkinCache = /** @class */ (function () {
        function CCSkinCache() {
        }
        CCSkinCache.addSkin = function (skinName, skinContent, isPreLoad) {
            this.m_pSkinMap[skinName] = {};
            this.m_pSkinMap[skinName]['exml'] = skinContent;
            if (isPreLoad) {
                this.getSkinFunc(skinName);
            }
        };
        CCSkinCache.getTheme = function (skinName) {
            var skin;
            if (typeof (skinName) == 'function') {
                return skinName;
            }
            else if (skinName.indexOf("<?xml version='1.0' encoding='utf-8'?>") > -1) {
                return EXML.$parseURLContent("", skinName);
            }
            else if (skinName.indexOf('/') > -1) {
                var splits = skinName.split('/');
                skin = splits[splits.length - 1].replace('.exml', '');
            }
            else {
                skin = skinName.replace('.exml', '');
            }
            return this.getSkinFunc(skin);
        };
        CCSkinCache.getDependenceSkins = function (xml, depth) {
            if (this.disableDependence)
                return;
            var isContainer = function (name) {
                return name == "Group"
                    || name == "ViewStack"
                    || name == "Panel"
                    || name == "Scroller";
            };
            var i = 0;
            var children = xml.children;
            var needParseChildren = [];
            for (; i < children.length; i++) {
                // 容器类和dfh3
                if (children[i].prefix == "dfh3" || isContainer(children[i].localName)) {
                    needParseChildren.push(children[i]);
                    continue;
                }
            }
            // 递归终止条件
            if (needParseChildren.length <= 0 || depth > 5) {
                if (depth > 5) {
                    console.log("getDependenceSkins 递归层数太高，请检查皮肤参数");
                }
                return;
            }
            i = 0;
            for (; i < needParseChildren.length; i++) {
                var c = needParseChildren[i];
                // egret容器
                if (isContainer(c.localName)) {
                    // 找children
                    for (var j = 0; j < c.children.length; j++) {
                        this.getDependenceSkins(c.children[j], depth + 1);
                    }
                }
                // dfh3 这个是我们最终要找的
                if (c.prefix == "dfh3") {
                    // skin name
                    var skinName = c.attributes["skinName"];
                    if (skinName) {
                        console.log("~!@#getDependenceSkins name=" + skinName + " depth=" + (depth + 1));
                        this.getSkinFunc(skinName, depth + 1);
                    }
                }
            }
        };
        CCSkinCache.getSkinFunc = function (skinName, depth) {
            if (depth === void 0) { depth = 0; }
            // debug('getSkinFunc:',skinName);
            var exml = this.m_pSkinMap[skinName]['exml'];
            if (exml) {
                if (!this.disableDependence) {
                    var xml = egret.XML.parse(exml);
                    this.getDependenceSkins(xml, depth);
                }
                this.m_pSkinMap[skinName]['func'] = EXML.$parseURLContent("", exml);
                delete this.m_pSkinMap[skinName]['exml'];
            }
            return this.m_pSkinMap[skinName]['func'];
        };
        CCSkinCache.destroy = function () {
            this.m_pSkinBytes = null;
            this.m_pSkinMap = null;
            this.m_pPosition = 0;
        };
        CCSkinCache.m_pSkinBytes = new egret.ByteArray();
        CCSkinCache.m_pSkinMap = {};
        CCSkinCache.m_pPosition = 0;
        // 获取 自定义皮肤
        CCSkinCache.disableDependence = true;
        return CCSkinCache;
    }());
    var CCTheme = /** @class */ (function (_super_1) {
        __extends(CCTheme, _super_1);
        function CCTheme(configURL, stage, onThemeLoadComplete, target, isDelayed) {
            var _this = this;
            if (!isDelayed) {
                _this = _super_1.call(this, configURL, stage) || this;
            }
            else {
                _this = _super_1.call(this, '', stage) || this;
                _this.$url = configURL;
                _this.loadTheme(configURL, stage);
            }
            _this.$onThemeLoadComplete = onThemeLoadComplete;
            _this.$target = target;
            _this.addEventListener(eui.UIEvent.COMPLETE, _this.onThemeLoadComplete, _this);
            return _this;
        }
        CCTheme.prototype.onThemeLoadComplete = function () {
            if (this.$target && this.$onThemeLoadComplete) {
                this.$onThemeLoadComplete.call(this.$target);
            }
            this.removeEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
        };
        CCTheme.prototype.loadTheme = function (url, stage) {
            var adapter = stage ? stage.getImplementation("eui.IThemeAdapter") : null;
            if (!adapter) {
                adapter = new eui.DefaultThemeAdapter();
            }
            adapter.getTheme(url, this.onThemeLoaded, this.onThemeLoaded, this);
        };
        CCTheme.prototype.onThemeLoaded = function (str) {
            var _this = this;
            if (str) {
                if (DEBUG) {
                    try {
                        var data = JSON.parse(str);
                    }
                    catch (e) {
                        egret.$error(3000);
                    }
                }
                else {
                    var data = JSON.parse(str);
                }
            }
            else if (DEBUG) {
                egret.$error(3000, this.$url);
            }
            var isContent = data.exmls[0]['content'] ? true : false;
            data.exmls.forEach(function (exml, index, exmls) { return _this.parseURLContent(exml, isContent, data.skins, exmls); });
            this.dispatchEventWith(egret.Event.COMPLETE);
        };
        CCTheme.prototype.parseURLContent = function (exml, isContent, preLoadList, exmls) {
            var path;
            var content;
            if (isContent) {
                path = exml['path'];
                content = exml['content'];
            }
            else {
                path = exml;
                content = exml;
            }
            var splits = path.split('/');
            var skinName = splits[splits.length - 1].replace('.exml', '');
            CCSkinCache.addSkin(skinName, content, preLoadList[skinName] /*path.indexOf('/components/') > 0 ? SkinCacheType.Cache : SkinCacheType.Byte*/);
        };
        return CCTheme;
    }(eui.Theme));
    var ThemeUtils = /** @class */ (function () {
        function ThemeUtils() {
        }
        ThemeUtils.load = function (configURL, stage, onThemeLoadComplete, target, isDelayed) {
            new CCTheme(configURL, stage, onThemeLoadComplete, target, isDelayed);
        };
        ThemeUtils.getTheme = function (skinName) {
            return CCSkinCache.getTheme(skinName);
        };
        ThemeUtils.setSkinFunc = function (comp, value) {
            // if (!DEBUG) value = CCSkinCache.getTheme(value);
            var values = comp.$Component;
            values[5 /* skinNameExplicitlySet */] = true;
            if (values[1 /* skinName */] == value)
                return;
            if (value) {
                values[1 /* skinName */] = value;
            }
            else if (comp.$stage) {
                var theme = comp.$stage.getImplementation("eui.Theme");
                if (theme) {
                    var skinName = theme.getSkinName(comp);
                    if (skinName) {
                        //debug("theme.setSkinFunc " + skinName);
                        values[1 /* skinName */] = skinName;
                    }
                }
            }
            comp.$parseSkinName();
        };
        return ThemeUtils;
    }());
    AGame.ThemeUtils = ThemeUtils;
})(AGame || (AGame = {}));
