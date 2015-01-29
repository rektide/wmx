'use strict';

var msgs= require('../../wamp/msgs'),
  makeProperty= require('../../util/make-property'),
  mixin= require('../../util/mixin'),
  isGlobal= require('../../util/is-global'),
  FetchRequest= require('../request')

module.exports= Request

function Request(o){
	if(this instanceof Request){
		msgs.Call.mixin(this)
		mixiner(this, o)
		return this
	}else{
		o= o|| {}
		msgs.Call.mixin(o)
		mixiner(o)
		return o
	}
}

Request.prototype= Object.create(FetchRequest.prototype)
Request.prototype.constructor= Request

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
	return new Request(this)
})

var mixiner= mixin(Request.prototype)
Request.mixin= Request
