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
    var Node = /** @class */ (function (_super_1) {
        __extends(Node, _super_1);
        function Node(c, isend) {
            if (isend === void 0) { isend = false; }
            var _this = _super_1.call(this) || this;
            _this.m_bIsEnd = false; //是否敏感字最后一一个
            _this.nodes = []; //以敏感字为树头的所有节点
            _this.m_sIndex = c;
            _this.m_bIsEnd = isend;
            return _this;
        }
        return Node;
    }(egret.HashObject));
    com_main.Node = Node;
    var DFA = /** @class */ (function (_super_1) {
        __extends(DFA, _super_1);
        function DFA() {
            return _super_1.call(this) || this;
        }
        DFA.searchDwords = function (content) {
            if (content == '' || !content) {
                return;
            }
            if (!this.m_pdwords) {
                this.createDFATree();
            }
            var i = 0;
            var tmpnode = this.m_nRootNode;
            while (i < content.length) {
                tmpnode = this.findDNode(tmpnode, content[i]);
                if (tmpnode == null) {
                    tmpnode = this.m_nRootNode;
                    i -= this.m_ptmpwords.length;
                    this.m_ptmpwords = [];
                }
                else if (tmpnode.m_bIsEnd) {
                    tmpnode = this.m_nRootNode;
                    this.m_ptmpwords.push(content[i]);
                    var tmpstr = '';
                    for (var j = 0; j < this.m_ptmpwords.length; j++) {
                        tmpstr += this.m_ptmpwords[j];
                    }
                    this.m_pwords.push(tmpstr);
                    i = i - this.m_ptmpwords.length + 1;
                    this.m_ptmpwords = [];
                }
                else {
                    this.m_ptmpwords.push(content[i]);
                }
                i++;
            }
        };
        DFA.createDFATree = function () {
            this.m_pdwords = L.getInstance().getObject(); //暂时借用语言包测试
            for (var word in this.m_pdwords) {
                if (this.m_pdwords[word]) {
                    var dwords = this.m_pdwords[word];
                    if (dwords.length > 0) {
                        this.insertDNode(this.m_nRootNode, dwords, 0);
                    }
                }
            }
        };
        DFA.insertDNode = function (drootNode, dwords, index) {
            var tnode = this.findDNode(drootNode, dwords[index]);
            if (tnode == null) {
                tnode = new Node(dwords[index]);
                drootNode.nodes.push(tnode);
            }
            if (index == dwords.length - 1) {
                tnode.m_bIsEnd = true;
            }
            index++;
            if (index < dwords.length) {
                this.insertDNode(tnode, dwords, index);
            }
        };
        DFA.findDNode = function (node, c) {
            var tnode = null;
            for (var i = 0; i < node.nodes.length; i++) {
                if (node.nodes[i].m_sIndex == c) {
                    tnode = node.nodes[i];
                    break;
                }
            }
            return tnode;
        };
        DFA.m_nRootNode = new Node('R');
        DFA.m_ptmpwords = [];
        DFA.m_pwords = [];
        return DFA;
    }(egret.HashObject));
    com_main.DFA = DFA;
})(com_main || (com_main = {}));
