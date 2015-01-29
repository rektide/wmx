'use strict';

var msgs= require('../../wamp/msgs'),
  isGlobal= require('../../util/is-global'),
  makeProperty= require('../../util/make-property'),
  mixin= require('../../util/mixin'),
  FetchResponse= require('../response')

module.exports= Response

function Response(o){
	if(this instanceof Response){
		msgs.Result.mixin(this)
		mixiner(this, o)
		return this
	}else{
		o= o|| {}
		msgs.Result.mixin(o)
		mixiner(o)
		return o
	}

}

Response.prototype= Object.create(FetchResponse.prototype)
Response.prototype.constructor= Response

Object.defineProperty(Response.prototype, 'url', makeProperty('this.details.url'))
Object.defineProperty(Response.prototype, 'status', makeProperty('this.details.status'))
Object.defineProperty(Response.prototype, 'headers', makeProperty('this.details.headers'))

Response.prototype.clone= (function clone(){
	return new Response(this)
})

var mixiner= mixin(Response.prototype)
Response.mixin= Response
