module com_main {
    export class Node extends egret.HashObject {
		public m_bIsEnd: boolean = false;  //是否敏感字最后一一个
		public m_sIndex: string;           //敏感字树头
		public nodes: Node[] = [];         //以敏感字为树头的所有节点

		public constructor(c: string, isend: boolean = false) {
			super();
			this.m_sIndex = c;
			this.m_bIsEnd = isend;
		}
	}


	export class DFA extends egret.HashObject {
		private static m_pdwords: any[]; //敏感字配置
		private static m_nRootNode: Node = new Node('R');
		private static m_ptmpwords: string[] = [];
		public static m_pwords: string[] = [];


		public constructor() {
			super();
		}

		public static searchDwords(content: string) {
			if (content == '' || !content) {
				return;
			}
			if(!this.m_pdwords){
				this.createDFATree();
			}
			let i: number = 0;
			let tmpnode: Node = this.m_nRootNode;
			while (i < content.length) {
				tmpnode = this.findDNode(tmpnode, content[i]);
				if (tmpnode == null) {
					tmpnode = this.m_nRootNode;
					i -= this.m_ptmpwords.length;
					this.m_ptmpwords = [];
				} else if (tmpnode.m_bIsEnd) {
					tmpnode = this.m_nRootNode;
                    this.m_ptmpwords.push(content[i]);
					let tmpstr: string = '';
					for (let j: number = 0; j < this.m_ptmpwords.length; j++) {
						tmpstr += this.m_ptmpwords[j];
					}
					this.m_pwords.push(tmpstr);
                    i = i - this.m_ptmpwords.length + 1;
					this.m_ptmpwords = [];
				} else {
					this.m_ptmpwords.push(content[i]);
				}
				i++;
			}
		}

		public static createDFATree() {
		    this.m_pdwords = L.getInstance().getObject();   //暂时借用语言包测试
			for (let word in this.m_pdwords) {
				if (this.m_pdwords[word]) {
					let dwords: string = this.m_pdwords[word];
					if (dwords.length > 0) {
						this.insertDNode(this.m_nRootNode, dwords, 0);
					}
				}
			}
		}

		private static insertDNode(drootNode: Node, dwords: string, index: number) {
            let tnode = this.findDNode(drootNode, dwords[index]);
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

		}

		private static findDNode(node: Node, c: string): Node {
			let tnode: Node = null;
			for (let i: number = 0; i < node.nodes.length; i++) {
				if (node.nodes[i].m_sIndex == c) {
					tnode = node.nodes[i];
					break;
				}
			}
			return tnode;
		}
	}
}