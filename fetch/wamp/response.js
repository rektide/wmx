'use strict';

var msgs= require('../../wamp/msgs'),
  makeProperty= require('../../util/make-property'),
  mixin= require('../../util/mixin'),
  isGlobal= require('../../util/is-global'),
  FetchResponse= require('../response')

module.exports= Response

function Response(o){
	var self = isGlobal(this) ? mixiner(o) : mixiner(this, o)
	msgs.Call.mixin(self)
	return self
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
Response.mixin= mixiner
