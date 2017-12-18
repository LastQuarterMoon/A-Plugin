/*
 * author: yangxin
 * date: 2017-12-12
 * description: 基于jquery的表单验证插件
 * 
 */
;(function($, window, document, undefined){
	
	//字符串格式化
	var sprintf = function (str) {
        var args = arguments,
            flag = true,
            i = 1;

        str = str.replace(/%s/g, function () {
            var arg = args[i++];

            if (typeof arg === 'undefined') {
                flag = false;
                return '';
            }
            return arg;
        });
        return flag ? str : '';
    };
    
    //提取部分定义
    var pluginName = 'validate',
    	defaults = {
    		rules: {},
	    	message: {}
    	},
    	msg = {
			required: "%s必填.",
			remote: "%sPlease fix this field.",
			email: "%s邮箱格式不对.",
			url: "%sPlease enter a valid URL.",
			date: "Please enter a valid date.",
			dateISO: "Please enter a valid date ( ISO ).",
			number: "Please enter a valid number.",
			digits: "Please enter only digits.",
			creditcard: "Please enter a valid credit card number.",
			equalTo: "Please enter the same value again.",
			maxlength: "%sPlease enter no more than {0} characters.",
			minlength: "%s短小.",
			rangelength: "Please enter a value between {0} and {1} characters long.",
			range: "Please enter a value between {0} and {1}.",
			max: "Please enter a value less than or equal to {0}.",
			min: "Please enter a value greater than or equal to {0}."
		};
    
    //定义构造函数
    var Validate = function(ele, opt, cb){
    	this.element = ele;
    	this.defaults = defaults;
    	this.options = opt;
    	this._cb = cb || function(){};
    	this._cbArg = {
    		'name': ''
    	};
    	this.msg = msg;
    	this._html = '';
    	
    	this.init();
    }
    
    //定义方法
    Validate.prototype = {
    	
    	init: function(){
    		var self = this;
    		self.initOptinos();
    		self.submitValidate();
    	},
    	
    	//初始化参数
    	initOptinos: function(){
    		var self = this,
    			inputArr = self.element.querySelectorAll('[v-label]');
			for (var i = 0; i < inputArr.length; i++) {
				var aInput = inputArr[i],
					aInputId = aInput.getAttribute('id'),
					aInputRules = {},
					aInputMsg = {},
					aInputLabel = aInput.getAttribute('v-label'),
					rulesArr = aInput.getAttribute('v-rules').split(',');
				aInputRules[aInputId] = {};
				aInputMsg[aInputId] = {};
				for (var j= 0; j < rulesArr.length; j++) {
					var jRule = {},
						jMsg = {};
					jRule[rulesArr[j]] = true;
					jMsg[rulesArr[j]] = sprintf(self.msg[rulesArr[j]], aInputLabel);
					$.extend(true, aInputRules[aInputId], jRule);
					$.extend(true, aInputMsg[aInputId], jMsg);
				}
				if( aInput.getAttribute('minLength') ){
					$.extend(true, aInputRules[aInputId], {
						minLength: aInput.getAttribute('minLength')*1
					});
					$.extend(true, aInputMsg[aInputId], {
						minLength: sprintf(self.msg.minlength, aInputLabel)
					});
				}
				$.extend(true, self.defaults.message, aInputMsg);
				$.extend(true, self.defaults.rules, aInputRules);
			}
			self.options.rules = $.extend(true, self.defaults.rules, self.options.rules);
			self.options.message = $.extend(true, self.defaults.message, self.options.message);
    	},
    	
    	//验证
    	submitValidate: function(){
    		var self = this;
    		$(document).off('click', self.options.button).on('click', self.options.button, function(){
    			self.check() && self._cb();
    		})
    	},
    	
    	//验证方法
    	check: function(){
    		var self = this,
    			result = true;
    		for ( i in self.options.rules) {
    			var ele = document.getElementById(i);
    			for ( k in self.options.rules[i]) {
    				if (self.options.rules[i][k] != false){
    					result = self.methods[k].call(this, ele.value, ele, self.options.rules[i][k]);
    				}
    				if( !result ){
    					self.errorHandle(self.options.message[i][k]);
    					return false;
    				}
    			}
    		}
    		return true;
    	},
    	//分类验证具体方法
    	methods: {
    		required: function( value ){
				return value.length > 0;
    		},
    		email: function( value ){
    			return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value );
    		},
    		minLength: function( value, ele, param ){
    			return value.length >= param;
    		}
    	},
    	//错误处理
    	errorHandle: function(msg){
    		$('body').after(msg+'<br>');
    	}
    }
    
    //使用对象
    $.fn[pluginName] = function(option, callBack){
    	this.each(function(){
    		return new Validate(this, option, callBack);
    	})
    }
})(jQuery, window, document)
