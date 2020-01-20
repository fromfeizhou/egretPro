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
    /**
     *
     * @author
     *
     */
    var RichTextEvent = /** @class */ (function (_super_1) {
        __extends(RichTextEvent, _super_1);
        function RichTextEvent(type, bubbles, cancelable, text) {
            if (bubbles === void 0) { bubbles = false; }
            if (cancelable === void 0) { cancelable = false; }
            var _this = _super_1.call(this, type, bubbles, cancelable) || this;
            _this.text = "";
            _this.text = text;
            return _this;
        }
        RichTextEvent.Link = "link";
        return RichTextEvent;
    }(egret.Event));
    com_main.RichTextEvent = RichTextEvent;
    var IRichElement;
    (function (IRichElement) {
        IRichElement[IRichElement["text"] = 0] = "text";
        IRichElement[IRichElement["image"] = 1] = "image";
    })(IRichElement || (IRichElement = {}));
    ;
    var CCRichLabelTextParser = /** @class */ (function (_super_1) {
        __extends(CCRichLabelTextParser, _super_1);
        function CCRichLabelTextParser() {
            var _this = _super_1.call(this) || this;
            _this.m_pTexts = [];
            return _this;
        }
        CCRichLabelTextParser.prototype.addToResults = function (text, type, objectText) {
            if (objectText.style) {
                this.m_pTexts.push({ 'text': text, 'type': type, 'style': objectText.style });
            }
            else {
                this.m_pTexts.push({ 'text': text, 'type': type });
            }
        };
        CCRichLabelTextParser.prototype.parseImage = function (objectText) {
            var htmltext = objectText.text;
            var firstIdx = 0; //文本段开始位置
            var length = htmltext.length;
            while (firstIdx < length) {
                var starIdx = htmltext.indexOf("[img]", firstIdx);
                if (starIdx < 0) {
                    this.addToResults(htmltext.substring(firstIdx), IRichElement.text, objectText);
                    firstIdx = length;
                }
                else {
                    this.addToResults(htmltext.substring(firstIdx, starIdx), IRichElement.text, objectText);
                    var fontEnd = htmltext.indexOf("[/img]", starIdx);
                    if (fontEnd == -1) {
                        egret.$error(1038);
                        fontEnd = starIdx;
                    }
                    else {
                        this.addToResults(htmltext.substring(starIdx + 5, fontEnd), IRichElement.image, objectText);
                    }
                    firstIdx = fontEnd + 6;
                }
            }
        };
        CCRichLabelTextParser.prototype.parser = function (htmltext) {
            this.m_pTexts = [];
            var result = _super_1.prototype.parser.call(this, htmltext);
            for (var i = 0; i < result.length; i++) {
                this.parseImage(result[i]);
            }
            return this.m_pTexts;
        };
        CCRichLabelTextParser.prototype.dispose = function () {
            this.m_pTexts.length = 0;
        };
        return CCRichLabelTextParser;
    }(egret.HtmlTextParser));
    com_main.CCRichLabelTextParser = CCRichLabelTextParser;
    var CCRichLabel = /** @class */ (function (_super_1) {
        __extends(CCRichLabel, _super_1);
        function CCRichLabel(defaultWidth) {
            var _this = _super_1.call(this) || this;
            _this.m_pTextParser = new CCRichLabelTextParser();
            _this.m_pLineLabel = new eui.Label();
            _this.m_pLabels = [];
            _this.m_pLabelEvents = [];
            _this.m_pLine = 0;
            _this.m_pImages = {};
            _this.lineWidth = 300;
            _this.m_pWidth = 0;
            _this.lineSpacing = 0;
            _this.size = 0;
            _this.strokeColor = 0;
            _this.textWidth = 0;
            _this.textHeight = 0;
            _this.fontFamily = '';
            _this.isSubStr = false;
            _this.isSubEnd = false;
            _this.limitLines = 0;
            _this.imageScale = 2;
            if (defaultWidth) {
                _this.lineWidth = defaultWidth;
            }
            return _this;
        }
        Object.defineProperty(CCRichLabel.prototype, "lineNum", {
            get: function () {
                return this.numChildren;
            },
            enumerable: true,
            configurable: true
        });
        CCRichLabel.prototype.genSpaceStr = function (spaceWidth) {
            var spaceStr = '';
            var spaceWid = this.size / com_main.ChatUtils.fontSpaceSize;
            while (spaceWidth > 0) {
                spaceStr += ' ';
                spaceWidth -= this.size < 10 ? 4 : spaceWid; //空格的宽度
            }
            return [spaceStr, spaceWidth];
        };
        CCRichLabel.prototype.showElement = function (textArr) {
            var _this = this;
            var elements = [];
            var arrLen = textArr.length;
            for (var i = 0; i < arrLen; i++) {
                var el = textArr[i];
                if (el.text == '')
                    continue;
                if (el['type'] == IRichElement.image) {
                    var bitmap = new egret.Bitmap(RES.getRes(el.text));
                    if (el.style && el.style.href) {
                        bitmap.touchEnabled = true;
                        var evt = el.style.href.replace('event:', '');
                        com_main.EventManager.addTouchTapListener(bitmap, this, function () {
                            _this.dispatchEvent(new RichTextEvent(RichTextEvent.Link, true, false, evt));
                        });
                    }
                    else {
                        bitmap.touchEnabled = false;
                        bitmap.width = bitmap.width * this.imageScale;
                        bitmap.height = bitmap.height * this.imageScale;
                    }
                    var spaces = this.genSpaceStr(bitmap.width);
                    el['bitmap'] = bitmap;
                    el['offsetX'] = spaces[1];
                    el.text = spaces[0];
                    elements.push(el);
                }
                this.appendElement(el, arrLen - 1 == i);
                if (this.isSubStr && this.isSubEnd) {
                    return;
                }
            }
        };
        CCRichLabel.prototype.createLineLabel = function (element, newText) {
            var newEl = {};
            if (element.style) {
                newEl = { 'text': newText, 'style': element.style };
            }
            else {
                newEl = { 'text': newText };
            }
            if (!this.m_pLabels[this.m_pLine]) {
                this.m_pLabels[this.m_pLine] = [];
            }
            this.m_pLabels[this.m_pLine].push(newEl); //存放分行后的对象数据，一个下标对象就是一个数组，这个数组中存放本行的对象
        };
        CCRichLabel.prototype.createLineImage = function (element, line, offsetX) {
            if (!this.m_pImages[line]) {
                this.m_pImages[line] = { lineHeight: 0, list: [] };
            }
            element['x'] = offsetX;
            element['line'] = line;
            this.m_pImages[line]['list'].push(element);
            if (this.m_pImages[line]['lineHeight'] < element['bitmap']['height']) {
                this.m_pImages[line]['lineHeight'] = element['bitmap']['height'];
            }
        };
        CCRichLabel.prototype.appendElement = function (element, isEnd) {
            var startIndex = 0;
            var labelText = this.m_pLineLabel.text;
            var lineLabelWidth = this.m_pLineLabel.width;
            var bitmapWidth = element['bitmap'] ? element['bitmap']['width'] : 0;
            var text = element.text;
            var sub_text;
            var textArr = text.split('\n');
            var textArrlen = textArr.length;
            for (var idx = 0; idx < textArrlen; idx++) {
                text = textArr[idx];
                for (var i = 0; i <= text.length; i++) {
                    sub_text = text.substring(startIndex, i);
                    this.m_pLineLabel.text = labelText + sub_text;
                    var line_width = this.m_pLineLabel.textWidth;
                    if (this.isSubStr && this.limitLines > 0 && element['type'] == IRichElement.image) {
                        line_width += 10;
                    }
                    if (line_width >= (this.lineWidth - 10)) {
                        if (this.m_pLineLabel.width > this.lineWidth) {
                            sub_text = text.substring(startIndex, i - 1);
                            startIndex = i - 1;
                        }
                        else {
                            startIndex = i;
                        }
                        if (this.isSubStr) {
                            if (this.limitLines > 0) {
                                if (this.m_pLine == this.limitLines - 1) {
                                    sub_text = element['type'] == IRichElement.text ? sub_text + '...' : '...';
                                    this.isSubEnd = true;
                                }
                            }
                            else {
                                if (element['type'] == IRichElement.text) {
                                    sub_text += '...';
                                    this.isSubEnd = true;
                                }
                            }
                        }
                        this.createLineLabel(element, sub_text);
                        this.m_pLine += 1;
                        labelText = '';
                        this.m_pLineLabel.text = '';
                        if (element['type'] == IRichElement.image) {
                            if (this.m_pLineLabel.width - lineLabelWidth > bitmapWidth / 1.5) {
                                this.createLineImage(element, this.m_pLine - 1, lineLabelWidth + bitmapWidth);
                            }
                            else {
                                if (this.isSubStr) {
                                    return;
                                }
                                this.m_pLineLabel.text = element.text;
                                this.createLineImage(element, this.m_pLine, bitmapWidth);
                                this.createLineLabel(element, element.text);
                            }
                            return;
                        }
                    }
                }
                if (textArrlen > 1 && idx < textArrlen - 1) {
                    this.createLineLabel(element, sub_text);
                    this.m_pLine += 1;
                    labelText = '';
                    this.m_pLineLabel.text = '';
                }
            }
            if (element['type'] == IRichElement.image) {
                this.createLineImage(element, this.m_pLine, this.m_pLineLabel.width);
            }
            sub_text = text.substring(startIndex);
            if (sub_text) {
                this.createLineLabel(element, sub_text);
            }
        };
        CCRichLabel.prototype._textFlow = function (text) {
            this.m_pImages = [];
            //解析html文本字符串。
            var textArr = this.m_pTextParser.parser(text);
            this.showElement(textArr);
            this.displayLables();
            egret.callLater(function () {
                if (this.m_pTextParser) {
                    this.displayImages();
                }
            }, this);
        };
        CCRichLabel.prototype.linkClick = function (evt) {
            this.dispatchEvent(new RichTextEvent(RichTextEvent.Link, true, false, evt.text));
        };
        CCRichLabel.prototype.displayLables = function () {
            var offsetY = 0;
            var length = this.m_pLabels.length; //分行后的label。 lung17
            for (var line = 0; line < length; line++) {
                if (this.limitLines && line >= this.limitLines) {
                    break;
                }
                var imageHeight = this.m_pImages[line] ? this.m_pImages[line]['lineHeight'] : this.size;
                var label = this.createLabel();
                var lineLabels = this.m_pLabels[line]; //把一行中的N个label对象集合 lung17
                if (!lineLabels)
                    continue;
                for (var i = 0; i < lineLabels.length; i++) {
                    var element = lineLabels[i]; //把一行中的N个label 分别拆出来。 lung17
                    label.appendElement(element); //把N个label 对象整合 成一个label lung17
                    if (element.style && element.style.href) {
                        label.addEventListener(egret.TextEvent.LINK, this.linkClick, this);
                        this.m_pLabelEvents.push({ label: label, type: egret.TextEvent.LINK });
                    }
                }
                offsetY += imageHeight > this.size ? imageHeight : this.size;
                offsetY += Number(line) * this.lineSpacing;
                label.y = offsetY - label.height;
                this.addChild(label);
                if (this.textWidth < label.textWidth)
                    this.textWidth = label.textWidth;
            }
            this.textHeight = offsetY;
            this.m_pLabels = [];
        };
        CCRichLabel.prototype.displayImages = function () {
            var offsetY = 0;
            // sayError("this.m_pImages",this.m_pImages);
            for (var line in this.m_pImages) {
                if (this.limitLines && Number(line) >= this.limitLines) {
                    break;
                }
                var images = this.m_pImages[line]['list'];
                var imageHeight = this.m_pImages[line]['lineHeight'];
                offsetY += imageHeight > this.size ? imageHeight : this.size;
                offsetY += Number(line) * this.lineSpacing;
                for (var i = 0; i < images.length; i++) {
                    var image = images[i];
                    var x = image.x;
                    var y = offsetY;
                    if (!this.getChildByName(image.bitmap.hashCode)) {
                        this.addChild(image.bitmap);
                        image.bitmap.name = image.bitmap.hashCode;
                    }
                    image.bitmap.x = x - image.bitmap.width;
                    image.bitmap.y = y - image.bitmap.height;
                }
            }
            this.m_pImages = {};
        };
        CCRichLabel.prototype.createLabel = function () {
            var label = new eui.Label();
            label.textColor = this.textColor;
            label.size = this.size;
            label.bold = this.bold;
            label.stroke = this.stroke;
            label.strokeColor = this.strokeColor;
            label.fontFamily = this.fontFamily;
            return label;
        };
        CCRichLabel.prototype.setLineLabelStyle = function () {
            this.m_pLineLabel.size = this.size;
            this.m_pLineLabel.bold = this.bold;
            this.m_pLineLabel.stroke = this.stroke;
            this.m_pLineLabel.strokeColor = this.strokeColor;
            this.m_pLineLabel.fontFamily = this.fontFamily;
        };
        CCRichLabel.prototype.setStyle = function (lblStyle) {
            this.textColor = lblStyle.textColor;
            this.size = lblStyle.size;
            this.lineSpacing = lblStyle.lineSpacing;
            this.bold = lblStyle.bold;
            this.stroke = lblStyle.stroke;
            this.strokeColor = lblStyle.strokeColor;
            this.fontFamily = lblStyle.fontFamily;
        };
        CCRichLabel.prototype.setText = function (text, width) {
            this.setLineLabelStyle();
            this.textWidth = 0;
            this.textHeight = 0;
            this.isSubEnd = false;
            this.m_pLabels = [];
            this.removeLabelEvent();
            this.m_pLineLabel.text = "";
            this.removeChildren();
            this.m_pLine = 0;
            this.m_pImages = {};
            this._textFlow(text);
            this.width = width ? width : this.lineWidth;
        };
        CCRichLabel.prototype.removeLabelEvent = function () {
            var event, i;
            for (i = 0; i < this.m_pLabelEvents.length; i++) {
                event = this.m_pLabelEvents[i];
                event['label'].removeEventListener(event['type'], this.linkClick, this);
            }
            this.m_pLabelEvents.length = 0;
            com_main.EventManager.removeEventListeners(this);
        };
        CCRichLabel.prototype.dispose = function () {
            this.removeLabelEvent();
            this.m_pImages.length = 0;
            this.m_pLabels.length = 0;
            this.m_pTextParser.dispose();
            this.m_pTextParser = null;
        };
        return CCRichLabel;
    }(egret.DisplayObjectContainer));
    com_main.CCRichLabel = CCRichLabel;
    var CCRichText = /** @class */ (function (_super_1) {
        __extends(CCRichText, _super_1);
        function CCRichText(label) {
            var _this = _super_1.call(this) || this;
            _this.m_pIsCenter = false;
            _this.m_pX = 0;
            _this.m_pY = 0;
            _this.m_pOldText = "";
            _this.isInit = false;
            _this.horizontalCenter = label.horizontalCenter;
            _this.verticalCenter = label.verticalCenter;
            _this.top = label.top;
            _this.bottom = label.bottom;
            _this.left = label.left;
            _this.right = label.right;
            _this.label = new CCRichLabel(label.width);
            _this.isInit = true;
            _this.setStyle(label);
            _this.addChild(_this.label);
            label.visible = false;
            return _this;
        }
        CCRichText.prototype.$onRemoveFromStage = function () {
            if (this.label) {
                this.label.dispose();
                this.label = null;
            }
            this.m_pOldText = null;
            this.isInit = false;
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        CCRichText.prototype.setStyle = function (lblStyle) {
            this.m_pWidth = lblStyle.width;
            this.m_pHeight = lblStyle.height;
            this.m_pX = lblStyle.x;
            this.m_pY = lblStyle.y;
            this.label.setStyle(lblStyle);
            this.setPosition(lblStyle.x, lblStyle.y);
        };
        Object.defineProperty(CCRichText.prototype, "textAlign", {
            set: function (center) {
                this.m_pIsCenter = center;
                this.setPosition(this.m_pX, this.m_pY);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CCRichText.prototype, "subText", {
            set: function (text) {
                this.label.isSubStr = true;
                this.text = text;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CCRichText.prototype, "lineNum", {
            get: function () {
                return this.label.lineNum;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CCRichText.prototype, "lineSpacing", {
            get: function () {
                return this.label.lineSpacing;
            },
            set: function (value) {
                this.label.lineSpacing = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CCRichText.prototype, "text", {
            set: function (text) {
                text = Utils.parseLanRich(text); //解析带有颜色标签的text
                text = Utils.parseClickRich(text); //解析带有事件点击标签的text
                text = this.parseImgClickRich(text); //解析带有事件点击标签的img
                text = Utils.parseLan(text); //解析语言包内容
                // text = StringUtils.searchDwordsAndReplace(text);
                if (this.m_pOldText != text) {
                    this.label.setText(text);
                    this.width = this.label.textWidth;
                    this.height = this.label.textHeight;
                    this.setPosition(this.m_pX, this.m_pY);
                    this.m_pOldText = text;
                }
            },
            enumerable: true,
            configurable: true
        });
        CCRichText.prototype.setText = function (text, width) {
            this.label.lineWidth = width;
            this.text = text;
        };
        CCRichText.prototype.setLabelLineWidth = function (width) {
            this.label.lineWidth = width;
        };
        Object.defineProperty(CCRichText.prototype, "imageScale", {
            set: function (scale) {
                this.label.imageScale = scale;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CCRichText.prototype, "textWidth", {
            get: function () {
                return this.label.textWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CCRichText.prototype, "textHeight", {
            get: function () {
                return this.label.textHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CCRichText.prototype, "textColor", {
            set: function (color) {
                this.label.textColor = color;
            },
            enumerable: true,
            configurable: true
        });
        CCRichText.prototype.setWidth = function (width) {
            this.m_pWidth = width;
        };
        CCRichText.prototype.setPosition = function (x, y) {
            if (this.m_pIsCenter) {
                var centerX = x + this.m_pWidth / 2;
                var centerY = y + this.m_pHeight / 2;
                this.x = centerX - this.label.textWidth / 2;
                this.y = centerY - this.label.height / 2;
            }
            else {
                this.x = x;
                this.y = y;
            }
        };
        //限制文字行数 超过不显示 可能导致subText有问题
        CCRichText.prototype.limitHeight = function (numLine) {
            this.label.limitLines = numLine;
        };
        //lung17
        /**
         * 解析语言包的富文本
         */
        CCRichText.prototype.parseLanRich = function (str) {
            var patt1 = new RegExp("(.*)<color=(.*?)>(.*?)<\/color>(.*)");
            var dstText = "";
            var result = null;
            do {
                result = patt1.exec(str);
                if (result) {
                    var color = RegExp.$2;
                    if (color.indexOf("#") == -1) {
                        color = "#" + color.substr(0, 6);
                    }
                    else {
                        color = color.substr(0, 7);
                    }
                    var newStr = RegExp.$1 + "<font color='" + color + "'>" + RegExp.$3 + "</font>" + RegExp.$4;
                    str = newStr;
                }
            } while (result != null);
            return str;
        };
        /**
         * 解析语言包的富文本
         */
        CCRichText.prototype.parseImgClickRich = function (str) {
            var patt1 = new RegExp("(.*)<imgLink=(.*?)>(.*?)<\/imgLink>(.*)");
            var dstText = "";
            var result = null;
            do {
                result = patt1.exec(str);
                if (result) {
                    var event = RegExp.$2;
                    var newStr = RegExp.$1 + "<a href='event:" + event + "'>[img]" + RegExp.$3 + "[/img]</a>" + RegExp.$4;
                    str = newStr;
                }
            } while (result != null);
            return str;
        };
        /**
         * 解析语言包的富文本
         */
        CCRichText.prototype.parseClickRich = function (str) {
            var patt1 = new RegExp("(.*)<clk=(.*?)>(.*?)<\/clk>(.*)");
            var dstText = "";
            var result = null;
            do {
                result = patt1.exec(str);
                if (result) {
                    var event = RegExp.$2;
                    var newStr = RegExp.$1 + "<u><a href='event:" + event + "'>" + RegExp.$3 + "</a></u>" + RegExp.$4;
                    str = newStr;
                }
            } while (result != null);
            return str;
        };
        return CCRichText;
    }(com_main.CComponent));
    com_main.CCRichText = CCRichText;
})(com_main || (com_main = {}));
