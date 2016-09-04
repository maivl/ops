"use strict";
var tools= require("../utils/tools"),
	exec= require("child_process").exec,
	config= require("../utils/config"),
	fs= require("fs");

exports.co= function(req, res, next){
	tools.rendJSON(req, res, {
		code: 0,
		message: "success",
		data: null
	});
}

exports.up= function(req, res, next){
	var query = req.query,
		path= query.path,
		command = "cd "+ config.base + path + "/ && svn up";
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