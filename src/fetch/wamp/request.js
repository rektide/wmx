'use strict';

var msgs= require('../../wamp/msgs'),
  makeProperty= require('../../util/make-property'),
  FetchRequest= require('../request')

module.exports= Request

function Request(){
	return this
}

Request.mixin= (function mixin(o){
	o.messageType.Call.mixin(o)
	FetchRequest.mixin(this)
	if(!(o instanceof Request)){
		for(var i in Reqest.prototype){
			if(!o[i])
				o[i]= Request.prototype[i]
		}
	}
	return this
})

Object.defineProperty(Request.prototype, 'method', makeProperty('this.details.method'), {
	set: function(val){
		this.method= new String(val).toUpperCase()
	}
})
Object.defineProperty(Request.prototype, 'url', makeProperty('this.details.url'))
Object.defineProperty(Request.prototype, 'headers', makeProperty('this.details.headers'))
Object.defineProperty(Request.prototype, 'referrer', makeProperty('this.details.headers.get("referrer")', {
	set: function(val){
		this.details.headers.set('referrer', val)
	}
}))
Object.defineProperty(Request.prototype, 'mode', makeProperty('this.details.mode', {default: '"cors"'}))
Object.defineProperty(Request.prototype, 'credentials', makeProperty('this.details.credentials', {default: '"same-origin"'}))

Request.prototype.clone= (function clone(){
	var newReq= new Request()
	for(var i in msgs.Call.fields){
		var field= msgs.Call.fields[i]
		newReq[field]= this[field]
	}
	return newReq
})
