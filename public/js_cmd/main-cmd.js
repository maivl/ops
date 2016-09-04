define(function(require, exports, module){
    var $ = window._$ = require("lib_cmd/zepto-cmd"),
    	myDialog = require("lib_cmd/myDialog-cmd"),
		$eles = {},
		eles = {};

	/**********************************
		页面初始化函数
	**********************************/
	function initPage(){

    }
	/**********************************
		页面初始化函数
	**********************************/
	$(function(){
		//页面操作所需元素对象
		$eles = {

		};
		//
		eles = (function(){
			function Eles(){
                var subscribe = false;
                Object.defineProperty(this, "subscribe", {
                    get: function(){
                        return subscribe;
                    },
                    set: function(v){
                        subscribe = v;
                    }
                });
			}
			return new Eles();
		})();
		//
		initPage();
	});

	/**********************************
		暴露相应对象
	**********************************/
	module.exports = {
		$eles: $eles,
		eles: eles
	}
});


