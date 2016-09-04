/**
	对req和res进行处理的工具方法
**/
module.exports = {
	/**
		http响应json数据
		//转换net 数据大写字段
		添加json头信息
	**/
	rendJSON: function(req, res, json){
		//兼容
		//......
		if(json instanceof Object){
			json = JSON.stringify(json);
		}else{
			
		}
		var headers = {
		    'Content-Type': 'text/html',  //application/json  
		    'Access-Control-Allow-Origin': '*',
		    'Author':'http://www.fynut.com',
		    'charset':'utf-8',
		    'X-Powered-By':'Weimob'
		    //'Content-Length': _json.length
		};
		res.writeHead(200, headers);
		//res.write(s_json);
		res.end(json);
	},
	getServerIp: function(){
		var os=require('os'),
		    iptable={
		    	internal: "0.0.0.0"
		    },
		    ifaces=os.networkInterfaces();
		for (var dev in ifaces) {
		  ifaces[dev].forEach(function(details,alias){
		    if (details.family=='IPv4') {
		      iptable[dev+(alias?':'+alias:'')]=details.address;
		      if(/^(10|172|192)\./.test(details.address) ){
		      		iptable.internal= details.address;
		      }
		    }
		  });
		}
		return iptable;
	},
	/**
		获取用户ip
	**/
	getClientIp: function(req, res, next) {
	    var _ips= 	//req.headers['x-real-ip']||
	    			req.headers['x-forwarded-for'] ||
				    req.connection.remoteAddress ||
				    req.socket.remoteAddress ||
				    req.connection.socket.remoteAddress,
			_ip=	(_ips.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/gi)|| ["0.0.0.0"])[0];
	    return _ip;
	},
	/**
		位加密
	**/
	coder: function(str, _k){
		var i=0, code, str2 = "", k = _k||10;
		if(str){
			while(code = str.charCodeAt(i++)){
				str2 += String.fromCharCode(code^k);
			};
		}
		return str2;
	},
	/**
		禁用浏览器缓存
	**/
	nocache: function(req, res, next){
		res.header('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
	    res.header('Expires', '-1');
	    res.header('Pragma', 'no-cache');
	    next();
	}
}