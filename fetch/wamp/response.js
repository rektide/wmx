'use strict';

var msgs= require('../../wamp/msgs'),
  makeProperty= require('../../util/make-property'),
  FetchResponse= require('../response')

module.exports= Response

function Response(){
	return this
}

Response.mixin= (function mixin(o){
	var divert= {}
	for(var i in FetchResponse.Fields){
		var name= FetchResponse.Fields[i]
		if(o[name] !== undefined){
			divert[name]= o[name]
			delete o[name]
		}
	}

	if(!(o instanceof Response)){
		var names= Object.getOwnPropertyNames(Response.prototype)
		for(var i in names){
			var name = names[i]
			if(o[name] === undefined){
				var descriptor = Object.getOwnPropertyDescriptor(Response.prototype, name)
				Object.defineProperty(o, name, descriptor)
			}
		}
	}
	FetchResponse.mixin(this)
	msgs.Result.mixin(o)

	for(var i in divert){
		o[i]= divert[i]
	}
	return o
})

Object.defineProperty(Response.prototype, 'url', makeProperty('this.options.url'))
Object.defineProperty(Response.prototype, 'status', makeProperty('this.options.status'))
Object.defineProperty(Response.prototype, 'headers', makeProperty('this.options.headers'))

Response.prototype.clone= (function clone(){
	var newReq= new Response()
	for(var i in msgs.Call.fields){
		var field= msgs.Call.fields[i]
		newReq[field]= this[field]
	}
	return newReq
})
