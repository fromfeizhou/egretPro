/// 阅读 api.d.ts 查看文档
///<reference path="api.d.ts"/>

import * as path from 'path';
import { UglifyPlugin, IncrementCompilePlugin, CompilePlugin, ManifestPlugin, ExmlPlugin, EmitResConfigFilePlugin, TextureMergerPlugin } from 'built-in';
import { WxgamePlugin } from './wxgame/wxgame';
import { BricksPlugin } from './bricks/bricks';
import { CustomPlugin } from './myplugin';

const config: ResourceManagerConfig = {


    buildConfig: (params) => {

        const { target, command, projectName, version } = params;

        if (command == 'build') {
            const outputDir = '.';
            return {
                outputDir,
                commands: [
                    // new EmitResConfigFilePlugin({
                    //     output: "resource/default.res.json",
                    //     typeSelector: p => {
                    //         let isImgOut = false;  //是否使用打包纹理（imgesOut 需要生成）
                    //         let match = isImgOut ? p.match(`resource\/assets\/(?!images\/)`) : p.match(`resource\/assets\/(?!imagesOut\/)`);
                    //         if (match) {
                    //             return config.typeSelector(p);
                    //         }
                    //         return ""
                    //     },
                    //     nameSelector: config.nameSelector,
                    //     groupSelector: config.groupSelector
                    // }),
                    new ExmlPlugin('debug'), // 非 EUI 项目关闭此设置
                    new IncrementCompilePlugin(),
                ]
            }
        }
        else if (command == 'publish') {
            const outputDir = `bin-release/web/${version}`;
            return {
                outputDir,
                commands: [
                    new CustomPlugin(),
                    new CompilePlugin({ libraryType: "release", defines: { DEBUG: false, RELEASE: true } }),
                    new ExmlPlugin('commonjs'), // 非 EUI 项目关闭此设置
                    new UglifyPlugin([
                        {
                            sources: ["main.js"],
                            target: "main.min.js"
                        },
                        //皮肤文件
                        {
                            sources: ["resource/default.thm.js"],
                            target: "default.thm.min.js"
                        },
                    ]),
                    new ManifestPlugin({ output: "manifest.json", hash: "crc32" })
                ]
            }
        }
        else {
            throw `unknown command : ${params.command}`
        }
    },

    nameSelector: (p) => {
        return path.basename(p).replace(/\./gi, "_")
    },

    typeSelector: (p) => {
        const ext = p.substr(p.lastIndexOf(".") + 1);
        const typeMap = {
            "jpg": "image",
            "png": "image",
            "webp": "image",
            "sheet": "sheet",
            "json": "json",
            "fnt": "font",
            "pvr": "pvr",
            "mp3": "sound",
            "zip": "zip",
            "exml": "text",
            "dbbin": "bin"
        }
        let type = typeMap[ext];
        if (type == "json" && p.indexOf("config") == -1) {
            if (p.indexOf("movieclip") >= 0) {
                type = "movieclip";
            } else if (p.indexOf("dargon") == -1) {
                type = "sheet";
            };
        }
        return type;
    },

    groupSelector: (p) => {
        if (p.indexOf("assets/sound") >= 0) {
            return "sound";
        }
        // if (p.indexOf("map/config/json") >= 0) {
        //     return "map_config"
        // }
        let arr = p.split('/')
        // 数组中倒数第二个就是文件夹名
        return arr[arr.length - 2]

    }
}


export = config;
