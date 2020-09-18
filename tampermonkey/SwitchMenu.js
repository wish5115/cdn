// ==UserScript==
// @name         油猴开关菜单库，支持批量添加
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  油猴开关菜单库，支持批量添加，为您解决批量添加开关菜单的烦恼
// @author       Wilson
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==
// cdn https://cdn.jsdelivr.net/gh/wish5115/cdn@0.1.1/tampermonkey/SwitchMenu.js

var SwitchMenu = {
    list : [], //菜单列表
    ids : {}, //菜单id对象
    //创建菜单
    create : function(){
        var _this = this;
        if(_this.list.length===0)return;
        //删除菜单
        for(var i in _this.ids){
           GM_unregisterMenuCommand(_this.ids[i]);
        }
        //开始创建
        _this.list.forEach(function(item, i){
            var currMenu = item[item.curr];
            _this.ids[currMenu.name] = GM_registerMenuCommand(currMenu.name, function(){
                //调用用户回调函数
                currMenu.callback();
                //反转开关
                item[item.curr].default = false;
                item[item.uncurr].default = true;
                var item_curr = item.curr;
                item.curr=item.uncurr;
                item.uncurr=item_curr;

                _this.create();
            }, currMenu.accessKey||null);
        });
    },
    //添加菜单配置
    add:function(conf){
        //兼容数组配置
        if(Object.prototype.toString.call(conf) === "[object Array]"){
            for(var i in conf){
                this.add(conf[i]);
            }
            return this;
        }
        //检查配置
        if(!conf.on.name||!conf.off.name){
            alert("SwitchMenu Item name is need.");
            return this;
        }
        if(!conf.on.callback){
            conf.on.callback = function(){};
        }
        if(!conf.off.callback){
            conf.off.callback = function(){};
        }
        if(conf.off.default){
            conf.curr="off"
            conf.uncurr="on"
            conf.on.default=false;
        }
        else if(conf.on.default){
            conf.curr="on"
            conf.uncurr="off";
            conf.off.default=false;
        }
        else{
            conf.curr="on"
            conf.uncurr="off";
            conf.off.default=false;
        }

        this.list.push(conf);
        return this;
    },
};

/** 使用演示：
SwitchMenu.add([
    {
        on : {
            default : true,
            name : "开启",
            callback : function(){
                alert("我开启了");
            }
        },
        off : {
            name : "关闭",
            callback : function(){
                alert("我关闭了");
            }
        }
    },
    {
        on : {
            name : "进入编辑模式",
            accessKey: 'E',
            callback : function(){
                alert("我已进入编辑模式");
            }
        },
        off : {
            default : true,
            name : "退出编辑模式",
            accessKey: 'X',
            callback : function(){
                alert("我已退出编辑模式");
            }
        }
    }
]);
SwitchMenu.create();
*/