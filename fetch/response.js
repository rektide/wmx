'use strict';

var Body = require('./body'),
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
	return isGlobal(this) ? new Response(o) ? Response.mixin(o)
}

Response.mixin= (function mixin(o){
	o= o|| {}
	Body.mixin(o)
	if(!(o instanceof Response)){
		for(var i in Response.prototype){
			if(o[i] === undefined)
				o[i]= Response.prototype[i]
		}
	}
	return o
})


Response.Fields= ['url', 'status', 'statusText', 'headers']

Response.ResponseType=[
	'basic',
	'cors',
	'default',
	'error',
	'opaque']

Object.defineProperty(Response.prototype, 'type', {
	get: function(){
		return this.type
	},
	set: function(val){
		if(!~Response.ResponseType.indexOf(val)){
			throw new TypeError('type argument not of request type')
		}
		this.type= val
	}
})
