"use strict";
var express= require("express"),
	path= require("path"),
	favicon= require("static-favicon"),
	cookieParser= require("cookie-parser"),
	bodyParser= require("body-parser"),
	session= require("express-session"),
	config= require("./utils/config"),
	tools= require("./utils/tools");
//
var api= require("./routers/api"),
	admin= require("./routers/admin");
//
var app= express();
app.set("views", path.join(__dirname, "views") );
app.set("view engine", "ejs");
//
app.use(favicon(__dirname+ "/public/imgs/favicon.png") );
app.use(bodyParser.json() );
app.use(bodyParser.urlencoded() );
app.use(cookieParser() );
app.use(express.static(path.join(__dirname, 'public'), {
    etag: true,
    maxAge: 1000*60*60,
    setHeaders: function (res, path, stat){
        res.set({
            "x-powered-by": "Weimob"
        });
    }
}));
app.use(session({
	key: "ops.sid",
	secret: "ops.sess.key001",
	cookie: {
		httpOnly: true,
		maxAge: new Date(new Date().getTime()+ 7*24*60*60*1000 )
	},
	resave: true,
	saveUninitialized: true
}));
app.use(function(req, res, next){
	res.locals.config= {
		version: Math.random().toString("32").slice(-5)
	};
	next();
});
//
app.use(admin);
app.use(api);
process.on('uncaughtException', function (err) {
    logger.error("global exception \n"+ err.stack);
});

app.listen(config.port);
console.log('[%s] [port:%s] [env:%s] start', new Date(), config.port, config.env);