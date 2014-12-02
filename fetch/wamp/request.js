'use strict';

var msgs= require('../../wamp/msgs'),
  makeProperty= require('../../util/make-property'),
  FetchRequest= require('../request')

module.exports= Request

function Request(){
	return this
}

Request.mixin= (function mixin(o){
	var divert= {}
	for(var i in FetchRequest.Fields){
		var name= FetchRequest.Fields[i]
		if(o[name] !== undefined){
			divert[name]= o[name]
			delete o[name]
		}
	}

	if(!(o instanceof Request)){
		var names= Object.getOwnPropertyNames(Request.prototype)
		for(var i in names){
			var name = names[i]
			if(o[name] === undefined){
				var descriptor = Object.getOwnPropertyDescriptor(Request.prototype, name)
				Object.defineProperty(o, name, descriptor)
			}
		}
	}
	FetchRequest.mixin(this)
	msgs.Call.mixin(o)

	for(var i in divert){
		o[i]= divert[i]
	}
	return o
})

Object.defineProperty(Request.prototype, 'method', makeProperty('this.options.method', {
	set: function(val){
		//console.log('set method:'+this.options.method)
		this.options.method= new String(val).toUpperCase()
	}
}))
Object.defineProperty(Request.prototype, 'url', makeProperty('this.options.url'))
Object.defineProperty(Request.prototype, 'headers', makeProperty('this.options.headers'))
Object.defineProperty(Request.prototype, 'referrer', makeProperty('this.options.headers.get("referrer")', {
	set: function(val){
		this.details.headers.set('referrer', val)
	}
}))
Object.defineProperty(Request.prototype, 'mode', makeProperty('this.options.mode', {default: '"cors"'}))
Object.defineProperty(Request.prototype, 'credentials', makeProperty('this.options.credentials', {default: '"same-origin"'}))

Request.prototype.clone= (function clone(){
	var newReq= new Request()
	for(var i in msgs.Call.fields){
		var field= msgs.Call.fields[i]
		newReq[field]= this[field]
	}
	return newReq
})
