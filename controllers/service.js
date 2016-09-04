"use strict";
var tools= require("../utils/tools"),
	exec= require("child_process").exec,
	config= require("../utils/config"),
	service= require("../models/service"),
	logger= require("../utils/logger"),
	fs= require("fs");

var history = {},
    idx = 1000,
    commands = [],
    envs= {};

exports.plist= function(req, res, next){
	function getFile(li, src_port){
        var _src = src_port|| config.base+ li.path+ li.src;
        return new Promise(function(resolve, reject){
        	fs.exists(_src, function(exists ){
        		if(exists){
        			fs.readFile(_src, "utf-8", function(err, result){
		                if(err){
		                    reject(err);
		                }else{
		                    var src2= "";
		                    if(!src_port){
		                        var env= result.match(/NODE_ENV[\s=]+"(\w+)/);
		                        	env= env? env[1]: "dev";
		                        src2 =config.base+ li.path+  "/utils/config_"+ {"dev": "development", "development": "development", "pl": "pl", "production": "production", "qa":"qa"}[env]+ ".js";
		                        li.env= env;
		                        envs[li.env]= envs[li.env]|| {count: 0};
		                        envs[li.env].count++;
		                    }else{
		                        li.port= result.match(/port[\s:]+(\d+)/)[1];
		                    }
		                    resolve(src2);
		                }
		            });
        		}else{
        			resolve();
        		}
        	});
        }).then(function(src2){
            if(src2){
                return getFile(li, src2);
            }else{
                return li;
            }
        });
   }
   //
   exec("cd "+ config.base +" && ls", function(err, result){
        var list= result.split(/\n/);
        var _list= [];
        var prs = [];

        exec("ps -ef |grep node", function(err, result2){
            for(let i= 0, ci; ci = list[i]; i++){
                _list.push({
                        path: ci,
                        port: 5000,
                        start: new RegExp("/"+ ci+ "/" ).test(result2)? 1: 0,
                        env: "dev",
                        src: "/utils/config.js"
                });
                prs.push(getFile(_list[i] ) );

            }
            //
            Promise.all(prs).then(function(values){
                //str.match(/NODE_ENV[\s=]+"(\w+)/)
                var hash = Math.random().toString().slice(-5)+ (idx++);
                history[hash] = hash;
                _list= _list.sort(function(v1, v2){
                        return v1.env>v2.env? 1: -1
                });
                logger.info(_list);
                res.render('service/list',{
			        title:"服务列表",
			        pageName:"serviceList",
			        serviceList: _list
			    });
            });
        });
    });
}

//api

exports.oplist= function(req, res, next){

}

exports.start= function(req, res, next){
	var query = req.query,
		path= query.path,
		command = "cd "+ config.base + path + "/ && forever start index.js";
	exec(command, function(err, result){
		var data= {
			code: 0,
			message: "success",
			data: result
		};
		if(err){
			data.code= 1000;
			data.message= JSON.stringify(err);
			data.data= result;
		}
		tools.rendJSON(req, res, data);
	});
}

exports.restart= function(req, res, next){
	var query = req.query,
		path= query.path,
		command = "cd "+ config.base + path + "/ && forever restart index.js";
	exec(command, function(err, result){
		var data= {
			code: 0,
			message: "success",
			data: result
		};
		if(err){
			data.code= 1000;
			data.message= JSON.stringify(err);
			data.data= result;
		}
		tools.rendJSON(req, res, data);
	});
}

exports.create= function(req, res, next){
	tools.rendJSON(req, res, {
		code: 0,
		message: "success",
		data: null
	});
}

exports.del= function(req, res, next){
	tools.rendJSON(req, res, {
		code: 0,
		message: "success",
		data: null
	});
}

exports.close= function(req, res, next){
	var query = req.query,
		path= query.path,
		command = "cd "+ config.base + path + "/ && forever stop index.js";
	exec(command, function(err, result){
		var data= {
			code: 0,
			message: "success",
			data: result
		};
		if(err){
			data.code= 1000;
			data.message= JSON.stringify(err);
			data.data= result;
		}
		tools.rendJSON(req, res, data);
	});
}