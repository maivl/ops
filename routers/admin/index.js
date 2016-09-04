"use strict";
var express= require("express"),
	router= express.Router();

var pages_ctls= {
	service: "../../controllers/service.js",
	svn: "../../controllers/svn.js",
	//user: "../../controllers/user.js",
	platform: "../../controllers/platform.js"
},
	pages= {
		err: {
			404: function(req, res, next){
				res.end("page404");
			}
		}
	};
//
for(let k in pages_ctls){
	let ctl= require(pages_ctls[k] );
	pages[k]= ctl;
}

router.use(function(req, res, next){
	let paths= req.path.split("/"),
		methodName= paths.pop(),
		actionName= paths.pop(),
		typeName= paths.pop(),
		action= null,
		method= null;

	if("ops"=== typeName){
		action= pages[actionName]|| pages["err"],
		method= action[methodName]|| action["404"];
		method.call(null, req, res, next);
	}else{
		next();
	}
});

module.exports= router;