"use strict";
var express= require("express"),
	router= express.Router();

var api_ctls= {
	service: "../../controllers/service.js",
	svn: "../../controllers/svn.js",
	//user: "../../controllers/user.js",
	platform: "../../controllers/platform.js"
},
	apis= {
		err: {
			404: function(req, res, next){
				res.end("api404");
			}
		}
	};
//
for(let k in api_ctls){
	let ctl= require(api_ctls[k] );
	apis[k]= ctl;
}

router.use(function(req, res, next){
	let paths= req.path.split("/"),
		methodName= paths.pop(),
		actionName= paths.pop(),
		typeName= paths.pop(),
		action= null,
		method= null;
	if("api"=== typeName){
		action= apis[actionName]|| apis["err"],
		method= action[methodName]|| action["404"];
		method.call(null, req, res, next);
	}else{
		next();
	}
});

module.exports= router;