'use strict';

var msgs= require('../wamp/msgs'),
  makeProperty= require('../util/make-property'),
  FetchRequest= require('../request')

module.exports= Request

function Request(){
	return this
}

Request.mixin= (function mixin(o){
	FetchRequest.mixin(this)
	if(!(o instanceof Request)){
		for(var i in Reqest.prototype){
			o[i]= Request.prototype[i]
		}
	}
	return this
})

var noSet= {set: null}

Object.defineProperty(Request.prototype, 'method', makeProperty('this.details.method', noSet))
Object.defineProperty(Request.prototype, 'url', makeProperty('this.details.url', noSet))
Object.defineProperty(Request.prototype, 'headers', makeProperty('this.details.headers', noSet))
Object.defineProperty(Request.prototype, 'referrer', makeProperty('this.details.headers.get("referrer")', noSet))
Object.defineProperty(Request.prototype, 'mode', makeProperty('this.details.mode', {set: null, default: '"cors"'}))
Object.defineProperty(Request.prototype, 'credentials', makeProperty('this.details.credentials', {set: null, default: '"same-origin"'}))

Request.prototype.clone= (function clone(){
	var newReq= new Request()
	for(var i in msgs.Call.fields){
		var field= msgs.Call.fields[i]
		newReq[field]= this[field]
	}
	return newReq
})
