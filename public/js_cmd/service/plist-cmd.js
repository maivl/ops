define(function(require, exports, module){
	var main= require("js_cmd/main-cmd"),
		Vue= window.Vue= require("lib_cmd/vue-cmd");
	Vue.config.debug= true;
	//
	Vue.filter("typeCount", function(tmp, type){
		if(type===tmp[1] ){
			tmp[0]++;
		}else{
			tmp= [1, type];
		}
		return tmp[0];
	});
	new Vue({
		el: "#serviceList",
		data: {
			serviceList: APP.serviceList,
			tmp: [1, '']
		},
		methods: {
			serviceOp: function(type, path, event){
				var l= loading();
				$.ajax({
	                type: "GET",
	                url: APP.urls[type],
	                data: {path: path},
	                async:true,
	                success: function(res){
	                   l.destroy();
	                   if(0== res.code){
	                   		alert('<div style="color: green;white-space: pre-line;text-align: left;height: 200px;overflow: scroll;">'+ res.data+'</div>');
	                   }else{
	                   		alert('<div style="color: green;white-space: pre-line;text-align: left;height: 200px;overflow: scroll;">'+ res.message+'</div>');
	                   }
	                },
	                dataType: "json"
	            });
			}
		}
	});
});