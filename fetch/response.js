'use strict';

var Body = require('./body'),
  mixin= require('../util/mixin'),
  isGlobal= require('../util/is-global')

/*
[Constructor(optional BodyInit body, optional ResponseInit init),
 Exposed=(Window,Worker)]
interface Response {
  static Response error();
  static Response redirect(ScalarValueString url, optional unsigned short status = 302);

  readonly attribute ResponseType type;

  readonly attribute ScalarValueString url;
  readonly attribute unsigned short status;
  readonly attribute ByteString statusText;
  readonly attribute Headers headers;

  Response clone();
};
Response implements Body;

dictionary ResponseInit {
  unsigned short status = 200;
  ByteString statusText = "OK";
  HeadersInit headers;
};

enum ResponseType { "basic", "cors", "default", "error", "opaque" };
*/

module.exports= Response

function Response(o){
	return isGlobal(this) ? mixiner(o) : mixiner(this, o)
}

Response.prototype= Object.create(Body.prototype)
Response.prototype.constructor= Response

/*
(function mixin(o){
	mixiner(
	o= o|| {}
	Body.mixin(o)
	if(!(o instanceof Response)){
		var names = Object.getOwnPropertyNames(Response.prototype)
		for(var i = 0; i < names.length; ++i){
			var name= names[i]
			// I would prefer not evaluating
			// But I'm not about to recurse o & all proto's thereof
			if(o[name] === undefined && name !== 'constructor') {
				o[name]= Response.prototype[name]
			}
		}
	}
	return o
})
*/


Response.Fields= ['url', 'status', 'statusText', 'headers']

Response.ResponseType=[
	'basic',
	'cors',
	'default',
	'error',
	'opaque']

Object.defineProperty(Response.prototype, 'type', {
	get: function(){
		return this._type
	},
	set: function(val){
		if(Response.ResponseType.indexOf(val) === -1){
			throw new TypeError('type argument not of request type')
		}
		this._type= val
	}
})

var mixiner= mixin(Response.prototype)
Response.mixin= mixiner;
