/*!
	a)将form表单提交转为异步方式
	b)author eric.wu wkf39988@gmail.com
	c)2015.09.29
*/
define(function(require, exports, module){
	var ajax3 = require("lib_cmd/ajax3-cmd");

	Object.defineProperties(HTMLFormElement.prototype, {
		_submit: {
			value: HTMLFormElement.prototype.submit,
			writable: false,
		    configurable: false,
		    enumerable: false
		},
		submit: {
			value: function(){
				this._submit();
			}
		}
	});

	HTMLFormElement.prototype.submit = function(){
		var _continue = true, self = this;
		if("onsubmit" in self){
			if("function" == typeof self.onsubmit){
				_continue = (false != this.onsubmit.call(self) );
			}else{
				_continue = true;
			}
		}else{
			_continue = true;
		}
		if(_continue){
			var form_loading = window.loading();
			new ajax3({
				url: this.action,
				formData: new FormData(self),
				type:this.method,
				callback: function(res){
					form_loading.destroy();
					delete form_loading;
					if( ("callBack" in self) && (typeof self.callBack == "function") ){
						self.callBack.call(null, res);
					}else{
						if(res && (0 == res.Status)){
							if(res.url){
								location.href = res.url;
							}else{
								alert(res.Message);
							}
						}else{
							alert(res.error);
						}
					}
				}
			});
		}
		return false;
	}

	return "rededine Form";
});